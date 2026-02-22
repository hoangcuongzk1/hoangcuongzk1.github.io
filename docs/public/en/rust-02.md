---
title: "Rust Collections: Complete Guide"
creation date: 2026-02-18T01:00:00
last edited: 2026-02-18T01:00:00
slug: rust-02
series: rust
excerpt: From basics to mastery — Arrays, Vectors, HashMaps, LinkedLists, VecDeque (Queue/Stack), and more.
lang: en
cover img: link to cover img
tags:
  - 🦀rust
---
# 1. Overview of Rust Collections

Rust's standard library provides a rich set of collections in `std::collections`. Unlike many languages, Rust's ownership and borrowing system deeply influences how collections work — you must think about who owns the data, how long references live, and whether mutation is needed.

|Collection|Use Case|Crate/Module|
|---|---|---|
|`[T; N]`|Fixed-size, stack-allocated sequence|Built-in primitive|
|`Vec<T>`|Dynamic growable list (most common)|`std::vec`|
|`HashMap<K, V>`|Key-value lookup, unordered|`std::collections`|
|`HashSet<T>`|Unique values, unordered|`std::collections`|
|`VecDeque<T>`|Queue / double-ended queue|`std::collections`|
|`LinkedList<T>`|Doubly linked list (rarely preferred)|`std::collections`|
|`BTreeMap<K, V>`|Key-value lookup, sorted by key|`std::collections`|
|`BTreeSet<T>`|Unique sorted values|`std::collections`|
|`BinaryHeap<T>`|Priority queue (max-heap)|`std::collections`|

---

# 2. Array `[T; N]`

## What is it?

An array in Rust is a **fixed-size, stack-allocated** sequence of elements of the same type. The size `N` is known at compile time and is part of the type. `[i32; 5]` and `[i32; 6]` are different types.

## Declaration and Initialization

```rust
// Basic declaration
let arr: [i32; 5] = [1, 2, 3, 4, 5];

// Inferred type
let arr = [10, 20, 30, 40, 50];

// Initialize all elements with the same value
let zeros = [0; 100]; // [0, 0, 0, ..., 0] (100 zeros)

// Mutable array
let mut nums = [3, 1, 4, 1, 5];
nums[0] = 99;
println!("{:?}", nums); // [99, 1, 4, 1, 5]
```

## Accessing Elements

```rust
let arr = [10, 20, 30, 40, 50];

// Index access (panics on out-of-bounds at runtime)
println!("{}", arr[2]); // 30

// Safe access using get() — returns Option<&T>
match arr.get(2) {
    Some(val) => println!("Found: {}", val),
    None => println!("Out of bounds"),
}

// First and last
println!("{:?}", arr.first()); // Some(10)
println!("{:?}", arr.last());  // Some(50)

// Length
println!("{}", arr.len()); // 5

// Is it empty?
println!("{}", arr.is_empty()); // false
```

## Slices

Arrays coerce to slices (`&[T]`), which are a view into a contiguous sequence:

```rust
let arr = [1, 2, 3, 4, 5];
let slice: &[i32] = &arr;        // whole array as slice
let mid: &[i32] = &arr[1..4];   // elements at index 1, 2, 3
println!("{:?}", mid);           // [2, 3, 4]
```

## Iteration

```rust
let arr = [10, 20, 30];

// Iterate by reference (most common)
for x in &arr {
    println!("{}", x);
}

// Iterate by value (copies or moves the element)
for x in arr {
    println!("{}", x);
}

// With index
for (i, x) in arr.iter().enumerate() {
    println!("arr[{}] = {}", i, x);
}
```

## Sorting

```rust
let mut arr = [5, 2, 9, 1, 7];
arr.sort();
println!("{:?}", arr); // [1, 2, 5, 7, 9]

// Sort descending
arr.sort_by(|a, b| b.cmp(a));
println!("{:?}", arr); // [9, 7, 5, 2, 1]

// Sort floats (use sort_by with partial_cmp)
let mut floats = [3.1f64, 1.4, 2.7];
floats.sort_by(|a, b| a.partial_cmp(b).unwrap());
```

## Searching

```rust
let arr = [10, 20, 30, 40, 50];

// Contains
println!("{}", arr.contains(&30)); // true

// Binary search (array must be sorted)
match arr.binary_search(&30) {
    Ok(idx) => println!("Found at index {}", idx),
    Err(idx) => println!("Not found, would insert at {}", idx),
}
```

## Common Methods

```rust
let arr = [3, 1, 4, 1, 5, 9, 2, 6];

// Min and max
println!("{:?}", arr.iter().min()); // Some(1)
println!("{:?}", arr.iter().max()); // Some(9)

// Sum and product
let sum: i32 = arr.iter().sum();
let product: i32 = arr.iter().product();

// Reverse in-place (mutable)
let mut arr2 = [1, 2, 3, 4, 5];
arr2.reverse();
println!("{:?}", arr2); // [5, 4, 3, 2, 1]

// Windows and chunks
for window in arr.windows(3) {
    println!("{:?}", window); // sliding windows of size 3
}
for chunk in arr.chunks(3) {
    println!("{:?}", chunk); // non-overlapping chunks of size 3
}
```

## 2D Arrays

```rust
// 2D array
let matrix: [[i32; 3]; 2] = [
    [1, 2, 3],
    [4, 5, 6],
];
println!("{}", matrix[1][2]); // 6

// Iterate over 2D array
for row in &matrix {
    for val in row {
        print!("{} ", val);
    }
    println!();
}
```

## When to Use Arrays

- When the size is **known at compile time** and won't change.
- For small, fixed data like days of the week, color channels (RGBA), coordinates.
- When you want **stack allocation** for performance (no heap allocation).
- As function parameters for fixed-length buffers.

---

# 3. Vector `Vec<T>`

## What is it?

`Vec<T>` is Rust's **dynamic, heap-allocated, growable array**. It's the most commonly used collection. When people say "list" in Rust, they almost always mean `Vec<T>`.

## Creation

```rust
// Empty vector with explicit type
let v: Vec<i32> = Vec::new();

// Empty vector with inferred type (add elements later)
let mut v = Vec::new();
v.push(1); // Rust infers Vec<i32>

// From a literal using the vec! macro
let v = vec![1, 2, 3, 4, 5];

// Pre-allocated capacity (avoids repeated reallocation)
let mut v: Vec<i32> = Vec::with_capacity(100);
println!("len={}, cap={}", v.len(), v.capacity()); // len=0, cap=100

// From a range
let v: Vec<i32> = (1..=5).collect();
println!("{:?}", v); // [1, 2, 3, 4, 5]

// From an array
let arr = [10, 20, 30];
let v = arr.to_vec();
```

## Adding and Removing Elements

```rust
let mut v = vec![1, 2, 3];

// Append to end
v.push(4);
println!("{:?}", v); // [1, 2, 3, 4]

// Remove and return last element
let last = v.pop(); // Some(4)
println!("{:?}", v); // [1, 2, 3]

// Insert at index (shifts remaining elements right — O(n))
v.insert(1, 99);
println!("{:?}", v); // [1, 99, 2, 3]

// Remove at index (shifts remaining elements left — O(n))
let removed = v.remove(1);
println!("Removed: {}", removed); // 99
println!("{:?}", v);              // [1, 2, 3]

// Swap remove (replaces with last element — O(1), doesn't preserve order)
v.swap_remove(0);
println!("{:?}", v); // [3, 2] — 3 (last) moved to index 0

// Remove all elements
v.clear();
println!("{:?}", v); // []

// Retain only elements matching a predicate
let mut v = vec![1, 2, 3, 4, 5, 6];
v.retain(|&x| x % 2 == 0);
println!("{:?}", v); // [2, 4, 6]

// Extend with another iterable
let mut v = vec![1, 2, 3];
v.extend([4, 5, 6]);
println!("{:?}", v); // [1, 2, 3, 4, 5, 6]

// Append another Vec (drains the other)
let mut a = vec![1, 2, 3];
let mut b = vec![4, 5, 6];
a.append(&mut b);
println!("a={:?}, b={:?}", a, b); // a=[1,2,3,4,5,6], b=[]

// Truncate to N elements
let mut v = vec![1, 2, 3, 4, 5];
v.truncate(3);
println!("{:?}", v); // [1, 2, 3]
```

## Accessing Elements

```rust
let v = vec![10, 20, 30, 40, 50];

// Index access (panics on out-of-bounds)
println!("{}", v[2]); // 30

// Safe access
println!("{:?}", v.get(2));  // Some(30)
println!("{:?}", v.get(10)); // None

// First and last
println!("{:?}", v.first()); // Some(10)
println!("{:?}", v.last());  // Some(50)

// Mutable access
let mut v = vec![1, 2, 3];
v[0] = 100;
if let Some(x) = v.get_mut(1) {
    *x = 200;
}
println!("{:?}", v); // [100, 200, 3]
```

## Slicing

```rust
let v = vec![1, 2, 3, 4, 5];
let slice = &v[1..4]; // [2, 3, 4]
println!("{:?}", slice);

// Mutable slice
let mut v = vec![1, 2, 3, 4, 5];
let slice = &mut v[1..4];
slice[0] = 99;
println!("{:?}", v); // [1, 99, 3, 4, 5]

// Split
let (left, right) = v.split_at(2);
println!("{:?} | {:?}", left, right); // [1, 99] | [3, 4, 5]
```

## Iteration

```rust
let v = vec![10, 20, 30];

// By reference
for x in &v {
    println!("{}", x);
}

// Mutable reference (modify in-place)
let mut v = vec![1, 2, 3];
for x in &mut v {
    *x *= 2;
}
println!("{:?}", v); // [2, 4, 6]

// Consuming iterator
for x in v {
    println!("{}", x);
}
// v is moved; can't use it after this

// With index
let v = vec!["a", "b", "c"];
for (i, val) in v.iter().enumerate() {
    println!("{}: {}", i, val);
}
```

## Sorting

```rust
let mut v = vec![5, 3, 1, 4, 2];
v.sort();
println!("{:?}", v); // [1, 2, 3, 4, 5]

// Unstable sort (faster, doesn't preserve order of equal elements)
v.sort_unstable();

// Sort by key
let mut words = vec!["banana", "apple", "cherry"];
words.sort_by_key(|s| s.len());
println!("{:?}", words); // ["apple", "banana", "cherry"]

// Sort with comparator
v.sort_by(|a, b| b.cmp(a)); // descending

// Sort structs
#[derive(Debug)]
struct Person { name: String, age: u32 }
let mut people = vec![
    Person { name: "Alice".to_string(), age: 30 },
    Person { name: "Bob".to_string(), age: 25 },
];
people.sort_by_key(|p| p.age);
println!("{:?}", people); // Bob (25), Alice (30)
```

## Searching and Filtering

```rust
let v = vec![1, 2, 3, 4, 5, 6];

// Contains
println!("{}", v.contains(&3)); // true

// Find (returns reference to first match)
let found = v.iter().find(|&&x| x > 3);
println!("{:?}", found); // Some(4)

// Position (returns index)
let pos = v.iter().position(|&x| x > 3);
println!("{:?}", pos); // Some(3)

// Filter into new vec
let evens: Vec<i32> = v.iter().filter(|&&x| x % 2 == 0).cloned().collect();
println!("{:?}", evens); // [2, 4, 6]

// Binary search (vec must be sorted)
match v.binary_search(&4) {
    Ok(idx) => println!("Found at {}", idx),
    Err(idx) => println!("Would insert at {}", idx),
}
```

## Transformation (Iterators)

```rust
let v = vec![1, 2, 3, 4, 5];

// Map: transform each element
let doubled: Vec<i32> = v.iter().map(|&x| x * 2).collect();
println!("{:?}", doubled); // [2, 4, 6, 8, 10]

// Filter + map (flat_map, filter_map)
let results: Vec<i32> = v.iter()
    .filter(|&&x| x % 2 != 0)
    .map(|&x| x * x)
    .collect();
println!("{:?}", results); // [1, 9, 25]

// Flatten nested vecs
let nested = vec![vec![1, 2], vec![3, 4], vec![5]];
let flat: Vec<i32> = nested.into_iter().flatten().collect();
println!("{:?}", flat); // [1, 2, 3, 4, 5]

// Fold/reduce
let sum = v.iter().fold(0, |acc, &x| acc + x);
println!("Sum: {}", sum); // 15

// Zip two vecs
let a = vec![1, 2, 3];
let b = vec!["one", "two", "three"];
let zipped: Vec<(i32, &str)> = a.into_iter().zip(b.into_iter()).collect();
println!("{:?}", zipped); // [(1, "one"), (2, "two"), (3, "three")]

// Chain two vecs
let c = vec![1, 2];
let d = vec![3, 4];
let chained: Vec<i32> = c.iter().chain(d.iter()).cloned().collect();
println!("{:?}", chained); // [1, 2, 3, 4]
```

## Deduplication

```rust
// Remove consecutive duplicates (sort first for full dedup)
let mut v = vec![1, 1, 2, 3, 3, 3, 4, 2];
v.dedup();
println!("{:?}", v); // [1, 2, 3, 4, 2]

// Full dedup: sort then dedup
let mut v = vec![3, 1, 2, 2, 3, 1];
v.sort();
v.dedup();
println!("{:?}", v); // [1, 2, 3]
```

## Vec of Strings (Common Pattern)

```rust
// Collecting strings
let v: Vec<String> = vec!["hello", "world"]
    .iter()
    .map(|&s| s.to_uppercase())
    .collect();
println!("{:?}", v); // ["HELLO", "WORLD"]

// Join strings
let words = vec!["Hello", "World"];
let sentence = words.join(" ");
println!("{}", sentence); // Hello World

// Split a string into Vec
let csv = "a,b,c,d";
let parts: Vec<&str> = csv.split(',').collect();
println!("{:?}", parts); // ["a", "b", "c", "d"]
```

## Capacity Management

```rust
let mut v: Vec<i32> = Vec::with_capacity(10);
println!("cap: {}", v.capacity()); // 10

v.push(1);
v.push(2);
v.push(3);
println!("len: {}, cap: {}", v.len(), v.capacity()); // len: 3, cap: 10

// Shrink capacity to fit length
v.shrink_to_fit();
println!("cap after shrink: {}", v.capacity()); // 3

// Reserve additional space
v.reserve(20);
println!("cap after reserve: {}", v.capacity()); // ≥ 23
```

## When to Use `Vec<T>`

- Default collection for **ordered, dynamic sequences**.
- Replacement for arrays when size is unknown at compile time.
- Building up a list incrementally (e.g., reading lines, collecting results).
- As a buffer, stack (with `push`/`pop`), or temporary storage.

---

# 4. HashMap `HashMap<K, V>`

## What is it?

`HashMap<K, V>` is an **unordered key-value store** using a hash table. Keys must implement `Eq` and `Hash`. It's Rust's equivalent of Python's `dict`, Java's `HashMap`, or JavaScript's `Map`.

## Creation

```rust
use std::collections::HashMap;

// Empty HashMap
let mut map: HashMap<String, i32> = HashMap::new();

// With initial capacity
let mut map: HashMap<&str, i32> = HashMap::with_capacity(100);

// From an iterator of tuples
let scores: HashMap<&str, i32> = [("Alice", 95), ("Bob", 87)].iter().cloned().collect();

// From two separate vecs (zip)
let keys = vec!["a", "b", "c"];
let vals = vec![1, 2, 3];
let map: HashMap<&str, i32> = keys.into_iter().zip(vals.into_iter()).collect();
```

## Inserting and Updating

```rust
use std::collections::HashMap;

let mut map = HashMap::new();

// Insert a key-value pair
map.insert("Alice", 100);
map.insert("Bob", 85);

// insert() returns the old value if the key existed
let old = map.insert("Alice", 95); // old = Some(100)
println!("{:?}", old); // Some(100)

// entry() API — the idiomatic way to insert or update
// Insert only if key doesn't exist
map.entry("Charlie").or_insert(70);
println!("{:?}", map.get("Charlie")); // Some(70)

// If key doesn't exist, insert computed value
map.entry("Dave").or_insert_with(|| 60 + 5);

// Modify existing value or insert default
let count = map.entry("Alice").or_insert(0);
*count += 10; // now Alice = 105

// Count word frequencies (classic pattern)
let text = "hello world hello rust world hello";
let mut word_count: HashMap<&str, usize> = HashMap::new();
for word in text.split_whitespace() {
    let count = word_count.entry(word).or_insert(0);
    *count += 1;
}
println!("{:?}", word_count);
// {"hello": 3, "world": 2, "rust": 1}
```

## Accessing Values

```rust
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("Alice", 95);
map.insert("Bob", 87);

// get() returns Option<&V>
println!("{:?}", map.get("Alice")); // Some(95)
println!("{:?}", map.get("Zara"));  // None

// Unwrap with default
let score = map.get("Alice").copied().unwrap_or(0);
println!("{}", score); // 95

// Index operator (panics if key not found!)
println!("{}", map["Alice"]); // 95

// get_mut() for mutable reference
if let Some(val) = map.get_mut("Bob") {
    *val += 5;
}
println!("{:?}", map.get("Bob")); // Some(92)
```

## Removing Entries

```rust
use std::collections::HashMap;

let mut map = HashMap::from([("a", 1), ("b", 2), ("c", 3)]);

// remove() returns the value (or None)
let removed = map.remove("b"); // Some(2)
println!("{:?}", removed);

// remove_entry() returns both key and value
let entry = map.remove_entry("a"); // Some(("a", 1))

// Retain matching entries
map.insert("d", 4);
map.insert("e", 5);
map.retain(|_, v| *v > 2);
println!("{:?}", map); // {"c": 3, "d": 4, "e": 5}
```

## Checking and Querying

```rust
use std::collections::HashMap;

let map = HashMap::from([("a", 1), ("b", 2)]);

println!("{}", map.contains_key("a")); // true
println!("{}", map.contains_key("z")); // false
println!("{}", map.len());             // 2
println!("{}", map.is_empty());        // false
```

## Iteration

```rust
use std::collections::HashMap;

let map = HashMap::from([("Alice", 95), ("Bob", 87), ("Charlie", 78)]);

// Iterate over key-value pairs
for (key, value) in &map {
    println!("{}: {}", key, value);
}

// Iterate over keys only
for key in map.keys() {
    println!("{}", key);
}

// Iterate over values only
for value in map.values() {
    println!("{}", value);
}

// Collect keys into sorted vec
let mut keys: Vec<&&str> = map.keys().collect();
keys.sort();
println!("{:?}", keys);

// Mutable iteration
let mut map = HashMap::from([("a", 1), ("b", 2)]);
for val in map.values_mut() {
    *val *= 10;
}
println!("{:?}", map); // {"a": 10, "b": 20}
```

## Merging HashMaps

```rust
use std::collections::HashMap;

let mut map1 = HashMap::from([("a", 1), ("b", 2)]);
let map2 = HashMap::from([("b", 99), ("c", 3)]);

// Extend: map2 overwrites map1's values for shared keys
map1.extend(map2);
println!("{:?}", map1); // {"a": 1, "b": 99, "c": 3}

// Merge without overwriting existing keys
let mut base = HashMap::from([("a", 1), ("b", 2)]);
let updates = HashMap::from([("b", 99), ("c", 3)]);
for (k, v) in updates {
    base.entry(k).or_insert(v);
}
println!("{:?}", base); // {"a": 1, "b": 2, "c": 3}
```

## HashMap with Custom Types as Keys

```rust
use std::collections::HashMap;

// Custom key: must derive Hash and Eq
#[derive(Hash, Eq, PartialEq, Debug)]
struct Point {
    x: i32,
    y: i32,
}

let mut grid: HashMap<Point, &str> = HashMap::new();
grid.insert(Point { x: 0, y: 0 }, "origin");
grid.insert(Point { x: 1, y: 2 }, "some point");

println!("{:?}", grid.get(&Point { x: 0, y: 0 })); // Some("origin")
```

## HashMap with `Vec` Values (Grouping)

```rust
use std::collections::HashMap;

let data = vec![("fruits", "apple"), ("vegs", "carrot"), ("fruits", "banana"), ("vegs", "pea")];

let mut groups: HashMap<&str, Vec<&str>> = HashMap::new();
for (category, item) in data {
    groups.entry(category).or_insert_with(Vec::new).push(item);
}
println!("{:?}", groups);
// {"fruits": ["apple", "banana"], "vegs": ["carrot", "pea"]}
```

## Performance and Custom Hashers

By default, `HashMap` uses `SipHash` which is DoS-resistant but not the fastest. For performance-critical code:

```rust
// Using the faster FxHashMap from the rustc-hash crate
// Add to Cargo.toml: rustc-hash = "1"
use rustc_hash::FxHashMap;
let mut map: FxHashMap<u64, u64> = FxHashMap::default();
map.insert(1, 100);

// Using AHashMap for fast hashing (ahash crate)
// Add to Cargo.toml: ahash = "0.8"
use ahash::AHashMap;
let mut map: AHashMap<String, i32> = AHashMap::new();
```

## When to Use `HashMap`

- **Fast key-based lookup**: checking membership, looking up associated data.
- **Counting/frequency tables**: word count, character frequency.
- **Grouping**: grouping items by category.
- **Memoization/caching**: caching expensive computation results.
- **Configuration storage**: string key to value mappings.

---

# 5. HashSet `HashSet<T>`

## What is it?

`HashSet<T>` is an **unordered collection of unique values**. Internally it's a `HashMap<T, ()>`.

```rust
use std::collections::HashSet;

// Creation
let mut set: HashSet<i32> = HashSet::new();
let set = HashSet::from([1, 2, 3, 4, 5]);
let set: HashSet<i32> = vec![1, 2, 2, 3, 3, 3].into_iter().collect(); // deduplicates

// Insert and remove
let mut set = HashSet::new();
set.insert(1); // returns true (inserted)
set.insert(1); // returns false (already exists)
set.remove(&1); // returns true

// Membership
println!("{}", set.contains(&2)); // true/false

// Set operations
let a: HashSet<i32> = [1, 2, 3, 4].iter().cloned().collect();
let b: HashSet<i32> = [3, 4, 5, 6].iter().cloned().collect();

// Intersection
let inter: HashSet<&i32> = a.intersection(&b).collect();
println!("{:?}", inter); // {3, 4}

// Union
let union: HashSet<&i32> = a.union(&b).collect();
println!("{:?}", union); // {1, 2, 3, 4, 5, 6}

// Difference (in a but not b)
let diff: HashSet<&i32> = a.difference(&b).collect();
println!("{:?}", diff); // {1, 2}

// Symmetric difference (in one but not both)
let sym_diff: HashSet<&i32> = a.symmetric_difference(&b).collect();
println!("{:?}", sym_diff); // {1, 2, 5, 6}

// Subset / superset
let small: HashSet<i32> = [1, 2].iter().cloned().collect();
println!("{}", small.is_subset(&a));   // true
println!("{}", a.is_superset(&small)); // true
```

---

# 6. VecDeque `VecDeque<T>`

## What is it?

`VecDeque<T>` is a **double-ended queue** (deque) backed by a ring buffer. It supports efficient push and pop from **both ends** — making it ideal for both queues (FIFO) and deques.

## Creation

```rust
use std::collections::VecDeque;

let mut deque: VecDeque<i32> = VecDeque::new();
let mut deque = VecDeque::with_capacity(10);
let mut deque: VecDeque<i32> = vec![1, 2, 3].into();
let deque = VecDeque::from([10, 20, 30]);
```

## Queue (FIFO) Usage

```rust
use std::collections::VecDeque;

let mut queue: VecDeque<&str> = VecDeque::new();

// Enqueue (push to back)
queue.push_back("first");
queue.push_back("second");
queue.push_back("third");

// Peek at front without removing
println!("{:?}", queue.front()); // Some("first")

// Dequeue (pop from front)
while let Some(item) = queue.pop_front() {
    println!("Processing: {}", item);
}
// first, second, third
```

## Stack via Deque

```rust
use std::collections::VecDeque;

let mut stack: VecDeque<i32> = VecDeque::new();
stack.push_back(1);
stack.push_back(2);
stack.push_back(3);
println!("{:?}", stack.pop_back()); // Some(3) — LIFO
println!("{:?}", stack.pop_back()); // Some(2)
```

## Full Double-Ended Operations

```rust
use std::collections::VecDeque;

let mut deque = VecDeque::from([3, 4, 5]);

// Push to front
deque.push_front(2);
deque.push_front(1);

// Push to back
deque.push_back(6);
deque.push_back(7);

println!("{:?}", deque); // [1, 2, 3, 4, 5, 6, 7]

// Peek
println!("{:?}", deque.front()); // Some(1)
println!("{:?}", deque.back());  // Some(7)

// Pop from both ends
println!("{:?}", deque.pop_front()); // Some(1)
println!("{:?}", deque.pop_back());  // Some(7)
println!("{:?}", deque);             // [2, 3, 4, 5, 6]
```

## Index Access and Rotation

```rust
use std::collections::VecDeque;

let mut deque = VecDeque::from([1, 2, 3, 4, 5]);

// Index access
println!("{}", deque[2]); // 3

// Rotate left (front elements go to back)
deque.rotate_left(2);
println!("{:?}", deque); // [3, 4, 5, 1, 2]

// Rotate right
deque.rotate_right(1);
println!("{:?}", deque); // [2, 3, 4, 5, 1]

// Convert to Vec
let v: Vec<i32> = deque.into();
println!("{:?}", v);
```

## Real-World: BFS (Breadth-First Search)

```rust
use std::collections::VecDeque;

fn bfs(graph: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    let mut visited = vec![false; graph.len()];
    let mut queue = VecDeque::new();
    let mut order = Vec::new();

    queue.push_back(start);
    visited[start] = true;

    while let Some(node) = queue.pop_front() {
        order.push(node);
        for &neighbor in &graph[node] {
            if !visited[neighbor] {
                visited[neighbor] = true;
                queue.push_back(neighbor);
            }
        }
    }
    order
}
```

## When to Use `VecDeque`

- **Queue (FIFO)**: task queues, BFS, event processing.
- **Sliding window**: efficiently add to one end, remove from the other.
- **Rotating buffer**: circular/ring buffer behavior.
- **Deque algorithms**: palindrome checking, sliding window maximum.

---

# 7. Stack using `Vec<T>`

## What is it?

Rust does not have a dedicated `Stack` type. The idiomatic approach is to use `Vec<T>` with `push` (add to top) and `pop` (remove from top) which naturally implements **LIFO (Last In, First Out)** behavior. This is efficient: both operations are O(1).

## Basic Stack Operations

```rust
let mut stack: Vec<i32> = Vec::new();

// Push (add to top)
stack.push(10);
stack.push(20);
stack.push(30);

// Peek (look at top without removing)
println!("{:?}", stack.last()); // Some(30)

// Pop (remove from top)
println!("{:?}", stack.pop()); // Some(30)
println!("{:?}", stack.pop()); // Some(20)
println!("{:?}", stack.pop()); // Some(10)
println!("{:?}", stack.pop()); // None (empty)
```

## Building a Stack Struct

```rust
#[derive(Debug)]
struct Stack<T> {
    data: Vec<T>,
}

impl<T> Stack<T> {
    pub fn new() -> Self {
        Stack { data: Vec::new() }
    }

    pub fn push(&mut self, item: T) {
        self.data.push(item);
    }

    pub fn pop(&mut self) -> Option<T> {
        self.data.pop()
    }

    pub fn peek(&self) -> Option<&T> {
        self.data.last()
    }

    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    pub fn size(&self) -> usize {
        self.data.len()
    }
}

fn main() {
    let mut stack = Stack::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    println!("Top: {:?}", stack.peek()); // Some(3)
    println!("Popped: {:?}", stack.pop()); // Some(3)
    println!("Size: {}", stack.size());    // 2
}
```

## Real-World: Balanced Parentheses Checker

```rust
fn is_balanced(s: &str) -> bool {
    let mut stack = Vec::new();
    for ch in s.chars() {
        match ch {
            '(' | '[' | '{' => stack.push(ch),
            ')' => { if stack.pop() != Some('(') { return false; } },
            ']' => { if stack.pop() != Some('[') { return false; } },
            '}' => { if stack.pop() != Some('{') { return false; } },
            _ => {}
        }
    }
    stack.is_empty()
}

fn main() {
    println!("{}", is_balanced("({[]})")); // true
    println!("{}", is_balanced("({[}])"));  // false
}
```

## Real-World: Undo/Redo System

```rust
struct Editor {
    text: String,
    undo_stack: Vec<String>,
}

impl Editor {
    fn new() -> Self {
        Editor { text: String::new(), undo_stack: Vec::new() }
    }

    fn type_text(&mut self, s: &str) {
        self.undo_stack.push(self.text.clone());
        self.text.push_str(s);
    }

    fn undo(&mut self) {
        if let Some(prev) = self.undo_stack.pop() {
            self.text = prev;
        }
    }
}

fn main() {
    let mut ed = Editor::new();
    ed.type_text("Hello");
    ed.type_text(", World");
    println!("{}", ed.text); // Hello, World
    ed.undo();
    println!("{}", ed.text); // Hello
    ed.undo();
    println!("{}", ed.text); // (empty)
}
```

## Real-World: Recursive to Iterative (DFS)

```rust
fn dfs_iterative(graph: &Vec<Vec<usize>>, start: usize) -> Vec<usize> {
    let mut visited = vec![false; graph.len()];
    let mut stack = vec![start];
    let mut result = Vec::new();

    while let Some(node) = stack.pop() {
        if visited[node] { continue; }
        visited[node] = true;
        result.push(node);
        for &neighbor in graph[node].iter().rev() {
            if !visited[neighbor] {
                stack.push(neighbor);
            }
        }
    }
    result
}
```

---

# 8. LinkedList `LinkedList<T>`

## What is it?

`LinkedList<T>` is a **doubly linked list**. Unlike `Vec<T>`, it does not use contiguous memory — each element is a separately heap-allocated node with pointers to next and previous.

> **Warning:** In practice, `Vec<T>` or `VecDeque<T>` almost always outperforms `LinkedList<T>` in Rust due to cache locality. Use `LinkedList` only when you need O(1) insertion/removal at **arbitrary positions** using cursors, or when you need to splice two lists together.

```rust
use std::collections::LinkedList;

let mut list: LinkedList<i32> = LinkedList::new();

// Push to front and back
list.push_back(1);
list.push_back(2);
list.push_back(3);
list.push_front(0);
println!("{:?}", list); // [0, 1, 2, 3]

// Pop from front and back
println!("{:?}", list.pop_front()); // Some(0)
println!("{:?}", list.pop_back());  // Some(3)

// Peek
println!("{:?}", list.front()); // Some(1)
println!("{:?}", list.back());  // Some(2)

// Length and empty check
println!("{}", list.len());      // 2
println!("{}", list.is_empty()); // false

// Iteration
for val in &list {
    println!("{}", val);
}

// Append (drains the other list, O(1))
let mut list2 = LinkedList::from([10, 20, 30]);
list.append(&mut list2);
println!("{:?}", list);  // [1, 2, 10, 20, 30]
println!("{:?}", list2); // [] (drained)

// Split at index
let split = list.split_off(2);
println!("{:?}", list);  // [1, 2]
println!("{:?}", split); // [10, 20, 30]

// Contains and iteration
println!("{}", list.contains(&1)); // true
```

---

# 9. BTreeMap `BTreeMap<K, V>`

## What is it?

`BTreeMap<K, V>` is an **ordered key-value map** backed by a B-tree. Keys are always stored in sorted order. Keys must implement `Ord`. It's slower than `HashMap` for single lookups but is preferred when you need sorted iteration or range queries.

```rust
use std::collections::BTreeMap;

let mut map = BTreeMap::new();
map.insert("banana", 3);
map.insert("apple", 5);
map.insert("cherry", 1);

// Iterates in sorted key order
for (k, v) in &map {
    println!("{}: {}", k, v);
}
// apple: 5
// banana: 3
// cherry: 1

// Range queries
use std::ops::Bound::{Included, Excluded};
let range: Vec<_> = map.range("apple"..="banana").collect();
println!("{:?}", range); // [("apple", 5), ("banana", 3)]

// First and last entry
println!("{:?}", map.first_key_value()); // Some(("apple", 5))
println!("{:?}", map.last_key_value());  // Some(("cherry", 1))

// Pop min/max
let (k, v) = map.pop_first().unwrap();
println!("Popped: {} => {}", k, v); // apple => 5
```

## When to use `BTreeMap` vs `HashMap`

|Scenario|Use|
|---|---|
|Need sorted iteration|`BTreeMap`|
|Range queries|`BTreeMap`|
|Need min/max key|`BTreeMap`|
|Fast random access by key|`HashMap`|
|DoS-resistant hashing|`HashMap`|

---

# 10. BTreeSet `BTreeSet<T>`

## What is it?

`BTreeSet<T>` is a **sorted set** of unique values. Like `HashSet` but always sorted, supporting range queries.

```rust
use std::collections::BTreeSet;

let mut set = BTreeSet::new();
set.insert(5);
set.insert(2);
set.insert(8);
set.insert(1);

// Always iterates in sorted order
for x in &set {
    print!("{} ", x); // 1 2 5 8
}

// Range
let range: Vec<_> = set.range(2..=6).collect();
println!("{:?}", range); // [2, 5]

// Min and max
println!("{:?}", set.first()); // Some(1)
println!("{:?}", set.last());  // Some(8)
```

---

# 11. BinaryHeap `BinaryHeap<T>`

## What is it?

`BinaryHeap<T>` is a **max-heap priority queue**. The largest element is always at the top (`.peek()` / `.pop()`). For a min-heap, use `std::cmp::Reverse`.

```rust
use std::collections::BinaryHeap;

let mut heap = BinaryHeap::new();
heap.push(5);
heap.push(1);
heap.push(9);
heap.push(3);

// Peek at max
println!("{:?}", heap.peek()); // Some(9)

// Pop in descending order
while let Some(top) = heap.pop() {
    print!("{} ", top); // 9 5 3 1
}

// Min-heap using Reverse
use std::cmp::Reverse;
let mut min_heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
min_heap.push(Reverse(5));
min_heap.push(Reverse(1));
min_heap.push(Reverse(9));

while let Some(Reverse(val)) = min_heap.pop() {
    print!("{} ", val); // 1 5 9
}
```

## Real-World: Dijkstra's Shortest Path

```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn dijkstra(graph: &Vec<Vec<(usize, u64)>>, start: usize) -> Vec<u64> {
    let n = graph.len();
    let mut dist = vec![u64::MAX; n];
    dist[start] = 0;
    // (cost, node) — Reverse for min-heap behavior
    let mut heap = BinaryHeap::new();
    heap.push(Reverse((0u64, start)));

    while let Some(Reverse((cost, node))) = heap.pop() {
        if cost > dist[node] { continue; }
        for &(neighbor, weight) in &graph[node] {
            let next_cost = cost + weight;
            if next_cost < dist[neighbor] {
                dist[neighbor] = next_cost;
                heap.push(Reverse((next_cost, neighbor)));
            }
        }
    }
    dist
}
```

---

# 12. Choosing the Right Collection

Use this decision tree when selecting a collection:

```txt
Need key-value storage?
├── Yes: Sorted keys or range queries needed?
│   ├── Yes  → BTreeMap<K, V>
│   └── No   → HashMap<K, V>    ← default choice
└── No: Need unique values only?
    ├── Yes: Sorted?
    │   ├── Yes  → BTreeSet<T>
    │   └── No   → HashSet<T>
    └── No: What access pattern?
        ├── Stack (LIFO)          → Vec<T>          (push/pop back)
        ├── Queue (FIFO)          → VecDeque<T>     (push_back/pop_front)
        ├── Double-ended queue    → VecDeque<T>
        ├── Priority queue        → BinaryHeap<T>
        ├── Fixed size, compile   → [T; N]  (array)
        ├── Dynamic ordered list  → Vec<T>  ← default choice
        └── Splice/cursor insert  → LinkedList<T>  (rare)
```

---

# 13. Performance Cheat Sheet

|Operation|`Vec`|`VecDeque`|`LinkedList`|`HashMap`|`BTreeMap`|
|---|---|---|---|---|---|
|Push back|O(1)*|O(1)*|O(1)|—|—|
|Push front|O(n)|O(1)*|O(1)|—|—|
|Pop back|O(1)|O(1)|O(1)|—|—|
|Pop front|O(n)|O(1)|O(1)|—|—|
|Index access|O(1)|O(1)|O(n)|—|—|
|Insert at middle|O(n)|O(n)|O(1)**|—|—|
|Search (unsorted)|O(n)|O(n)|O(n)|O(1)*|O(log n)|
|Insert (map/set)|—|—|—|O(1)*|O(log n)|
|Delete (map/set)|—|—|—|O(1)*|O(log n)|
|Sorted iteration|O(n log n) sort|—|—|No|O(n)|
|Memory locality|✅ High|✅ High|❌ Low|Medium|Medium|

* Amortized  
** Only O(1) with a cursor at the position; finding the position is still O(n)

---

# 14. Advanced Patterns

## Pattern 1: Nested Collections

```rust
use std::collections::HashMap;

// Map of String to Vec (inverted index)
let mut index: HashMap<String, Vec<usize>> = HashMap::new();
let documents = vec!["hello world", "hello rust", "rust is great"];

for (doc_id, doc) in documents.iter().enumerate() {
    for word in doc.split_whitespace() {
        index.entry(word.to_string()).or_insert_with(Vec::new).push(doc_id);
    }
}

println!("{:?}", index.get("hello")); // Some([0, 1])
println!("{:?}", index.get("rust"));  // Some([1, 2])
```

## Pattern 2: Collecting into Multiple Types

```rust
use std::collections::{HashMap, HashSet};

let data = vec![(1, "a"), (2, "b"), (1, "c"), (3, "d")];

// Group by key
let grouped: HashMap<i32, Vec<&str>> = data.iter()
    .fold(HashMap::new(), |mut acc, &(k, v)| {
        acc.entry(k).or_insert_with(Vec::new).push(v);
        acc
    });

// Unique keys as a set
let unique_keys: HashSet<i32> = data.iter().map(|&(k, _)| k).collect();
println!("{:?}", unique_keys); // {1, 2, 3}
```

## Pattern 3: LRU Cache (with `IndexMap` from external crate)

```rust
// Add to Cargo.toml: indexmap = "2"
// (For production LRU: use the `lru` crate)
struct LruCache {
    capacity: usize,
    map: std::collections::HashMap<i32, i32>,
    order: std::collections::VecDeque<i32>,
}

impl LruCache {
    fn new(capacity: usize) -> Self {
        LruCache { capacity, map: std::collections::HashMap::new(), order: std::collections::VecDeque::new() }
    }

    fn get(&mut self, key: i32) -> Option<i32> {
        if let Some(&val) = self.map.get(&key) {
            self.order.retain(|&k| k != key);
            self.order.push_back(key);
            Some(val)
        } else {
            None
        }
    }

    fn put(&mut self, key: i32, value: i32) {
        if self.map.contains_key(&key) {
            self.order.retain(|&k| k != key);
        } else if self.map.len() == self.capacity {
            if let Some(oldest) = self.order.pop_front() {
                self.map.remove(&oldest);
            }
        }
        self.map.insert(key, value);
        self.order.push_back(key);
    }
}
```

## Pattern 4: Transforming Collections with Iterator Chains

```rust
use std::collections::HashMap;

let raw = "alice:90,bob:85,charlie:78,alice:95,bob:92";

// Parse CSV pairs and keep the highest score per name
let scores: HashMap<&str, u32> = raw
    .split(',')
    .map(|entry| {
        let mut parts = entry.splitn(2, ':');
        let name = parts.next().unwrap();
        let score: u32 = parts.next().unwrap().parse().unwrap();
        (name, score)
    })
    .fold(HashMap::new(), |mut map, (name, score)| {
        let entry = map.entry(name).or_insert(0);
        if score > *entry { *entry = score; }
        map
    });

println!("{:?}", scores); // {"alice": 95, "bob": 92, "charlie": 78}
```

## Pattern 5: Using Entry API for Complex Updates

```rust
use std::collections::HashMap;

#[derive(Debug, Default)]
struct Stats { count: u32, total: f64 }

let readings = vec![("sensor_a", 1.2), ("sensor_b", 3.5), ("sensor_a", 2.8), ("sensor_b", 4.1)];

let mut stats: HashMap<&str, Stats> = HashMap::new();
for (sensor, value) in readings {
    let entry = stats.entry(sensor).or_insert_with(Stats::default);
    entry.count += 1;
    entry.total += value;
}

for (sensor, stat) in &stats {
    println!("{}: avg = {:.2}", sensor, stat.total / stat.count as f64);
}
```

## Pattern 6: Efficient Deduplication with HashSet

```rust
use std::collections::HashSet;

fn deduplicate_preserve_order<T: std::hash::Hash + Eq + Clone>(v: Vec<T>) -> Vec<T> {
    let mut seen = HashSet::new();
    v.into_iter().filter(|x| seen.insert(x.clone())).collect()
}

let v = vec![3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
let deduped = deduplicate_preserve_order(v);
println!("{:?}", deduped); // [3, 1, 4, 5, 9, 2, 6]
```

## Pattern 7: Frequency Map and Top-N

```rust
use std::collections::HashMap;

fn top_n_frequent(words: &[&str], n: usize) -> Vec<(&str, usize)> {
    let mut freq: HashMap<&str, usize> = HashMap::new();
    for &word in words {
        *freq.entry(word).or_insert(0) += 1;
    }
    let mut pairs: Vec<(&str, usize)> = freq.into_iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1));
    pairs.into_iter().take(n).collect()
}

let text = "the quick brown fox jumps over the lazy dog the fox";
let words: Vec<&str> = text.split_whitespace().collect();
println!("{:?}", top_n_frequent(&words, 3));
// [("the", 3), ("fox", 2), ...]
```

---

_This guide covers all major standard library collections in Rust. For specialized needs, explore crates like `indexmap` (ordered HashMap), `dashmap` (concurrent HashMap), `smallvec` (stack-optimized Vec), and `im` (immutable/persistent collections)._