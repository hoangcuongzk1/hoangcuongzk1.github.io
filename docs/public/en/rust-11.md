---
title: Enums in Rust — Complete Guide
creation date: 2026-02-22T01:11:00
last edited: 2026-02-22T01:11:00
slug: rust-11
series: rust
excerpt:
lang: en
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQjmX93dXLnhAJQV7tb1QfvySrOIA1WB3J7A&s
tags:
  - 🦀rust
---

# Enums in Rust — Complete Guide

---

## What is an Enum?

An enum (enumeration) is a type that can be **one of several variants**. Each variant can optionally hold data.

---

## 1. Declaring an Enum

### Basic (no data)

```rust
enum Direction {
    North,
    South,
    East,
    West,
}
```

### With data per variant

```rust
enum Shape {
    Circle(f64),                        // tuple variant
    Rectangle(f64, f64),               // tuple variant with 2 fields
    Triangle { base: f64, height: f64 }, // struct variant (named fields)
    Dot,                                // unit variant
}
```

### With a generic

```rust
enum Maybe<T> {
    Some(T),
    None,
}
```

---

## 2. Initializing / Creating a Value

```rust
let dir = Direction::North;
let c   = Shape::Circle(3.14);
let r   = Shape::Rectangle(4.0, 5.0);
let t   = Shape::Triangle { base: 3.0, height: 6.0 };
```

---

## 3. Reading / Pattern Matching

### `match` — the primary way

```rust
match dir {
    Direction::North => println!("Going North"),
    Direction::South => println!("Going South"),
    Direction::East | Direction::West => println!("Going sideways"),
}
```

### Extracting inner data

```rust
match shape {
    Shape::Circle(r)            => println!("Circle, radius={r}"),
    Shape::Rectangle(w, h)      => println!("Rect {w}x{h}"),
    Shape::Triangle { base, height } => println!("Area={}", 0.5 * base * height),
    Shape::Dot                  => println!("Just a dot"),
}
```

### `if let` — when you only care about one variant

```rust
if let Shape::Circle(r) = shape {
    println!("It's a circle with radius {r}");
}
```

### `while let`

```rust
let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    println!("{top}");
}
```

### `matches!` macro — returns bool

```rust
let is_north = matches!(dir, Direction::North);
```

---

## 4. Modifying an Enum

Enums are values — you reassign them:

```rust
let mut dir = Direction::North;
dir = Direction::East; // just reassign
```

To mutate inner data, use `match` with a mutable reference:

```rust
let mut shape = Shape::Circle(1.0);

if let Shape::Circle(ref mut r) = shape {
    *r *= 2.0; // double the radius
}
```

---

## 5. Methods on Enums (`impl`)

```rust
impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r)             => std::f64::consts::PI * r * r,
            Shape::Rectangle(w, h)       => w * h,
            Shape::Triangle { base, height } => 0.5 * base * height,
            Shape::Dot                   => 0.0,
        }
    }

    fn is_round(&self) -> bool {
        matches!(self, Shape::Circle(_))
    }
}

let s = Shape::Circle(5.0);
println!("Area: {}", s.area()); // Area: 78.53...
```

---

## 6. Traits on Enums

```rust
#[derive(Debug, Clone, PartialEq)]
enum Color {
    Red,
    Green,
    Blue,
}

let c = Color::Red;
println!("{:?}", c);           // Red
let c2 = c.clone();
assert_eq!(c, c2);
```

---

## 7. The Standard `Option<T>` and `Result<T, E>`

These are just enums in std:

```rust
// Option<T>
let maybe: Option<i32> = Some(42);
let nothing: Option<i32> = None;

let val = maybe.unwrap_or(0);       // 42
let val = maybe.map(|x| x * 2);    // Some(84)

// Result<T, E>
let ok: Result<i32, &str> = Ok(10);
let err: Result<i32, &str> = Err("oops");

let val = ok.unwrap_or_else(|e| { eprintln!("{e}"); 0 });
```

---

## 8. Enum with `impl` + Associated Constants

```rust
enum Planet {
    Mercury,
    Earth,
    Mars,
}

impl Planet {
    fn mass_kg(&self) -> f64 {
        match self {
            Planet::Mercury => 3.30e23,
            Planet::Earth   => 5.97e24,
            Planet::Mars    => 6.42e23,
        }
    }
}
```

---

## 9. Iterating Over Variants (with `strum` crate)

Rust doesn't have built-in variant iteration, but the `strum` crate helps:

```rust
// Cargo.toml: strum = { version = "0.26", features = ["derive"] }
use strum::IntoEnumIterator;
use strum_macros::EnumIter;

#[derive(EnumIter, Debug)]
enum Direction { North, South, East, West }

for d in Direction::iter() {
    println!("{d:?}");
}
```

Without a crate, use a const array:

```rust
const ALL: &[Direction] = &[Direction::North, Direction::South, Direction::East, Direction::West];
```

---

## 10. Enum Casting to Integer

```rust
enum Status {
    Active = 1,
    Inactive = 2,
    Banned = 99,
}

let code = Status::Banned as u32; // 99
```

Going back (integer → enum) requires manual match or a crate like `num_enum`.

---

---

# When Should You Use an Enum?

**✅ Use an enum when:**

- A value can be **one of a fixed set of possibilities** — a state machine, a command type, an event, a result.
- Different variants need to carry **different data** (this is where enums shine over C-style enums).
- You want **exhaustive handling** — `match` forces you to cover all cases, preventing bugs.
- Modeling `optional` or `fallible` values (`Option`, `Result`).
- Replacing nullable pointers or boolean flags that encode state poorly.

```rust
// ✅ Great enum use case: a message type where each variant has different data
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(u8, u8, u8),
}
```

**❌ Don't use an enum when:**

- All variants share the **same fields** — use a struct instead.
- You need **inheritance or subtyping** across many types — use traits.
- You need a truly **open set** of variants that others can extend — use traits (enums are closed).
- You're modeling a single thing with multiple properties, not multiple distinct forms of a thing.

---

# Enum vs Struct — The Core Difference

||**Struct**|**Enum**|
|---|---|---|
|**Meaning**|A thing that **has** multiple fields simultaneously|A thing that **is** one of several possible forms|
|**Fields**|All fields exist at once|Only the active variant's data exists|
|**Memory**|Sum of all field sizes|Size of the largest variant (+ discriminant tag)|
|**Exhaustiveness**|N/A|`match` enforces all variants are handled|
|**Use for**|Grouping related data together|Expressing mutually exclusive states/types|

### Example that clarifies the distinction:

```rust
// A struct: a Point always has BOTH x and y
struct Point {
    x: f64,
    y: f64,
}

// An enum: a shape IS one thing at a time — never both a Circle and a Rect
enum Shape {
    Circle { center: Point, radius: f64 },
    Rectangle { top_left: Point, bottom_right: Point },
}
```

A real-world analogy: a **struct** is like a person (who always has a name, age, and height at the same time). An **enum** is like a traffic light — it's always exactly one of Red, Yellow, or Green, never two at once.

### You can combine them:

```rust
struct User {
    name: String,
    status: AccountStatus,   // enum field inside a struct
}

enum AccountStatus {
    Active,
    Suspended { reason: String },
    Deleted,
}
```

This is idiomatic Rust — structs hold your data, enums express the shape of that data's possible states.