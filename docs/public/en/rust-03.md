---
title: "Rust Closure Traits: A Complete Technical Reference"
creation date: 2026-02-18T01:00:00
last edited: 2026-02-18T01:00:00
slug: rust-03
series: rust
excerpt: A deep-dive into `Fn`, `FnMut`, and `FnOnce` — how they work, how the compiler decides which to use, and every practical use case you'll encounter.
lang: en
cover img: link to cover img
tags:
  - 🦀rust
---
# 1. What Is a Closure in Rust?

A **closure** is an anonymous function that can capture variables from the surrounding lexical scope. Unlike regular functions, closures have access to variables defined outside their own body.

```rust
let x = 10;
let add_x = |n| n + x;  // captures `x` from outer scope
println!("{}", add_x(5)); // 15
```

Internally, the compiler **desugars** every closure into a unique anonymous struct that implements one or more of the `Fn*` traits. The struct holds the captured variables as fields.

```rust
// Conceptual desugaring of: |n| n + x
struct __Closure { x: i32 }
impl Fn(i32) -> i32 for __Closure {
    fn call(&self, n: i32) -> i32 { n + self.x }
}
```

Every closure has a **unique, anonymous type**. Even two closures with identical bodies have distinct types:

```rust
let a = || 42;
let b = || 42;
// typeof(a) != typeof(b)  — they are different types
```

This is why closures are almost always used via trait objects or generics, not by name.

---

# 2. The Three Closure Traits

Rust defines three traits in `std::ops` that describe how a callable can be invoked:

## `FnOnce`

```rust
pub trait FnOnce<Args> {
    type Output;
    fn call_once(self, args: Args) -> Self::Output;
}
```

- Receives `self` **by value** — the closure is **consumed** on call.
- Can be called **at most once**.
- Every closure implements at least `FnOnce`.

## `FnMut`

```rust
pub trait FnMut<Args>: FnOnce<Args> {
    fn call_mut(&mut self, args: Args) -> Self::Output;
}
```

- Receives `self` **by mutable reference**.
- Can be called **multiple times**, and may mutate captured state.
- Implies `FnOnce`.

## `Fn`

```rust
pub trait Fn<Args>: FnMut<Args> {
    fn call(&self, args: Args) -> Self::Output;
}
```

- Receives `self` **by shared reference**.
- Can be called **multiple times concurrently**.
- Implies both `FnMut` and `FnOnce`.

---

# 3. Trait Hierarchy and Relationships

```txt
FnOnce  ← most permissive (fewest guarantees)
  ↑
FnMut   ← can call multiple times, may mutate
  ↑
Fn      ← most restrictive (strongest guarantees)
```

This hierarchy means:

- A `Fn` closure can be used anywhere `FnMut` or `FnOnce` is expected.
- A `FnMut` closure can be used anywhere `FnOnce` is expected.
- A `FnOnce` closure **cannot** be used where `Fn` or `FnMut` is expected.

```rust
fn call_fn<F: Fn()>(f: F) { f(); f(); }
fn call_fnmut<F: FnMut()>(mut f: F) { f(); f(); }
fn call_fnonce<F: FnOnce()>(f: F) { f(); }

let greeting = String::from("hello");

// Fn closure: only borrows
let show = || println!("{greeting}");
call_fn(show);    // ✅
call_fnmut(show); // ✅ (Fn implies FnMut)
call_fnonce(show);// ✅ (Fn implies FnOnce)

// FnOnce closure: consumes greeting
let consume = || drop(greeting);
call_fn(consume);     // ❌ cannot implement Fn
call_fnmut(consume);  // ❌ cannot implement FnMut
call_fnonce(consume); // ✅
```

---

# 4. How the Compiler Infers the Trait

The compiler determines which trait(s) a closure implements based on **how it uses captured variables**:

| What the closure does with a captured variable                         | Trait implemented             |
| ---------------------------------------------------------------------- | ----------------------------- |
| Does not capture anything, or only reads via immutable borrow          | `Fn` + `FnMut` + `FnOnce`     |
| Mutates a captured variable                                            | `FnMut` + `FnOnce` (not `Fn`) |
| Moves/consumes a captured value (e.g., `drop(x)`, returns owned value) | `FnOnce` only                 |

```rust
let s = String::from("hello");

// Reads: implements Fn
let read = || println!("{s}");

// Mutates: implements FnMut only
let mut count = 0;
let mut increment = || { count += 1; };

// Consumes: implements FnOnce only
let consume = || drop(s);
```

The compiler is conservative: it grants the **most restrictive** applicable trait. If a closure only reads, it's `Fn`. If it mutates, it's `FnMut`. If it consumes, it's `FnOnce`.

---

# 5. Capturing Environment: By Reference vs By Value

By default, closures capture variables using the **least invasive** method possible:

1. **Immutable borrow** (`&T`) — if only reading
2. **Mutable borrow** (`&mut T`) — if mutating
3. **Move / ownership** (`T`) — if consuming or if `move` is used

```rust
let x = vec![1, 2, 3];

// Captures &x (immutable borrow)
let print_x = || println!("{:?}", x);
print_x();
print_x(); // x is still usable here

// Captures &mut x (mutable borrow)
let mut y = vec![1, 2, 3];
let mut push_to_y = || y.push(4); // borrows &mut y
push_to_y();
// y is usable again after push_to_y is dropped

// Captures by value (move)
let z = vec![1, 2, 3];
let owns_z = move || println!("{:?}", z); // z is moved into closure
// println!("{:?}", z); // ❌ z was moved
```

When a closure borrows, its lifetime is tied to the lifetime of the captured variables. This can cause issues in async code or threads, which is why `move` closures are common there.

---

# 6. The `move` Keyword

`move` forces the closure to **take ownership** of all captured variables, regardless of how they are actually used.

```rust
let name = String::from("Alice");
let greet = move || println!("Hello, {name}");
// name is no longer accessible here
greet();
```

**When to use `move`:**

- Sending closures to another **thread** (requires `'static`, which means owned data).
- Returning closures from functions where the captured references would not outlive the function.
- Storing closures in structs that must outlive the scope where the closure was created.
- In **async blocks** and **futures** that must be `'static`.

```rust
use std::thread;

let message = String::from("hello from thread");

// Without move: ❌ message may not live long enough
// With move: ✅ thread owns message
thread::spawn(move || {
    println!("{message}");
});
```

Note: `move` does not change **which trait** the closure implements. If you move a `String` into a closure but only read it, the closure is still `Fn`. The trait depends on what you _do_ with the captured values, not how you captured them.

```rust
let s = String::from("hi");
let f = move || println!("{s}"); // Fn, despite move — only reads s
```

---

# 7. Closure as Function Parameters

## Using `impl Trait` (static dispatch)

```rust
fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(x)
}

// Equivalent shorthand:
fn apply(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(x)
}
```

This is **monomorphized**: the compiler generates a specialized version of the function for each concrete closure type. Zero runtime overhead, but larger binary.

## Multiple closures of the same type

When you need multiple parameters of the same closure type, use named generics:

```rust
fn apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(f(x))
}

// Two DIFFERENT closure types:
fn compose<F, G>(f: F, g: G, x: i32) -> i32
where
    F: Fn(i32) -> i32,
    G: Fn(i32) -> i32,
{
    g(f(x))
}
```

## FnMut parameter: requires `mut` binding

```rust
fn run_counter<F: FnMut() -> i32>(mut f: F) -> i32 {
    f() + f() + f()
}

let mut n = 0;
let counter = || { n += 1; n };
let total = run_counter(counter);
```

## FnOnce parameter: can only call once

```rust
fn consume_and_print<F: FnOnce() -> String>(f: F) {
    let result = f(); // consumes f
    println!("{result}");
    // f(); // ❌ already consumed
}
```

---

# 8. `impl Fn` vs `Box<dyn Fn>` vs `fn` Pointer

These are the three main ways to work with callable types in Rust:

## `impl Fn<...>` — Static dispatch (generics)

```rust
fn call(f: impl Fn(i32) -> i32) -> i32 { f(5) }
```

- **Zero-cost abstraction**: inlined by the compiler
- Function is monomorphized per concrete type
- Cannot be stored in heterogeneous collections
- Cannot be used for dynamic dispatch

## `Box<dyn Fn(...)>` — Dynamic dispatch (trait objects)

```rust
fn make_adder(x: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |n| n + x)
}
```

- Runtime polymorphism via vtable
- Small overhead per call (one pointer dereference)
- Can store multiple different closure types in a `Vec<Box<dyn Fn()>>`
- Required when returning closures of unknown type or storing them in structs without generics

```rust
let actions: Vec<Box<dyn Fn()>> = vec![
    Box::new(|| println!("action 1")),
    Box::new(|| println!("action 2")),
];
for action in &actions { action(); }
```

## `fn` — Bare function pointer

```rust
fn apply(f: fn(i32) -> i32, x: i32) -> i32 { f(x) }
```

- Only works with **non-capturing** closures or regular functions
- A capturing closure **cannot** be coerced to `fn`
- Slightly smaller type (just a pointer, no captures)

```rust
fn double(x: i32) -> i32 { x * 2 }
apply(double, 5);     // ✅
apply(|x| x * 2, 5); // ✅ (non-capturing closure coerces to fn)

let factor = 3;
apply(|x| x * factor, 5); // ❌ captures `factor`, not coercible to fn
```

---

# 9. Returning Closures from Functions

You cannot return a bare `impl Trait` from a trait method or store it easily without naming the type. There are two approaches:

## With `impl Fn` (opaque return type)

```rust
fn make_multiplier(factor: i32) -> impl Fn(i32) -> i32 {
    move |x| x * factor
}

let triple = make_multiplier(3);
println!("{}", triple(7)); // 21
```

Limitation: each call to `make_multiplier` returns the **same opaque type**. You cannot return different closures based on a runtime condition.

## With `Box<dyn Fn>` (dynamic dispatch)

```rust
fn make_op(add: bool) -> Box<dyn Fn(i32) -> i32> {
    if add {
        Box::new(|x| x + 1)
    } else {
        Box::new(|x| x - 1)
    }
}
```

## Returning `FnMut`

```rust
fn counter(start: i32) -> impl FnMut() -> i32 {
    let mut n = start;
    move || { let v = n; n += 1; v }
}

let mut c = counter(0);
println!("{}", c()); // 0
println!("{}", c()); // 1
println!("{}", c()); // 2
```

---

# 10. Storing Closures in Structs

## With a generic type parameter (static dispatch)

```rust
struct Transformer<F: Fn(i32) -> i32> {
    func: F,
}

impl<F: Fn(i32) -> i32> Transformer<F> {
    fn new(func: F) -> Self { Self { func } }
    fn run(&self, x: i32) -> i32 { (self.func)(x) }
}

let t = Transformer::new(|x| x * 2);
println!("{}", t.run(5)); // 10
```

## With `Box<dyn Fn>` (dynamic dispatch, flexible)

```rust
struct Handler {
    on_event: Box<dyn Fn(String)>,
}

impl Handler {
    fn new(f: impl Fn(String) + 'static) -> Self {
        Handler { on_event: Box::new(f) }
    }
    fn trigger(&self, event: String) {
        (self.on_event)(event);
    }
}
```

## With `Option<Box<dyn Fn>>` for optional callbacks

```rust
struct Button {
    label: String,
    on_click: Option<Box<dyn Fn()>>,
}

impl Button {
    fn new(label: &str) -> Self {
        Button { label: label.to_string(), on_click: None }
    }

    fn on_click(mut self, f: impl Fn() + 'static) -> Self {
        self.on_click = Some(Box::new(f));
        self
    }

    fn click(&self) {
        if let Some(f) = &self.on_click {
            f();
        }
    }
}

let btn = Button::new("OK").on_click(|| println!("Clicked!"));
btn.click();
```

## Storing `FnMut` (requires `RefCell` for interior mutability)

```rust
use std::cell::RefCell;

struct Counter {
    action: RefCell<Box<dyn FnMut() -> i32>>,
}

impl Counter {
    fn new(f: impl FnMut() -> i32 + 'static) -> Self {
        Counter { action: RefCell::new(Box::new(f)) }
    }

    fn tick(&self) -> i32 {
        (self.action.borrow_mut())()
    }
}
```

---

# 11. Higher-Order Functions and Combinators

Closures shine in iterator combinators. Understanding the traits helps you write them correctly.

```rust
let numbers = vec![1, 2, 3, 4, 5];

// map takes FnMut(Self::Item) -> B
let doubled: Vec<_> = numbers.iter().map(|&x| x * 2).collect();

// filter takes FnMut(&Self::Item) -> bool
let evens: Vec<_> = numbers.iter().filter(|&&x| x % 2 == 0).collect();

// fold takes FnMut(B, Self::Item) -> B
let sum = numbers.iter().fold(0, |acc, &x| acc + x);

// for_each takes FnMut(Self::Item)
numbers.iter().for_each(|&x| print!("{x} "));

// any / all take FnMut(&Self::Item) -> bool
let has_big = numbers.iter().any(|&x| x > 3);
```

## Writing your own combinator

```rust
fn transform_all<T, U, F>(items: Vec<T>, mut f: F) -> Vec<U>
where
    F: FnMut(T) -> U,
{
    items.into_iter().map(f).collect()
}

let result = transform_all(vec![1, 2, 3], |x| x.to_string());
```

## Chaining with closures that capture state

```rust
let threshold = 3;
let prefix = "item";

let result: Vec<String> = (1..=5)
    .filter(|&x| x > threshold)    // captures threshold
    .map(|x| format!("{prefix}-{x}")) // captures prefix
    .collect();

// ["item-4", "item-5"]
```

---

# 12. `FnOnce` in Practice: Consuming Closures

`FnOnce` is the right choice when the operation naturally consumes its inputs.

## Resource cleanup

```rust
fn with_resource<F: FnOnce(Resource) -> R, R>(f: F) -> R {
    let resource = Resource::new();
    let result = f(resource); // resource is consumed, guaranteed cleanup
    result
}
```

## One-shot initialization

```rust
use std::sync::Once;

static INIT: Once = Once::new();

INIT.call_once(|| {
    // Runs exactly once across the entire program
    println!("initialized!");
});
```

## Thread joining with owned data

```rust
use std::thread;

let data = vec![1, 2, 3];
let handle = thread::spawn(move || {
    // FnOnce: data moved into thread, used once
    data.iter().sum::<i32>()
});
let sum = handle.join().unwrap();
```

## Builder pattern with consuming closures

```rust
struct Request {
    url: String,
}

impl Request {
    fn send(self, handler: impl FnOnce(Response)) {
        // self is consumed by send
        let response = do_request(self);
        handler(response);
    }
}
```

---

# 13. `FnMut` in Practice: Stateful Closures

`FnMut` is for closures that accumulate state across multiple calls.

## Counters and generators

```rust
fn make_id_generator() -> impl FnMut() -> u64 {
    let mut id = 0u64;
    move || {
        id += 1;
        id
    }
}

let mut gen = make_id_generator();
println!("{}", gen()); // 1
println!("{}", gen()); // 2
println!("{}", gen()); // 3
```

## Memoization

```rust
fn memoize<A, R, F>(mut f: F) -> impl FnMut(A) -> R
where
    A: std::hash::Hash + Eq + Clone,
    R: Clone,
    F: FnMut(A) -> R,
{
    let mut cache = std::collections::HashMap::new();
    move |arg: A| {
        if let Some(cached) = cache.get(&arg) {
            cached.clone()
        } else {
            let result = f(arg.clone());
            cache.insert(arg, result.clone());
            result
        }
    }
}
```

## Logging / tracing wrappers

```rust
fn logged<F: FnMut(i32) -> i32>(mut f: F, name: &str) -> impl FnMut(i32) -> i32 + '_ {
    move |x| {
        println!("[{name}] input: {x}");
        let result = f(x);
        println!("[{name}] output: {result}");
        result
    }
}
```

## Sorting with mutable comparators

```rust
let mut calls = 0;
let mut data = vec![3, 1, 4, 1, 5, 9, 2, 6];
data.sort_by(|a, b| {
    calls += 1; // FnMut: tracks comparisons
    a.cmp(b)
});
println!("Comparisons: {calls}");
```

---

# 14. `Fn` in Practice: Shared, Reusable Closures

`Fn` closures are the most flexible. They can be called from multiple places, including concurrently.

## Passing to iterators

```rust
let multiplier = 3;
let result: Vec<i32> = (1..=5).map(|x| x * multiplier).collect();
// multiplier is &-captured; Fn
```

## Arc-shared callbacks

```rust
use std::sync::Arc;

let handler: Arc<dyn Fn(String) + Send + Sync> = Arc::new(|msg| {
    println!("received: {msg}");
});

let h1 = Arc::clone(&handler);
let h2 = Arc::clone(&handler);
// Both threads can call h1() and h2() concurrently
```

## Passing to retry logic

```rust
fn retry<F, T, E>(f: F, attempts: usize) -> Result<T, E>
where
    F: Fn() -> Result<T, E>,
{
    for _ in 0..attempts - 1 {
        if let Ok(val) = f() {
            return Ok(val);
        }
    }
    f()
}
```

---

# 15. Closures vs Function Pointers (`fn`)

||`fn(T) -> R`|`impl Fn(T) -> R`|`Box<dyn Fn(T) -> R>`|
|---|---|---|---|
|Captures environment|❌ No|✅ Yes|✅ Yes|
|Zero-cost|✅ Yes|✅ Yes|❌ vtable|
|Storable without generics|✅ Yes|❌ No|✅ Yes|
|Size|One pointer|Inline struct|Heap allocation|
|Use case|Callbacks to C, no captures|Hot paths, generics|Event systems, plugins|

```rust
// fn pointer: only non-capturing closures or named functions
let f: fn(i32) -> i32 = |x| x + 1; // ✅ no capture

let offset = 5;
let g: fn(i32) -> i32 = |x| x + offset; // ❌ captures offset

// impl Fn: capturing, static dispatch
fn apply(f: impl Fn(i32) -> i32) -> i32 { f(10) }
apply(|x| x + offset); // ✅
```

## C FFI: only `fn` pointers work

```rust
extern "C" fn c_callback(x: i32) -> i32 { x * 2 }

unsafe {
    some_c_function(c_callback as extern "C" fn(i32) -> i32);
}
```

---

# 16. Closures and Lifetimes

Closures that borrow from their environment carry lifetime constraints.

## Implicit lifetimes

```rust
fn make_printer<'a>(s: &'a str) -> impl Fn() + 'a {
    move || println!("{s}")
}

let owned = String::from("hello");
let printer = make_printer(&owned);
printer(); // ✅ owned still alive
drop(owned);
// printer(); // ❌ owned dropped, printer's borrow is invalid
```

## The `'static` bound

Many APIs (e.g., `thread::spawn`, `tokio::spawn`) require `F: 'static`, meaning the closure must not borrow anything that could be dropped.

```rust
fn spawn_static<F: FnOnce() + Send + 'static>(f: F) {
    std::thread::spawn(f);
}

let data = vec![1, 2, 3];
// spawn_static(|| println!("{data:?}")); // ❌ data not 'static

let data = vec![1, 2, 3];
spawn_static(move || println!("{data:?}")); // ✅ owned by closure
```

## Closures borrowing `self`

```rust
struct Config { debug: bool }

impl Config {
    fn make_logger(&self) -> impl Fn(&str) + '_ {
        move |msg| {
            if self.debug {
                println!("[DEBUG] {msg}");
            }
        }
    }
}
```

---

# 17. Closures in Async Rust

Async closures are not yet stable (as of Rust 1.77), but regular closures returning futures are common.

## Closure returning a `Future`

```rust
use std::future::Future;

fn async_map<F, Fut>(items: Vec<i32>, f: F) -> Vec<Fut>
where
    F: Fn(i32) -> Fut,
    Fut: Future<Output = String>,
{
    items.into_iter().map(f).collect()
}
```

## Tokio tasks require `move` + `Send` + `'static`

```rust
use tokio::task;

let data = vec![1, 2, 3];

task::spawn(async move {
    // data is moved into the async block
    println!("{data:?}");
});
```

## Storing async callbacks

```rust
use std::pin::Pin;
use std::future::Future;

type AsyncCallback = Box<dyn Fn(String) -> Pin<Box<dyn Future<Output = ()> + Send>> + Send + Sync>;

fn make_handler() -> AsyncCallback {
    Box::new(|msg| {
        Box::pin(async move {
            println!("handling: {msg}");
        })
    })
}
```

---

# 18. Closures in Multithreading

When sending closures across thread boundaries, they must implement `Send` (and usually be `'static`).

## `Send + 'static` requirement

```rust
use std::thread;

fn run_in_thread<F: FnOnce() + Send + 'static>(f: F) {
    thread::spawn(f).join().unwrap();
}

let x = 42;
run_in_thread(move || println!("{x}")); // move makes it 'static
```

## `Fn + Send + Sync` for shared callbacks

```rust
use std::sync::Arc;

fn broadcast<F: Fn(i32) + Send + Sync + 'static>(f: F, n: i32) {
    let f = Arc::new(f);
    let handles: Vec<_> = (0..n).map(|i| {
        let f = Arc::clone(&f);
        thread::spawn(move || f(i))
    }).collect();
    for h in handles { h.join().unwrap(); }
}

broadcast(|i| println!("thread {i}"), 4);
```

## Rayon parallel iterators

```rust
use rayon::prelude::*;

let data = vec![1, 2, 3, 4, 5];
let result: Vec<_> = data.par_iter()
    .map(|&x| x * 2) // Fn + Send + Sync
    .collect();
```

---

# 19. Common Compiler Errors and How to Fix Them

## Error: cannot move out of captured variable in `Fn` closure

```
error[E0507]: cannot move out of `name` which is behind a shared reference
```

```rust
let name = String::from("Alice");
let greet = || drop(name); // ❌ Fn can't move out

// Fix: use FnOnce
let greet: Box<dyn FnOnce()> = Box::new(|| drop(name)); // ✅
```

## Error: closure may outlive the current function

```
error[E0373]: closure may outlive the current function, but it borrows `x`
```

```rust
fn make_closure(x: &str) -> impl Fn() {
    || println!("{x}") // ❌ x may not live long enough
}

// Fix: use move
fn make_closure(x: String) -> impl Fn() {
    move || println!("{x}") // ✅ owned
}
```

## Error: expected `Fn`, found `FnMut`

```
error[E0277]: expected a closure that implements `Fn`, but this closure only implements `FnMut`
```

```rust
let mut count = 0;
let f = || { count += 1; count }; // FnMut

fn needs_fn<F: Fn() -> i32>(f: F) {}
needs_fn(f); // ❌

// Fix 1: make the captured var non-mutating
// Fix 2: change the bound to FnMut
fn needs_fnmut<F: FnMut() -> i32>(mut f: F) { f(); }
needs_fnmut(f); // ✅
```

## Error: `Box<dyn Fn>` called without `()`

```rust
let f: Box<dyn Fn()> = Box::new(|| println!("hi"));
f(); // ✅ Deref coercion makes this work
(*f)(); // ✅ explicit deref also works
```

## Error: missing `mut` when calling `FnMut`

```
error: cannot borrow `f` as mutable, as it is not declared as mutable
```

```rust
let f = || { /* mutates captured state */ };
f(); // ❌ f must be mut

let mut f = || { /* mutates captured state */ };
f(); // ✅
```

---

# 20. Performance Considerations

## Static dispatch is zero-cost

`impl Fn` / generic bounds are monomorphized. The compiler fully inlines the closure body.

```rust
// This is just as fast as writing the body inline
fn apply(f: impl Fn(i32) -> i32, x: i32) -> i32 { f(x) }
```

## Dynamic dispatch has overhead

`Box<dyn Fn>` requires a virtual dispatch (one pointer indirection) per call. In hot loops, this may be measurable.

```rust
// Prefer this in hot loops:
fn hot_loop(f: impl Fn(i32) -> i32) { for i in 0..1_000_000 { f(i); } }

// Over this:
fn hot_loop(f: &dyn Fn(i32) -> i32) { for i in 0..1_000_000 { f(i); } }
```

## Closure captures affect struct size

Each captured variable adds to the size of the closure struct. Large captures bloat stack frames.

```rust
// This closure is 24 bytes (3 × i64)
let (a, b, c): (i64, i64, i64) = (1, 2, 3);
let f = move || a + b + c;
```

For large captured data, prefer to capture a reference or an `Arc<T>`.

## `FnOnce` can be more efficient than `Fn`

`FnOnce` allows the closure to move its captured values into the return, avoiding copies.

```rust
// This avoids cloning large_data
fn process(data: Vec<u8>) -> impl FnOnce() -> Vec<u8> {
    move || { /* transform */ data }
}
```

---

# 21. Quick Reference Cheat Sheet

## Which trait to use?

```txt
Does the closure consume (move out of) a captured value?
  YES → FnOnce

Does the closure mutate a captured value?
  YES → FnMut

Otherwise → Fn
```

## Which bound to require?

```txt
Need to call multiple times AND from multiple threads → Fn + Send + Sync
Need to call multiple times → Fn (or FnMut if state is fine)
Need to call once → FnOnce (most permissive for callers)
```

## When to use `Box<dyn Fn>`?

- Returning closures from functions where the concrete type can vary
- Storing callbacks in structs without generic parameters
- Building event systems with multiple listeners of different types

## `move` keyword

```txt
Use move when:
  - Passing closure to a thread (requires 'static)
  - Returning closure from a function (prevents dangling references)
  - Storing closure longer than captured references live
```

## Summary table

|Trait|Self param|Callable|Implied by|Use case|
|---|---|---|---|---|
|`FnOnce`|`self`|Once|—|One-shot tasks, consuming resources|
|`FnMut`|`&mut self`|Many|`FnOnce`|Stateful iteration, counters, logging|
|`Fn`|`&self`|Many|`FnMut`, `FnOnce`|Shared callbacks, iterators, pure transforms|
|`fn`|N/A|Many|N/A|C FFI, non-capturing only|

---

_Generated with Rust 1.77+ semantics. Async closures (`async || {}`) are not yet stable and are not covered here._