---
title: Lifetimes in Rust — Complete Guide
creation date: 2026-02-22T03:27:00
last edited: 2026-02-22T03:27:00
slug: rust-13
series: rust
excerpt:
lang: en
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQjmX93dXLnhAJQV7tb1QfvySrOIA1WB3J7A&s
tags:
  - 🦀rust
---

## What is a Lifetime?

A **lifetime** is Rust's way of tracking _how long a reference is valid_. Every reference in Rust has a lifetime, but most of the time the compiler infers it automatically (lifetime elision). Lifetimes prevent **dangling references** — pointers to memory that has already been freed.

```rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x; // ERROR: x doesn't live long enough
    }
    println!("{}", r); // x is already dropped here!
}
```

The compiler's **borrow checker** analyzes lifetimes at compile time — there is zero runtime cost.

---

## Lifetime Annotation Syntax

```rust
&i32        // a reference (no explicit lifetime)
&'a i32     // a reference with explicit lifetime 'a
&'a mut i32 // a mutable reference with explicit lifetime 'a
```

The `'a` is just a **name/label** — you can use `'a`, `'b`, `'x`, `'foo`, anything after `'`. It tells the compiler: "these references are related and must live at least this long."

### In Functions

```rust
// Without lifetime annotations — COMPILER ERROR
fn longest(x: &str, y: &str) -> &str { ... }

// Correct: tie the output lifetime to both inputs
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

This says: _"the returned reference will be valid as long as both x and y are valid."_ In practice, `'a` resolves to the **shorter** of the two lifetimes.

### In Structs

If a struct holds a reference, it must declare a lifetime:

```rust
struct Important<'a> {
    content: &'a str,  // the struct cannot outlive the data it references
}

impl<'a> Important<'a> {
    fn content(&self) -> &str {
        self.content
    }
}
```

---

## `'static` — The Special Lifetime

`'static` means the reference is **valid for the entire duration of the program**. It is the longest possible lifetime.

### Two ways something can be `'static`:

**1. String literals** — they are baked into the binary itself:

```rust
let s: &'static str = "Hello, world!"; // lives forever in the binary
```

**2. Owned data with no borrowed references** — if a type owns all its data and contains no non-static references, it satisfies `'static`. This is common in thread spawning:

```rust
use std::thread;

fn spawn_task<F: FnOnce() + Send + 'static>(f: F) {
    thread::spawn(f);
}

// This works: the closure owns all its data
let msg = String::from("hello");
spawn_task(move || println!("{}", msg)); // msg is moved in, no borrowed refs
```

### `'static` vs other lifetimes

||`'static`|`'a` / other|
|---|---|---|
|Duration|Entire program|Inferred from context, typically shorter|
|Where it lives|Binary / heap-allocated and leaked|Stack or heap with a defined scope|
|Common use|String literals, globals, thread data|Most function/struct references|
|Can coerce to shorter?|Yes — `'static` satisfies any `'a`|No — can't extend a shorter lifetime|

```rust
fn print_it(input: &'static str) {
    println!("{}", input);
}

print_it("hello");           // OK — string literal is 'static
let s = String::from("hi");
print_it(&s);                // ERROR — s is on the stack, not 'static
```

---

## All Implicit / Special Lifetime Tokens in Rust

Yes — there are several special lifetime tokens you should know:

### `'static`

Already covered. Lifetime of the entire program.

### `'_` — The Anonymous / Placeholder Lifetime

Tells the compiler _"infer this lifetime for me, but I'm acknowledging there is one here."_ Used when you don't care about the specific name but want to be explicit that a reference exists.

```rust
// These are equivalent:
fn foo(s: &str) -> &str { s }
fn foo<'a>(s: &'a str) -> &'a str { s }

// In impl blocks, '_ is useful:
impl fmt::Display for MyStruct<'_> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result { ... }
}
```

### `'a`, `'b`, etc. — Named Lifetimes (User-defined)

These are not keywords — you define them. They're just labels for the compiler.

### Summary Table of All Special Tokens

|Token|Meaning|
|---|---|
|`'static`|Lives for the entire program|
|`'_`|Anonymous, inferred by compiler|
|`'a`, `'b`, `'x`...|User-named lifetimes, scoped to the function/struct|

There are **no other built-in lifetime tokens** — just these three categories. Rust does not have a `'heap` or `'local` or anything else hidden.

---

## Lifetime Elision Rules (The Hidden Implicit Behavior)

This is the "dangerous" part you mentioned — Rust **silently applies rules** when you don't write lifetimes. If you don't know these rules, you might misunderstand what contract your function is actually making.

**Rule 1:** Each reference parameter gets its own lifetime.

```rust
fn foo(x: &i32, y: &i32)
// becomes:
fn foo<'a, 'b>(x: &'a i32, y: &'b i32)
```

**Rule 2:** If there is exactly one input lifetime, it is assigned to all output lifetimes.

```rust
fn first_word(s: &str) -> &str
// becomes:
fn first_word<'a>(s: &'a str) -> &'a str
```

**Rule 3:** If one of the parameters is `&self` or `&mut self`, its lifetime is assigned to all output lifetimes.

```rust
impl MyStruct {
    fn get_value(&self, x: &i32) -> &i32
    // becomes:
    fn get_value<'a, 'b>(&'a self, x: &'b i32) -> &'a i32
    // output is tied to self, NOT x
}
```

**If none of the rules apply, you must annotate manually** — the compiler will refuse to guess.

---

## Common Patterns and Examples

### Returning the longer-lived of two references

```rust
fn first_or<'a>(first: &'a str, fallback: &'a str) -> &'a str {
    if first.is_empty() { fallback } else { first }
}
```

### Struct holding a reference

```rust
struct Parser<'a> {
    input: &'a str,
    pos: usize,
}

impl<'a> Parser<'a> {
    fn new(input: &'a str) -> Self {
        Parser { input, pos: 0 }
    }
    fn remaining(&self) -> &'a str {  // note: tied to 'a, not self
        &self.input[self.pos..]
    }
}
```

### Multiple lifetime parameters

```rust
// x and y can have different lifetimes; result lives as long as x
fn pick_first<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    x
}
```

### Lifetime bounds on generics

```rust
// T must not contain any references shorter than 'a
fn store<'a, T: 'a>(data: T) -> Box<dyn Any + 'a> { ... }

// T must be 'static (own all data, no borrowed refs)
fn store_forever<T: 'static>(data: T) { ... }
```

---

## The `'static` Trap — Subtle Danger

A common mistake is thinking `T: 'static` means "T must be a static variable." It actually means **T contains no non-static references** — owned data satisfies this!

```rust
fn requires_static<T: 'static>(val: T) { }

requires_static(42i32);             // OK — owned
requires_static(String::from("hi")); // OK — owned
requires_static("hello");           // OK — &'static str

let s = String::from("temp");
requires_static(&s);                // ERROR — &s is not 'static
```

---

## Key Mental Model

Think of lifetimes like **scopes labeled with a name**. When you write `'a`, you're saying: _"I'm naming this scope, and all references tagged `'a` must be valid throughout it."_ The borrow checker ensures no reference outlives the data it points to.

Rust's lifetime system exists entirely at **compile time** — no tags, no counters, no overhead at runtime. If your code compiles, memory safety is guaranteed.