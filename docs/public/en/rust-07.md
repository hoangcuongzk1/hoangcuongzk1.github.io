---
title: What is a Marker Trait in Rust ?
creation date: 2026-02-20T01:00:00
last edited: 2026-02-20T01:00:00
slug: rust-07
series: rust
excerpt:
lang: en
cover img: link to cover img
tags:
  - 🦀rust
---


# What is a Marker Trait?

A marker trait is a trait with **no methods, no associated types, no data** — just an empty body:

```rust
trait MyMarker {}
```

Its only purpose is to **attach a label/property to a type** that the compiler or other code can check.

---

# How the Compiler Uses Them

The compiler has special knowledge of certain marker traits and **changes its behavior** based on whether a type implements them:

|Marker Trait|What it tells the compiler|
|---|---|
|`Copy`|"Safe to duplicate bits, don't move"|
|`Send`|"Safe to transfer across threads"|
|`Sync`|"Safe to share reference across threads"|
|`Sized`|"Size is known at compile time"|
|`Freeze`|"No interior mutability" (internal)|
|`StructuralPartialEq`|"PartialEq is structural, usable in patterns"|

These are baked into the compiler itself — you can't replicate their effect with your own traits.

---

# How YOU Can Use Marker Traits

You can create your own marker traits to **constrain behavior at compile time** — this is a very powerful Rust pattern.

## Example: Typestate Pattern

```rust
// Marker traits representing states
trait State {}

struct Locked;
struct Unlocked;

impl State for Locked {}
impl State for Unlocked {}

// Door is generic over its state
struct Door<S: State> {
    _state: std::marker::PhantomData<S>,
}

impl Door<Locked> {
    pub fn unlock(self) -> Door<Unlocked> {
        println!("Unlocking...");
        Door { _state: std::marker::PhantomData }
    }
}

impl Door<Unlocked> {
    pub fn open(self) {
        println!("Opening door!");
    }
}

fn main() {
    let door = Door::<Locked> { _state: std::marker::PhantomData };
    // door.open(); // COMPILE ERROR! Can't open a locked door
    let door = door.unlock();
    door.open(); // OK!
}
```

The state is **enforced at compile time, zero runtime cost**.

---

## Example: Constraining Generic Functions

```rust
trait Validated {}
struct Email(String);

impl Email {
    fn new(s: &str) -> Option<Self> {
        if s.contains('@') {
            Some(Email(s.to_string()))
        } else {
            None
        }
    }
}

impl Validated for Email {}

fn send<T: Validated>(item: &T) {
    println!("Sending validated item!");
}

// Only types marked as Validated can be passed here
// Can't accidentally pass a raw String
```

---

# `PhantomData` — The Key Tool

When you use marker traits with generics, the compiler complains if you have unused type parameters. `PhantomData<T>` is the fix — it's a zero-sized type that says _"I logically own/use T even though I have no T field."_

```rust
use std::marker::PhantomData;

struct Tagged<T> {
    value: u32,
    _tag: PhantomData<T>, // zero size, just carries the type info
}
```

---

# Auto Traits (Special Markers)

`Send` and `Sync` are **auto traits** — the compiler automatically implements them for your type if all its fields satisfy them. You can also explicitly opt out:

```rust
struct MyType {
    ptr: *mut u8, // raw pointer makes it non-Send automatically
}

// Or manually opt out:
impl !Send for MyType {}
```

---

# Summary

- **Marker traits** = empty traits used as labels/flags on types
- **Compiler markers** (`Copy`, `Send`, `Sync`) = change compiler behavior, you just implement them
- **Your own markers** = enforce rules and states **at compile time with zero runtime cost**
- **`PhantomData`** = lets you carry type-level information in structs without storing actual data

The big idea is: **move checks from runtime to compile time**. Instead of panicking at runtime when something is misused, make it a compile error.