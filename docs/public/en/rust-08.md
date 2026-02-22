---
title: Mastering Arr in Rust
creation date: 2026-02-21T17:00:00
last edited: 2026-02-21T17:00:00
slug: rust-08
series: rust
excerpt:
lang: en
cover img: https://storage.googleapis.com/programming-idioms-pictures/idiom/26/2D-matrix.png
tags:
  - 🦀rust
---

# Declaring & Initializing

```rust
// Fixed-size array with explicit type
let a: [i32; 5] = [1, 2, 3, 4, 5];

// Type inferred
let a = [1, 2, 3, 4, 5];

// Fill with a repeated value
let zeros = [0; 5];           // [0, 0, 0, 0, 0]
let trues = [true; 3];        // [true, true, true]

// Mutable
let mut a = [1, 2, 3];

// Uninitialized (unsafe)
use std::mem::MaybeUninit;
let mut arr: [MaybeUninit<i32>; 3] = MaybeUninit::uninit_array();

// From a function via std::array::from_fn
let squares: [i32; 5] = std::array::from_fn(|i| (i * i) as i32);
// [0, 1, 4, 9, 16]
```

---

# Getting / Reading

```rust
let a = [10, 20, 30, 40, 50];

// By index (panics on out-of-bounds)
let x = a[2];                  // 30

// Safe get (returns Option<&T>)
let x = a.get(2);              // Some(&30)
let x = a.get(10);             // None

// First and last
let f = a.first();             // Some(&10)
let l = a.last();              // Some(&50)

// Length
let len = a.len();             // 5

// Is empty
let empty = a.is_empty();      // false
```

---

# Setting / Modifying

```rust
let mut a = [1, 2, 3, 4, 5];

// By index
a[2] = 99;

// Via get_mut
if let Some(x) = a.get_mut(2) {
    *x = 42;
}

// Swap two elements
a.swap(0, 4);                  // [5, 2, 3, 4, 1]

// Fill entire array with a value
a.fill(0);                     // [0, 0, 0, 0, 0]

// Fill with a function
a.fill_with(|| 7);             // [7, 7, 7, 7, 7]
```

---

# Iterating

```rust
let a = [1, 2, 3];

// By reference (borrows)
for x in &a { println!("{}", x); }
for x in a.iter() { println!("{}", x); }

// By mutable reference
let mut a = [1, 2, 3];
for x in &mut a { *x *= 2; }
for x in a.iter_mut() { *x += 1; }

// By value (consumes / copies for Copy types)
for x in a { println!("{}", x); }
for x in a.into_iter() { println!("{}", x); }

// Enumerate
for (i, x) in a.iter().enumerate() {
    println!("{}: {}", i, x);
}
```

## C like

```rust
let mut a = [10, 20, 30, 40, 50];

for i in 0..a.len() {
    a[i] += i as i32;
}
```

## Jumpable Index
```rust
let a = [10, 20, 30, 40, 50];
let mut i = 0;

while i < a.len() {
    println!("index {}: {}", i, a[i]);
    
    if a[i] == 20 {
        i += 2; // skip next element
    } else {
        i += 1;
    }
}
```

---

# Slicing

```rust
let a = [1, 2, 3, 4, 5];

let s: &[i32] = &a;           // full slice
let s = &a[1..4];             // [2, 3, 4]
let s = &a[..3];              // [1, 2, 3]
let s = &a[2..];              // [3, 4, 5]

// Mutable slice
let mut a = [1, 2, 3, 4, 5];
let s = &mut a[1..3];
s[0] = 99;
```

---

# Searching

```rust
let a = [3, 1, 4, 1, 5, 9];

// Contains
a.contains(&4);                // true

// Linear search
a.iter().position(|&x| x == 4); // Some(2)
a.iter().find(|&&x| x > 4);     // Some(&5)

// Binary search (array must be sorted)
let sorted = [1, 2, 3, 4, 5];
sorted.binary_search(&3);      // Ok(2)
sorted.binary_search(&6);      // Err(5) — insertion point

// Min / Max
a.iter().min();                // Some(&1)
a.iter().max();                // Some(&9)
```

---

# Sorting

```rust
let mut a = [3, 1, 4, 1, 5];

a.sort();                      // stable sort
a.sort_unstable();             // faster, unstable

// Custom comparator
a.sort_by(|x, y| y.cmp(x));   // descending
a.sort_unstable_by_key(|&x| std::cmp::Reverse(x));

// Check if sorted
a.windows(2).all(|w| w[0] <= w[1]);
```

---

# Transforming

```rust
let a = [1, 2, 3];

// Map to new array (Rust 1.55+)
let doubled: [i32; 3] = a.map(|x| x * 2);    // [2, 4, 6]

// Collect into Vec for more flexibility
let v: Vec<i32> = a.iter().map(|&x| x * 2).collect();

// Flatten nested arrays
let nested = [[1, 2], [3, 4]];
let flat: Vec<i32> = nested.iter().flatten().copied().collect();

// Sum / product
let sum: i32 = a.iter().sum();
let prod: i32 = a.iter().product();
```

---

# Comparing & Checking

```rust
let a = [1, 2, 3];
let b = [1, 2, 3];

a == b;                        // true
a != b;                        // false
a < [1, 2, 4];                 // true (lexicographic)

// Starts/ends with a slice
a.starts_with(&[1, 2]);        // true
a.ends_with(&[2, 3]);          // true
```

---

# Splitting & Windows

```rust
let a = [1, 2, 3, 4, 5];

// Split at index
let (left, right) = a.split_at(2);  // [1,2] and [3,4,5]

// Chunks
for chunk in a.chunks(2) { }        // [1,2], [3,4], [5]
for chunk in a.chunks_exact(2) { }  // [1,2], [3,4] (skips remainder)

// Windows (sliding)
for w in a.windows(3) { }           // [1,2,3], [2,3,4], [3,4,5]
```

---

# Converting

```rust
let a = [1, 2, 3];

// Array → Vec
let v: Vec<i32> = a.to_vec();
let v: Vec<i32> = Vec::from(a);

// Vec → Array (Rust 1.59+)
let v = vec![1, 2, 3];
let a: [i32; 3] = v.try_into().unwrap();

// Array → slice
let s: &[i32] = a.as_slice();

// Transmute (unsafe, advanced)
unsafe { std::mem::transmute::<[u8; 4], u32>(bytes) }
```

---

# Key Traits Implemented by Arrays

Arrays implement `Clone`, `Copy` (for `Copy` element types), `Debug`, `PartialEq`, `Eq`, `PartialOrd`, `Ord`, `Hash`, `IntoIterator`, `AsRef<[T]>`, and `AsMut<[T]>`. Most of the power comes from **slice methods** since `[T; N]` derefs to `&[T]`.


# Memory Placement
---

**Stack** — arrays in Rust are stack-allocated by default.

```rust
let a = [1, 2, 3, 4, 5]; // lives on the stack
```

The size must be known at compile time (`[T; N]` where `N` is a const), which is exactly why stack allocation works — the compiler reserves the exact bytes needed.

---

**To put an array on the heap**, you have to explicitly ask for it:

```rust
// Box it — allocates the array on the heap
let a = Box::new([1, 2, 3, 4, 5]);

// Vec — heap-allocated, growable (not a fixed array, but the common choice)
let v = vec![1, 2, 3, 4, 5];
```

---

**Practical implication:** very large arrays on the stack can cause a **stack overflow**:

```rust
let big = [0u8; 10_000_000]; // danger — ~10MB on the stack
let big = Box::new([0u8; 10_000_000]); // safe — heap
```

The default stack size is around 8MB on most systems, so anything in the MB range should go on the heap.