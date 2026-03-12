---
title: "Rust: Built-in types, traits & macros"
creation date: 2026-02-27T01:12:00
last edited: 2026-03-05T16:43:09+07:00
slug: rust-01-built-in-types-traits-macros
series: rust
excerpt:
lang: en
cover img: https://github.com/hoangcuongzk1/hoangcuongzk1.github.io/blob/main/docs/shared/wallpapers/rust_built_in_types.png?raw=true
tags:
  - 🦀rust
---

# Overview
---

# Built-in Types
---

## Numeric
---

### Integer Types

| Type    | Size    | Min                        | Max                        | Use When                                                       |
| ------- | ------- | -------------------------- | -------------------------- | -------------------------------------------------------------- |
| `i8`    | 8-bit   | -128                       | 127                        | Tiny signed values, packed structs                             |
| `i16`   | 16-bit  | -32,768                    | 32,767                     | Audio samples, compact data                                    |
| `i32`   | 32-bit  | -2,147,483,648             | 2,147,483,647              | General signed integer (common default)                        |
| `i64`   | 64-bit  | -9,223,372,036,854,775,808 | 9,223,372,036,854,775,807  | Large counts, timestamps, file sizes                           |
| `i128`  | 128-bit | -(2¹²⁷)                    | 2¹²⁷-1                     | Cryptography, very large numbers                               |
| `isize` | arch    | platform min               | platform max               | **Must use** for pointer offsets, indexing with signed math    |
| `u8`    | 8-bit   | 0                          | 255                        | **Must use** for bytes, raw binary data, `&[u8]`               |
| `u16`   | 16-bit  | 0                          | 65,535                     | Ports, Unicode code units, compact IDs                         |
| `u32`   | 32-bit  | 0                          | 4,294,967,295              | Colors (RGBA), IPv4, general unsigned                          |
| `u64`   | 64-bit  | 0                          | 18,446,744,073,709,551,615 | Large unsigned counts, hashes                                  |
| `u128`  | 128-bit | 0                          | 2¹²⁸-1                     | UUIDs, cryptographic hashes                                    |
| `usize` | arch    | 0                          | platform max               | **Must use** for indexing, lengths, `Vec`/slice/array indexing |

### Float Types

|Type|Size|Min positive|Max|Precision|Use When|
|---|---|---|---|---|---|
|`f32`|32-bit|~1.18 × 10⁻³⁸|~3.40 × 10³⁸|~7 decimal digits|Graphics (GPU), large float arrays, where memory matters|
|`f64`|64-bit|~2.23 × 10⁻³⁰⁸|~1.80 × 10³⁰⁸|~15 decimal digits|Default float, scientific, financial calculations|

### Integer Literals

| Number literals  | Example       |
| ---------------- | ------------- |
| Decimal          | `98_222`      |
| Hex              | `0xff`        |
| Octal            | `0o77`        |
| Binary           | `0b1111_0000` |
| Byte (`u8` only) | `b'A'`        |
[src](https://doc.rust-lang.org/book/ch03-02-data-types.html#:~:text=Table%203%2D2%3A%20Integer%20Literals%20in%20Rust)

## Places Where You're **Forced** to Use a Specific Numeric Type

**`usize`** — mandatory for:

```rust
let v = vec![1, 2, 3];
let x = v[0];          // index must be usize
v.len()                // returns usize
v[1..3]                // range indices are usize
array.len()            // usize
```

**`u8`** — mandatory for:

```rust
let bytes: &[u8] = b"hello";   // byte strings
std::io::Read::read(&mut buf)  // buf must be &mut [u8]
File::read_to_end(&mut vec)    // Vec<u8>
```

**`i32`** — Rust's **default** inferred integer type:

```rust
let x = 5;  // inferred as i32 unless context says otherwise
```

**`f64`** — Rust's **default** inferred float type:

```rust
let x = 3.14;  // inferred as f64
```

**`isize`** — used in pointer arithmetic and some FFI offsets.




# Built-in Traits
---

## Identity & Comparison

| Rust Trait   | C# Equivalent    | Purpose                                    |
| ------------ | ---------------- | ------------------------------------------ |
| `PartialEq`  | `IEquatable<T>`  | `==` / ` != ` comparison                   |
| `Eq`         | `IEquatable<T>`  | Full equality (implies no NaN-like values) |
| `PartialOrd` | `IComparable<T>` | Partial ordering (`<`, `>`, etc.)          |
| `Ord`        | `IComparable<T>` | Total ordering                             |
| `Hash`       | `GetHashCode()`  | Hashing for use in HashMaps                |

---

## Memory & Ownership

|Rust Trait|C# Equivalent|Purpose|
|---|---|---|
|`Drop`|`IDisposable`|Destructor / cleanup logic|
|`Clone`|`ICloneable`|Explicit deep copy|
|`Copy`|_(no direct equiv)_|Marks type as cheap bitwise-copyable|

---

## Display & Debug

|Rust Trait|C# Equivalent|Purpose|
|---|---|---|
|`Debug`|`ToString()` (debug)|`{:?}` formatting, for developers|
|`Display`|`ToString()`|`{}` formatting, for end users|

---

## Type Conversion

|Rust Trait|C# Equivalent|Purpose|
|---|---|---|
|`From<T>`|implicit cast / `IConvertible`|Infallible conversion from T|
|`Into<T>`|implicit cast|Infallible conversion into T (auto from `From`)|
|`TryFrom<T>`|`IConvertible`|Fallible conversion from T|
|`TryInto<T>`|—|Fallible conversion into T|
|`AsRef<T>`|—|Cheap reference-to-reference conversion|
|`AsMut<T>`|—|Cheap mutable reference conversion|

---

## Iteration & Collections

| Rust Trait     | C# Equivalent         | Purpose                               |
| -------------- | --------------------- | ------------------------------------- |
| `Iterator`     | `IEnumerator<T>`      | Defines `next()`, enables `for` loops |
| `IntoIterator` | `IEnumerable<T>`      | Converts a type into an iterator      |
| `FromIterator` | LINQ `.ToList()` etc. | Build collection from iterator        |
| `Extend`       | —                     | Append iterator items into collection |
| `Index`        | `this[i]` indexer     | `[]` read access                      |
| `IndexMut`     | `this[i]` indexer     | `[]` mutable access                   |

---

## Async

|Rust Trait|C# Equivalent|Purpose|
|---|---|---|
|`Future`|`Task<T>`|Represents an async computation|

---

## Operators (Operator Overloading)

|Rust Trait|C# Equivalent|
|---|---|
|`Add`, `Sub`, `Mul`, `Div`, `Rem`|`operator +`, `-`, etc.|
|`Neg`, `Not`|`operator -` (unary), `operator !`|
|`BitAnd`, `BitOr`, `BitXor`, `Shl`, `Shr`|bitwise operators|
|`AddAssign`, `SubAssign`, ...|`+=`, `-=`, etc.|

---

## Other Useful Traits

| Rust Trait              | C# Equivalent        | Purpose                                 |
| ----------------------- | -------------------- | --------------------------------------- |
| `Default`               | `new()` constraint   | Creates a default value                 |
| `Sized`                 | _(compiler concept)_ | Type has known size at compile time     |
| `Send`                  | _(thread safety)_    | Safe to transfer across threads         |
| `Sync`                  | _(thread safety)_    | Safe to share references across threads |
| `Deref`                 | —                    | `*` dereference operator                |
| `DerefMut`              | —                    | Mutable dereference                     |
| `Fn`, `FnMut`, `FnOnce` | `Func<>`, `Action<>` | Callable/closure types                  |
| `ToString`              | `ToString()`         | Convert to `String`                     |
| `Error`                 | `Exception`          | For custom error types                  |

---

Most of these live in `std::fmt`, `std::ops`, `std::convert`, `std::iter`, or `std::cmp`. Many can be **auto-derived** with `#[derive(...)]`, e.g.:

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash, Default)]
struct Point {
    x: i32,
    y: i32,
}
```

This is roughly equivalent to C#'s `record` types that auto-implement equality, hashing, and display.

## Formatting `std::fmt`

|Trait|Purpose|
|---|---|
|`Binary`|`{:b}` binary formatting|
|`Octal`|`{:o}` octal formatting|
|`LowerHex`|`{:x}` lowercase hex|
|`UpperHex`|`{:X}` uppercase hex|
|`LowerExp`|`{:e}` scientific notation|
|`UpperExp`|`{:E}` scientific notation|
|`Pointer`|`{:p}` pointer address|
|`Write` (fmt)|Writing formatted strings into a buffer|


## I/O `std::io`

| Trait        | Purpose                        |
| ------------ | ------------------------------ |
| `Read`       | `Stream.Read()` — read bytes   |
| `Write` (io) | `Stream.Write()` — write bytes |
| `BufRead`    | Buffered reading, line-by-line |
| `Seek`       | `Stream.Seek()` — move cursor  |

## Memory & Allocation

|Trait|Purpose|
|---|---|
|`Allocator`|Custom memory allocator (nightly)|
|`Box<T>` uses `Unpin`|Controls whether type can be moved in memory|
|`Unpin`|Type can be safely moved after pinning|
|`Pin`|_(struct, not trait, but related)_|
|`ToOwned`|Like `Clone` but for borrowed → owned (`&str` → `String`)|
|`Borrow<T>`|Generic borrowing (`HashMap` key lookups)|
|`BorrowMut<T>`|Mutable version of `Borrow`|

## String / Path Conversions

|Trait|Purpose|
|---|---|
|`FromStr`|Parse from string, e.g. `"42".parse::<i32>()` — like `int.Parse()`|
|`ToString`|Auto-implemented for anything that has `Display`|
|`ToSocketAddrs`|Convert to network socket address|

## Collections / Data Structures

|Trait|Purpose|
|---|---|
|`ExactSizeIterator`|Iterator with known exact length|
|`DoubleEndedIterator`|Iterate from both ends|
|`FusedIterator`|Guarantees `None` forever after first `None`|
|`Peekable`|_(adapter, not trait)_|
|`Step`|Used for ranges like `0..10` (mostly nightly)|
|`RangeBounds<T>`|Abstracts over range types (`..`, `a..b`, `a..=b`, etc.)|

## Concurrency `std::sync / std::thread`

|Trait|Purpose|
|---|---|
|`Send`|Type can be **moved** to another thread|
|`Sync`|Type can be **shared** between threads (`&T` is `Send`)|
|`Mutex` / `RwLock` use `Poison` internally|—|

_(Note: `Send` and `Sync` are **auto traits** — the compiler implements them automatically unless you opt out)_


## Async / Future `std::future, std::task`

| Trait                      | Purpose                              |
| -------------------------- | ------------------------------------ |
| `Future`                   | Core async trait, like `Task<T>`     |
| `IntoFuture`               | Converts something into a `Future`   |
| `Stream` _(futures crate)_ | Async version of `Iterator`          |
| `Waker` / `Wake`           | Notifies async runtime to poll again |
|                            |                                      |

## Marker Traits

These carry no methods — they just **mark** a type with a capability:

|Trait|Purpose|
|---|---|
|`Copy`|Bitwise copyable|
|`Sized`|Known size at compile time|
|`Send`|Thread-transferable|
|`Sync`|Thread-shareable|
|`Unpin`|Safe to move after pin|
|`UnwindSafe`|Safe to use across `catch_unwind`|
|`RefUnwindSafe`|Reference version of above|


## Nightly-only / Unstable (worth knowing)

|Trait|Purpose|
|---|---|
|`Generator`|Coroutines / generators (powers `async/await` internally)|
|`CoerceUnsized`|Custom unsized coercions|
|`DispatchFromDyn`|Object-safe dynamic dispatch|
|`Allocator`|Custom allocators|
|`Try`|Powers `?` operator internally (`Result`, `Option`)|
|`Residual`|Part of the new `Try` trait design|


## Summary of counts

The Rust standard library has roughly **50–70+ traits** in stable, and more in nightly. The key ones you'll use day-to-day are about 20–25, but it's a rich ecosystem. Many third-party crates also define widely-used traits (e.g. `serde::Serialize/Deserialize`, `rayon::ParallelIterator`, `tokio::AsyncRead/AsyncWrite`).

## Examples


### Arithmetic Operators

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

### Compound Assignment Operators

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

### Bitwise Operators

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

### Comparison Traits

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

### Index & Deref Traits

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

### Conversion Traits

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

### Display & Formatting Traits

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

### Iterator Traits

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

### Memory / Ownership Traits

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

### Hashing

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

### Function Call Traits

```rust
// Make your type callable like a function
impl std::ops::Fn<(i32,)> for MyType {
    extern "rust-call" fn call(&self, args: (i32,)) -> i32 { args.0 * 2 }
}
// Note: Fn/FnMut/FnOnce are nightly-only to implement manually.
// In stable Rust, use them as bounds: fn run(f: impl Fn(i32) -> i32)
```

---

### Range Traits (used in slicing)

```rust
use std::ops::{Range, RangeBounds};

// Lets your type be used in slice indexing: &a[myrange]
impl std::slice::SliceIndex<[i32]> for MyRange {
    // complex — rarely implemented manually
}
```

---

### Quick Reference Table

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


# Summary
---

# References
---
