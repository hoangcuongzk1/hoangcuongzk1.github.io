---
title: Operator & Special Traits in Rust
creation date: 2026-02-21T17:33:00
last edited: 2026-02-22T12:00:00
slug: rust-09
series: rust
excerpt: a comprehensive list of all operator/special traits in Rust
lang: en
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQjmX93dXLnhAJQV7tb1QfvySrOIA1WB3J7A&s
tags:
  - 🦀rust
---

# Arithmetic Operators

```rust
use std::ops::*;

// Add (+)
impl Add for MyType { type Output = MyType; fn add(self, rhs: MyType) -> MyType {} }

// Sub (-)
impl Sub for MyType { type Output = MyType; fn sub(self, rhs: MyType) -> MyType {} }

// Mul (*)
impl Mul for MyType { type Output = MyType; fn mul(self, rhs: MyType) -> MyType {} }

// Div (/)
impl Div for MyType { type Output = MyType; fn div(self, rhs: MyType) -> MyType {} }

// Rem (%)
impl Rem for MyType { type Output = MyType; fn rem(self, rhs: MyType) -> MyType {} }

// Neg (unary -)
impl Neg for MyType { type Output = MyType; fn neg(self) -> MyType {} }
```

---

# Compound Assignment Operators

```rust
// += -= *= /= %= &= |= ^= <<= >>=
impl AddAssign for MyType { fn add_assign(&mut self, rhs: MyType) {} }
impl SubAssign for MyType { fn sub_assign(&mut self, rhs: MyType) {} }
impl MulAssign for MyType { fn mul_assign(&mut self, rhs: MyType) {} }
impl DivAssign for MyType { fn div_assign(&mut self, rhs: MyType) {} }
impl RemAssign for MyType { fn rem_assign(&mut self, rhs: MyType) {} }
impl BitAndAssign for MyType { fn bitand_assign(&mut self, rhs: MyType) {} }
impl BitOrAssign  for MyType { fn bitor_assign(&mut self, rhs: MyType) {} }
impl BitXorAssign for MyType { fn bitxor_assign(&mut self, rhs: MyType) {} }
impl ShlAssign for MyType { fn shl_assign(&mut self, rhs: u32) {} }
impl ShrAssign for MyType { fn shr_assign(&mut self, rhs: u32) {} }
```

---

# Bitwise Operators

```rust
// & | ^ !  <<  >>
impl BitAnd for MyType { type Output = MyType; fn bitand(self, rhs: MyType) -> MyType {} }
impl BitOr  for MyType { type Output = MyType; fn bitor (self, rhs: MyType) -> MyType {} }
impl BitXor for MyType { type Output = MyType; fn bitxor(self, rhs: MyType) -> MyType {} }
impl Not    for MyType { type Output = MyType; fn not(self) -> MyType {} }
impl Shl<u32> for MyType { type Output = MyType; fn shl(self, rhs: u32) -> MyType {} }
impl Shr<u32> for MyType { type Output = MyType; fn shr(self, rhs: u32) -> MyType {} }
```

---

# Comparison Traits

```rust
// PartialEq: == !=
impl PartialEq for MyType {
    fn eq(&self, other: &MyType) -> bool {}
    // ne() has default impl
}

// Eq: marker trait, means equality is total (no NaN-like values)
impl Eq for MyType {}

// PartialOrd: < > <= >=
impl PartialOrd for MyType {
    fn partial_cmp(&self, other: &MyType) -> Option<std::cmp::Ordering> {}
}

// Ord: total ordering, requires Eq
impl Ord for MyType {
    fn cmp(&self, other: &MyType) -> std::cmp::Ordering {}
}
```

**Example — sorting a custom type:**

```rust
#[derive(Eq, PartialEq)]
struct Player { score: i32 }

impl Ord for Player {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.score.cmp(&other.score)
    }
}
impl PartialOrd for Player {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

let mut players = vec![Player{score:3}, Player{score:1}, Player{score:2}];
players.sort(); // works because of Ord
```

---

# Index & Deref Traits

```rust
// [] read
impl Index<usize> for MyType { type Output = i32; fn index(&self, i: usize) -> &i32 {} }

// [] write
impl IndexMut<usize> for MyType { fn index_mut(&mut self, i: usize) -> &mut i32 {} }

// * dereference
impl Deref for MyType { type Target = i32; fn deref(&self) -> &i32 {} }

// *x = val
impl DerefMut for MyType { fn deref_mut(&mut self) -> &mut i32 {} }
```

**`Deref` is how `Box<T>`, `Vec<T>`, `String` let you use them like raw pointers/slices:**

```rust
struct Wrapper(Vec<i32>);

impl Deref for Wrapper {
    type Target = Vec<i32>;
    fn deref(&self) -> &Vec<i32> { &self.0 }
}

let w = Wrapper(vec![1, 2, 3]);
println!("{}", w[0]);   // works via Deref coercion
println!("{}", w.len()); // Vec methods work directly
```

---

# Conversion Traits

```rust
// Infallible conversions
impl From<i32> for MyType { fn from(v: i32) -> MyType {} }
// Into is auto-implemented when From is implemented
// MyType::from(5)  or  let x: MyType = 5.into()

// Fallible conversions
impl TryFrom<i32> for MyType {
    type Error = String;
    fn try_from(v: i32) -> Result<MyType, String> {}
}
// TryInto is auto-implemented

// &T -> &MyType (cheap reference conversion)
impl AsRef<str> for MyType { fn as_ref(&self) -> &str {} }
impl AsMut<str> for MyType { fn as_mut(&mut self) -> &mut str {} }
```

**Example:**

```rust
struct Meters(f64);

impl From<f64> for Meters {
    fn from(v: f64) -> Meters { Meters(v) }
}

let m = Meters::from(5.0);
let m: Meters = 5.0_f64.into(); // same thing
```

---

# Display & Formatting Traits

```rust
use std::fmt;

// {} — human readable
impl fmt::Display for MyType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MyType({})", self.0)
    }
}

// {:?} — debug output (usually #[derive(Debug)])
impl fmt::Debug for MyType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "MyType {{ val: {} }}", self.0)
    }
}

// Other fmt traits:
// fmt::Binary    → {:b}
// fmt::Octal     → {:o}
// fmt::LowerHex  → {:x}
// fmt::UpperHex  → {:X}
// fmt::LowerExp  → {:e}
// fmt::UpperExp  → {:E}
// fmt::Pointer   → {:p}
```

---

# Iterator Traits

```rust
// Make your type iterable with for loops
impl Iterator for MyIter {
    type Item = i32;
    fn next(&mut self) -> Option<i32> {}
    // 70+ methods (map, filter, etc.) are FREE once next() is implemented
}

// Allow &MyType to be used in for loops
impl IntoIterator for MyType {
    type Item = i32;
    type IntoIter = MyIter;
    fn into_iter(self) -> MyIter {}
}

// Collect into your type from an iterator
impl FromIterator<i32> for MyType {
    fn from_iter<I: IntoIterator<Item=i32>>(iter: I) -> MyType {}
}

// Extend your type from an iterator
impl Extend<i32> for MyType {
    fn extend<I: IntoIterator<Item=i32>>(&mut self, iter: I) {}
}
```

---

# Memory / Ownership Traits

```rust
// Cheap bitwise copy (no custom drop logic allowed)
impl Copy for MyType {}  // usually #[derive(Copy)]

// Clone — explicit .clone()
impl Clone for MyType {
    fn clone(&self) -> MyType {}
}

// Custom destructor — runs when value is dropped
impl Drop for MyType {
    fn drop(&mut self) {
        println!("MyType dropped!");
    }
}
```

---

# Hashing

```rust
use std::hash::{Hash, Hasher};

impl Hash for MyType {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.hash(state);
    }
}
// Required to use MyType as a HashMap key (along with Eq)
```

---

# Function Call Traits

```rust
// Make your type callable like a function
impl std::ops::Fn<(i32,)> for MyType {
    extern "rust-call" fn call(&self, args: (i32,)) -> i32 { args.0 * 2 }
}
// Note: Fn/FnMut/FnOnce are nightly-only to implement manually.
// In stable Rust, use them as bounds: fn run(f: impl Fn(i32) -> i32)
```

---

# Range Traits (used in slicing)

```rust
use std::ops::{Range, RangeBounds};

// Lets your type be used in slice indexing: &a[myrange]
impl std::slice::SliceIndex<[i32]> for MyRange {
    // complex — rarely implemented manually
}
```

---

# Quick Reference Table

|Trait|Operator/Use|
|---|---|
|`Add/Sub/Mul/Div/Rem`|`+ - * / %`|
|`Neg`|unary `-`|
|`BitAnd/Or/Xor/Not/Shl/Shr`|`& \| ^ ! << >>`|
|`*Assign` variants|`+= -= *= /=` etc|
|`PartialEq/Eq`|`== !=`|
|`PartialOrd/Ord`|`< > <= >=`, sorting|
|`Index/IndexMut`|`[]` read/write|
|`Deref/DerefMut`|`*` , coercion|
|`From/Into`|infallible conversion|
|`TryFrom/TryInto`|fallible conversion|
|`AsRef/AsMut`|cheap ref conversion|
|`Display/Debug`|`{}` `{:?}`|
|`Iterator/IntoIterator`|`for` loops|
|`FromIterator`|`.collect()`|
|`Clone/Copy`|`.clone()` / implicit copy|
|`Drop`|destructor|
|`Hash`|HashMap keys|
|`Fn/FnMut/FnOnce`|callable types|