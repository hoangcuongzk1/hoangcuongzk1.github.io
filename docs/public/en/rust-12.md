---
title: Rust Numeric Types — Min, Max & When to Use Them
creation date: 2026-02-22T01:14:00
last edited: 2026-02-22T01:14:00
slug: rust-12
series: rust
excerpt:
lang: en
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQjmX93dXLnhAJQV7tb1QfvySrOIA1WB3J7A&s
tags:
  - 🦀rust
---

# Rust Numeric Types — Min, Max & When to Use Them

## Integer Types

|Type|Size|Min|Max|Use When|
|---|---|---|---|---|
|`i8`|8-bit|-128|127|Tiny signed values, packed structs|
|`i16`|16-bit|-32,768|32,767|Audio samples, compact data|
|`i32`|32-bit|-2,147,483,648|2,147,483,647|General signed integer (common default)|
|`i64`|64-bit|-9,223,372,036,854,775,808|9,223,372,036,854,775,807|Large counts, timestamps, file sizes|
|`i128`|128-bit|-(2¹²⁷)|2¹²⁷-1|Cryptography, very large numbers|
|`isize`|arch|platform min|platform max|**Must use** for pointer offsets, indexing with signed math|
|`u8`|8-bit|0|255|**Must use** for bytes, raw binary data, `&[u8]`|
|`u16`|16-bit|0|65,535|Ports, Unicode code units, compact IDs|
|`u32`|32-bit|0|4,294,967,295|Colors (RGBA), IPv4, general unsigned|
|`u64`|64-bit|0|18,446,744,073,709,551,615|Large unsigned counts, hashes|
|`u128`|128-bit|0|2¹²⁸-1|UUIDs, cryptographic hashes|
|`usize`|arch|0|platform max|**Must use** for indexing, lengths, `Vec`/slice/array indexing|

## Float Types

|Type|Size|Min positive|Max|Precision|Use When|
|---|---|---|---|---|---|
|`f32`|32-bit|~1.18 × 10⁻³⁸|~3.40 × 10³⁸|~7 decimal digits|Graphics (GPU), large float arrays, where memory matters|
|`f64`|64-bit|~2.23 × 10⁻³⁰⁸|~1.80 × 10³⁰⁸|~15 decimal digits|Default float, scientific, financial calculations|

---

## Places Where You're **Forced** to Use a Specific Type

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

---

## Handy Constants in Code

```rust
i32::MIN    // -2_147_483_648
i32::MAX    //  2_147_483_647
u8::MAX     //  255
usize::MAX  //  platform dependent
f64::MAX    //  1.7976931348623157e308
f64::MIN    // -1.7976931348623157e308
f64::MIN_POSITIVE  // smallest positive f64
f64::INFINITY
f64::NEG_INFINITY
f64::NAN
```

Every numeric type has `::MIN`, `::MAX`, and floats additionally have `::INFINITY`, `::NEG_INFINITY`, `::NAN`, `::MIN_POSITIVE`, `::EPSILON`.