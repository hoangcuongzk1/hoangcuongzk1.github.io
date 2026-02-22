---
title: Mastering Dictionary in Rust
creation date: 2026-02-22T01:00:00
last edited: 2026-02-22T01:00:00
slug: rust-10
series: rust
excerpt: Mastering Dictionary in Rust
lang: en
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQjmX93dXLnhAJQV7tb1QfvySrOIA1WB3J7A&s
tags:
  - 🦀rust
---
# Dictionaries in Rust: The Complete Guide

In Rust, "Dictionary" = **`HashMap<K, V>`** (and `BTreeMap<K, V>`). Let me cover everything.

---

## 1. Importing

```rust
use std::collections::HashMap;
use std::collections::BTreeMap; // sorted version
```

---

## 2. Initialization

```rust
// Empty
let mut map: HashMap<String, i32> = HashMap::new();

// With capacity hint (performance optimization)
let mut map: HashMap<String, i32> = HashMap::with_capacity(10);

// From an iterator / array of tuples
let map: HashMap<&str, i32> = HashMap::from([
    ("one", 1),
    ("two", 2),
    ("three", 3),
]);

// Using collect() from a vec of tuples
let pairs = vec![("a", 1), ("b", 2)];
let map: HashMap<&str, i32> = pairs.into_iter().collect();

// Using the maplit crate (popular shorthand)
// hashmap! { "a" => 1, "b" => 2 }
```

---

## 3. Inserting / Setting

```rust
map.insert("key".to_string(), 42);         // insert or overwrite
map.insert("key".to_string(), 99);         // returns Some(old_value) if overwritten

// Insert ONLY if key doesn't exist
map.entry("key".to_string()).or_insert(10);

// Insert with computed default
map.entry("key".to_string()).or_insert_with(|| expensive_fn());

// Insert default if missing, then modify the value
let count = map.entry("word".to_string()).or_insert(0);
*count += 1; // classic word-count pattern
```

---

## 4. Getting / Reading

```rust
// Returns Option<&V>
let val = map.get("key");                  // Some(&42) or None

// With pattern matching
match map.get("key") {
    Some(v) => println!("Found: {}", v),
    None    => println!("Not found"),
}

// Unwrap with default
let val = map.get("key").copied().unwrap_or(0);

// Direct index (panics if missing!)
let val = &map["key"];

// Get mutable reference
if let Some(v) = map.get_mut("key") {
    *v += 1;
}

// Check existence
map.contains_key("key");                   // bool
```

---

## 5. Removing

```rust
map.remove("key");                         // returns Option<V>
map.remove_entry("key");                   // returns Option<(K, V)>

// Retain only entries matching a condition
map.retain(|k, v| *v > 10);
```

---

## 6. Iterating

```rust
// Immutable iteration
for (k, v) in &map {
    println!("{}: {}", k, v);
}

// Mutable values
for (k, v) in &mut map {
    *v *= 2;
}

// Consuming (moves the map)
for (k, v) in map {
    println!("{}: {}", k, v);
}

// Keys only / Values only
for k in map.keys()   { println!("{}", k); }
for v in map.values() { println!("{}", v); }

// Mutable values iterator
for v in map.values_mut() { *v += 1; }
```

---

## 7. Merging / Updating

```rust
let other = HashMap::from([("c", 3), ("d", 4)]);

// Merge other into map (other's values win on conflict)
map.extend(other);

// Merge but don't overwrite existing keys
for (k, v) in other {
    map.entry(k).or_insert(v);
}
```

---

## 8. Useful Utility Methods

```rust
map.len();          // number of entries
map.is_empty();     // bool
map.clear();        // remove all entries
map.capacity();     // current allocated capacity

// Convert to Vec
let pairs: Vec<_> = map.into_iter().collect();
```

---

## 9. BTreeMap (sorted keys)

```rust
use std::collections::BTreeMap;
let mut map = BTreeMap::new();
map.insert(3, "three");
map.insert(1, "one");
// Iterates in sorted key order!

// Extra range methods:
for (k, v) in map.range(1..=3) { }
map.first_key_value();
map.last_key_value();
```

---

---

# Key Types: What Can Be a Key?

## For `HashMap<K, V>` — K must implement:

- **`Eq`** — equality comparison
- **`Hash`** — hashable

## For `BTreeMap<K, V>` — K must implement:

- **`Ord`** — total ordering (which also requires `PartialOrd`, `Eq`, `PartialEq`)

---

## Built-in types that work as keys out of the box

|Type|HashMap|BTreeMap|
|---|---|---|
|`String`, `&str`|✅|✅|
|`i8`, `i16`, `i32`, `i64`, `i128`, `isize`|✅|✅|
|`u8`, `u16`, `u32`, `u64`, `u128`, `usize`|✅|✅|
|`bool`|✅|✅|
|`char`|✅|✅|
|`f32`, `f64`|❌ (no `Eq`/`Hash`)|❌ (no `Ord`)|
|Tuples `(A, B, ...)` (if A,B implement traits)|✅|✅|
|Arrays `[T; N]` (if T implements traits)|✅|✅|
|`Option<T>` (if T implements traits)|✅|✅|
|Enums (derived)|✅|✅|
|Structs (derived)|✅|✅|

> Floats (`f32`/`f64`) **cannot** be keys because `NaN != NaN`, so they don't implement `Eq`.

---

## Creating Your Own Key Type

### For HashMap — derive `Eq` and `Hash`:

```rust
use std::collections::HashMap;

#[derive(Debug, Eq, PartialEq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let mut map = HashMap::new();
    map.insert(Point { x: 0, y: 0 }, "origin");
    map.insert(Point { x: 1, y: 2 }, "somewhere");

    println!("{:?}", map.get(&Point { x: 0, y: 0 })); // Some("origin")
}
```

### For BTreeMap — derive `Ord`:

```rust
use std::collections::BTreeMap;

#[derive(Debug, Eq, PartialEq, Ord, PartialOrd)]
struct Version {
    major: u32,
    minor: u32,
}

fn main() {
    let mut map = BTreeMap::new();
    map.insert(Version { major: 1, minor: 0 }, "stable");
    map.insert(Version { major: 2, minor: 3 }, "latest");
    // Iterates in version order!
}
```

### Custom Hash logic (manual implementation):

```rust
use std::hash::{Hash, Hasher};

#[derive(Eq, PartialEq)]
struct CaseInsensitiveStr(String);

impl Hash for CaseInsensitiveStr {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.to_lowercase().hash(state); // hash the lowercased version
    }
}
```

This is useful when you want **custom equality/hashing logic**, like case-insensitive string keys.

---

## Key Takeaway

Tutorials almost always use `String` as a key because it's the most relatable example, but **any type that implements `Eq + Hash`** works for `HashMap`, and **any type that implements `Ord`** works for `BTreeMap`. With `#[derive(...)]`, adding this to your own structs and enums takes just one line.
