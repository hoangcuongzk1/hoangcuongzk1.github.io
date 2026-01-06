---
title: So sánh Float trong Rust và C#
creation date: 2026-01-06T01:26:00
slug: post-06
series: rust
excerpt: So sánh Float trong Rust và C#
lang: vn
cover img: https://media.geeksforgeeks.org/wp-content/uploads/Single-Precision-IEEE-754-Floating-Point-Standard.jpg
tags:
  - rust
  - csharp
---

[Nguồn tham khảo](https://doc.rust-lang.org/book/ch03-02-data-types.html)

Rust có **2 kiểu số thực** (floating-point types):

|Length|Type|Standard|Precision|
|---|---|---|---|
|32-bit|`f32`|IEEE-754 single|~6-9 chữ số thập phân|
|64-bit|`f64`|IEEE-754 double|~15-17 chữ số thập phân|

**Lưu ý quan trọng:**

- Rust **KHÔNG có `f16` (half-precision)** hay `f128` (quadruple-precision) như một số ngôn ngữ khác.
- Kiểu mặc định là `f64` vì trên CPU hiện đại, hiệu suất `f64` tương đương `f32` nhưng độ chính xác cao hơn.

---

## So sánh với CSharp

### 1. **Tên gọi và kích thước**

```csharp
// C#
float value1 = 3.14f;      // 32-bit (tương đương f32)
double value2 = 3.14;      // 64-bit (tương đương f64)
decimal value3 = 3.14m;    // 128-bit (KHÔNG có trong Rust!)
```

```rust
// Rust
let value1: f32 = 3.14;    // 32-bit
let value2: f64 = 3.14;    // 64-bit (mặc định)
let value3 = 3.14;         // Tự suy luận thành f64
```

**Điểm khác biệt lớn:**

- C# có `decimal` (128-bit) cho tính toán tài chính với độ chính xác cao.
- Rust **KHÔNG có kiểu tương đương**. Nếu cần, bạn phải dùng thư viện như `rust_decimal` hoặc `bigdecimal`.

---

### 2. **Literal Syntax (Cách viết số)**

```rust
// Rust - nhiều cách viết
let a = 2.5;           // f64 mặc định
let b: f32 = 2.5;      // Chỉ định rõ f32
let c = 2.5f32;        // Suffix để chỉ định type
let d = 2.5_f32;       // Có thể dùng underscore
let e = 2.5e10;        // Ký hiệu khoa học (scientific notation)
let f = 2.5E-8f32;     // Kết hợp scientific + suffix
```

```csharp
// C# - tương tự nhưng khác suffix
float a = 2.5f;        // Bắt buộc suffix 'f' cho float
double b = 2.5;        // Mặc định là double
double c = 2.5d;       // Có thể thêm 'd' (không bắt buộc)
decimal d = 2.5m;      // Bắt buộc suffix 'm' cho decimal
double e = 2.5e10;     // Scientific notation
```

**Lưu ý quan trọng trong Rust:**

- **KHÔNG cần suffix `f` như C#**, nhưng có thể dùng `f32` hoặc `f64`.
- Rust cho phép dùng underscore `_` trong số để dễ đọc: `1_000_000.5_f64`

---

### 3. **Type Inference (Suy luận kiểu)**

```rust
// Rust
let x = 3.14;              // Suy luận thành f64 (mặc định)
let y: f32 = 3.14;         // Chỉ định rõ f32
let z = 3.14f32;           // Dùng suffix

// Suy luận từ context
fn take_f32(n: f32) {}
let w = 3.14;              
take_f32(w);               // ERROR! w là f64, không tự chuyển sang f32
```

```csharp
// C#
var x = 3.14;              // Suy luận thành double
var y = 3.14f;             // Suy luận thành float
float z = 3.14;            // ERROR! Cần suffix 'f'

void TakeFloat(float n) {}
double w = 3.14;
TakeFloat(w);              // ERROR! Tương tự Rust, không implicit cast
```

**Điểm giống nhau:** Cả Rust và C# đều **KHÔNG tự động chuyển đổi** giữa `f32/float` và `f64/double`.

---

### 4. **Chuyển đổi kiểu (Type Casting)**

```rust
// Rust - Dùng 'as' keyword (explicit cast)
let x: f64 = 3.14159265359;
let y: f32 = x as f32;     // Mất độ chính xác
let z: i32 = y as i32;     // Truncate (cắt phần thập phân) = 3

// CẢNH BÁO: as có thể gây mất dữ liệu!
let huge: f64 = 1e308;
let overflow: f32 = huge as f32;  // Thành infinity!
```

```csharp
// C# - Nhiều cách
double x = 3.14159265359;
float y = (float)x;                    // C-style cast
int z = (int)y;                        // Truncate = 3

// Hoặc dùng Convert (kiểm tra overflow)
float safe = Convert.ToSingle(x);
int safeInt = Convert.ToInt32(y);
```

**Khác biệt lớn:**

- Rust: `as` **KHÔNG kiểm tra overflow**, có thể cho kết quả infinity hoặc NaN.
- C#: `Convert` có kiểm tra và throw exception nếu overflow.

**Best practice trong Rust:**

```rust
// Để an toàn hơn, kiểm tra trước khi cast
if x.is_finite() && x <= f32::MAX as f64 && x >= f32::MIN as f64 {
    let y = x as f32;
} else {
    // Xử lý lỗi
}
```

---

### 5. **Special Values (Giá trị đặc biệt)**

```rust
// Rust
let inf_pos = f32::INFINITY;        // Infinity dương
let inf_neg = f32::NEG_INFINITY;    // Infinity âm
let not_a_number = f32::NAN;        // Not a Number

// Kiểm tra
let x = 0.0 / 0.0;                  // Tạo ra NaN
println!("{}", x.is_nan());         // true
println!("{}", x.is_infinite());    // false
println!("{}", x.is_finite());      // false

// So sánh NaN
println!("{}", f32::NAN == f32::NAN);  // false! (IEEE-754)
```

```csharp
// C#
float infPos = float.PositiveInfinity;
float infNeg = float.NegativeInfinity;
float nan = float.NaN;

// Kiểm tra
float x = 0.0f / 0.0f;
Console.WriteLine(float.IsNaN(x));        // true
Console.WriteLine(float.IsInfinity(x));   // false
Console.WriteLine(float.IsFinite(x));     // true (C# 9.0+)

// So sánh NaN
Console.WriteLine(float.NaN == float.NaN);  // false! (giống Rust)
```

**Lưu ý quan trọng:**

- `NaN != NaN` theo chuẩn IEEE-754 (cả Rust và C# đều tuân theo).
- Phải dùng `.is_nan()` (Rust) hoặc `float.IsNaN()` (C#).

---

### 6. **Constants và giới hạn**

```rust
// Rust - Truy cập qua associated constants
println!("f32 MIN: {}", f32::MIN);              // -3.4028235e38
println!("f32 MAX: {}", f32::MAX);              // 3.4028235e38
println!("f32 EPSILON: {}", f32::EPSILON);      // 1.1920929e-7
println!("f32 DIGITS: {}", f32::DIGITS);        // 6 (decimal digits)
println!("f32 MANTISSA_DIGITS: {}", f32::MANTISSA_DIGITS); // 24 bits

println!("f64 MIN: {}", f64::MIN);              // -1.7976931348623157e308
println!("f64 MAX: {}", f64::MAX);              // 1.7976931348623157e308
println!("f64 EPSILON: {}", f64::EPSILON);      // 2.220446049250313e-16
```

```csharp
// C#
Console.WriteLine($"float MIN: {float.MinValue}");      // -3.402823E+38
Console.WriteLine($"float MAX: {float.MaxValue}");      // 3.402823E+38
Console.WriteLine($"float EPSILON: {float.Epsilon}");   // 1.401298E-45 ( ⚠️ khác!)

Console.WriteLine($"double MIN: {double.MinValue}");    // -1.7976931348623157E+308
Console.WriteLine($"double MAX: {double.MaxValue}");    // 1.7976931348623157E+308
Console.WriteLine($"double EPSILON: {double.Epsilon}"); // 4.94065645841247E-324 (khác!)
```

**CẢNH BÁO:**

- `EPSILON` trong Rust và C# **KHÁC NHAU!**
- Rust: Khoảng cách nhỏ nhất giữa 1.0 và số tiếp theo.
- C#: Giá trị dương nhỏ nhất > 0.

---

### 7. **Methods hữu ích (So sánh Unity/Game Development)**

```rust
// Rust - Math operations
let x: f32 = -3.7;

// Làm tròn
x.round()      // -4.0 (làm tròn gần nhất)
x.floor()      // -4.0 (làm tròn xuống)
x.ceil()       // -3.0 (làm tròn lên)
x.trunc()      // -3.0 (cắt phần thập phân)
x.fract()      // -0.7 (lấy phần thập phân)
x.abs()        // 3.7 (giá trị tuyệt đối)

// Clamp (giới hạn giá trị) - CỰC KỲ HỮU ÍCH cho game!
let health = 150.0_f32;
health.clamp(0.0, 100.0)  // 100.0

// Min/Max
x.min(0.0)     // -3.7
x.max(0.0)     // 0.0

// Lũy thừa và căn
x.abs().sqrt()             // 1.9235384
x.abs().powf(2.0)          // 13.69
2.0_f32.powi(3)            // 8.0 (pow với số nguyên)

// Trigonometry (quan trọng cho game!)
use std::f32::consts::PI;
let angle = PI / 4.0;
angle.sin()                // 0.70710677
angle.cos()                // 0.70710677
angle.tan()                // 1.0
angle.to_degrees()         // 45.0
(45.0_f32).to_radians()   // 0.7853982
```

```csharp
// C# (Unity style)
float x = -3.7f;

// Làm tròn
Mathf.Round(x)        // -4.0
Mathf.Floor(x)        // -4.0
Mathf.Ceil(x)         // -3.0
(int)x                // -3 (truncate)
// Không có fract() trực tiếp
Mathf.Abs(x)          // 3.7

// Clamp - QUAN TRỌNG trong Unity!
float health = 150f;
Mathf.Clamp(health, 0f, 100f)  // 100

// Min/Max
Mathf.Min(x, 0f)      // -3.7
Mathf.Max(x, 0f)      // 0

// Lũy thừa và căn
Mathf.Sqrt(Mathf.Abs(x))       // 1.923538
Mathf.Pow(Mathf.Abs(x), 2f)    // 13.69

// Trigonometry
float angle = Mathf.PI / 4f;
Mathf.Sin(angle)               // 0.7071068
Mathf.Cos(angle)               // 0.7071068
Mathf.Tan(angle)               // 1.0
angle * Mathf.Rad2Deg          // 45.0
45f * Mathf.Deg2Rad            // 0.7853982
```

**Khác biệt chính:**

- **Rust:** Methods trực tiếp trên số (`x.sqrt()`).
- **C#/Unity:** Dùng class `Mathf` hoặc `Math` (`Mathf.Sqrt(x)`).

---

### 8. **Precision Issues (Vấn đề độ chính xác) - QUAN TRỌNG CHO GAME!**

```rust
// Rust - So sánh floating-point
let a = 0.1 + 0.2;
let b = 0.3;

// SAI! Đừng bao giờ so sánh trực tiếp
if a == b {  // false! (0.30000000000000004 != 0.3)
    println!("Equal");
}

// ĐÚNG! Dùng epsilon comparison
let epsilon = f64::EPSILON * 10.0;  // Hoặc số nào đó phù hợp
if (a - b).abs() < epsilon {
    println!("Approximately equal");
}

// Hoặc dùng thư viện như approx
// use approx::assert_relative_eq;
// assert_relative_eq!(a, b, epsilon = 1e-10);
```

```csharp
// C# - Tương tự
float a = 0.1f + 0.2f;
float b = 0.3f;

// SAI!
if (a == b) {  // false!
    Console.WriteLine("Equal");
}

// ĐÚNG!
float epsilon = 0.0001f;  // Hoặc float.Epsilon * scale
if (Mathf.Abs(a - b) < epsilon) {
    Console.WriteLine("Approximately equal");
}

// Unity có sẵn
if (Mathf.Approximately(a, b)) {  // Dùng epsilon mặc định
    Console.WriteLine("Approximately equal");
}
```

**Best practice cho Game Engine:**

```rust
// Tạo helper function giống Mathf.Approximately
pub fn approximately(a: f32, b: f32) -> bool {
    (a - b).abs() < f32::EPSILON * 8.0
}

// Hoặc cho vector, quaternion comparison
pub fn approximately_vec3(a: Vec3, b: Vec3) -> bool {
    (a.x - b.x).abs() < f32::EPSILON * 8.0
        && (a.y - b.y).abs() < f32::EPSILON * 8.0
        && (a.z - b.z).abs() < f32::EPSILON * 8.0
}
```

---

### 9. **Performance Tips cho Game Engine**

```rust
// 1. Ưu tiên f32 cho game (trừ khi cần độ chính xác cao)
struct Transform {
    position: Vec3,     // [f32; 3], không dùng f64
    rotation: Quat,     // f32
    scale: Vec3,        // f32
}

// 2. Dùng const cho các giá trị toán học
const PI: f32 = std::f32::consts::PI;
const TWO_PI: f32 = 2.0 * PI;
const HALF_PI: f32 = PI / 2.0;

// 3. Fast inverse square root (quake style) - nếu cần
pub fn fast_inv_sqrt(x: f32) -> f32 {
    // Rust có .sqrt() đã được optimize, nhưng nếu cần:
    1.0 / x.sqrt()
    // Hoặc dùng SIMD với intrinsics
}

// 4. SIMD cho batch processing
#[cfg(target_arch = "x86_64")]
use std::arch::x86_64::*;

// Process 4 floats cùng lúc với SSE/AVX
// (Chi tiết khi bạn học về unsafe và SIMD)
```

---

### 10. **Common Gotchas (Những lỗi thường gặp)**

```rust
// 1. Integer division vs float division
let a = 5 / 2;           // 2 (integer division)
let b = 5.0 / 2.0;       // 2.5 (float division)
let c = 5 / 2.0;         // ERROR! Không mix types
let d = 5 as f32 / 2.0;  // 2.5 (phải cast)

// 2. Overflow khi cast
let huge: f64 = 1e308;
let overflow = huge as f32;  // Infinity! Không error
println!("{}", overflow);    // inf

// 3. Modulo với float
let x = 5.5_f32;
let y = 2.0_f32;
let remainder = x % y;       // 1.5 (hỗ trợ, khác C#)

// 4. Comparing NaN
let nan = f32::NAN;
println!("{}", nan < 1.0);   // false
println!("{}", nan > 1.0);   // false
println!("{}", nan == nan);  // false!
```

```csharp
// C# - Tương tự
int a = 5 / 2;              // 2
float b = 5.0f / 2.0f;      // 2.5
// float c = 5 / 2.0f;      // ERROR tương tự
float d = 5f / 2.0f;        // 2.5

// Overflow
double huge = 1e308;
float overflow = (float)huge;  // Infinity

// Modulo - C# KHÔNG hỗ trợ % cho float/double!
float x = 5.5f;
float y = 2.0f;
// float rem = x % y;        // ERROR!
float rem = x - (int)(x / y) * y;  // Phải tính thủ công
// Hoặc dùng Math.IEEERemainder()
```

---

## Tổng kết

|Tính năng|Rust|C# (Unity)|Ghi chú|
|---|---|---|---|
|Float 32-bit|`f32`|`float`|Ưu tiên cho game|
|Float 64-bit|`f64`|`double`|Dùng khi cần chính xác|
|High-precision|❌|`decimal`|Rust cần thư viện|
|Methods|`x.sqrt()`|`Mathf.Sqrt(x)`|Rust: methods trên type|
|Constants|`f32::PI`|`Mathf.PI`|Rust: associated constants|
|Clamp|`x.clamp(a,b)`|`Mathf.Clamp(x,a,b)`|Rust built-in từ 1.50|
|Modulo float|✅ `%`|❌|C# không hỗ trợ|
|SIMD|✅ `std::arch`|✅ `System.Numerics`|Cả hai hỗ trợ|
