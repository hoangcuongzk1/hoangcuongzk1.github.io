---
title: Tổng hợp các tài liệu để học Rust
creation date: 2026-01-01T01:02:00
slug: post-04
series: rust
excerpt: Danh sách trang web, youtube channel, book,... để học Rust.
lang: vn
cover img: https://addons.mozilla.org/user-media/previews/full/231/231838.png?modified=1622134884
tags:
  - 🦀rust
---
## Tài liệu tham khảo
- [The Rust Book](https://doc.rust-lang.org/book/)
- [https://rust-lang.org/learn/](https://rust-lang.org/learn/)
- [Rust for .Net Developer](https://microsoft.github.io/rust-for-dotnet-devs/latest/)
- [Cargo Book](https://doc.rust-lang.org/cargo/index.html)
- [Rust References - Rust 's behaviors](https://doc.rust-lang.org/reference/introduction.html)
- [Book of Rust Macros](https://lukaswirth.dev/tlborm/)
- [Rust playground - Online Rust Complier](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024)
- [Rust Exercise](https://practice.course.rs/why-exercise.html)
- [https://rust-unofficial.github.io/too-many-lists/index.html](https://rust-unofficial.github.io/too-many-lists/index.html)
- [Rust Roadmap - GeeksforGeeks](https://www.geeksforgeeks.org/rust/rust-roadmap/)
- [Visualizing memory layout of Rust's data types - YouTube](https://www.youtube.com/watch?v=7_o-YRxf_cc&t=189s)

## Tóm tắt các triết lý chính

| Triết lý                         | Ý nghĩa                               | Nguồn                                                                                        |
| -------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Memory safety without GC**     | An toàn bộ nhớ không cần GC           | [Rust Book Ch.4](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)        |
| **Zero-cost abstractions**       | Abstraction không có overhead         | [Rust Book Ch.13](https://doc.rust-lang.org/book/ch13-04-performance.html)                   |
| **Fearless concurrency**         | Concurrency an toàn tại compile-time  | [Rust Book Ch.16](https://doc.rust-lang.org/book/ch16-00-concurrency.html)                   |
| **Explicit over implicit**       | Ưu tiên kiểu tường minh hơn ngầm định | [API Guidelines](https://rust-lang.github.io/api-guidelines/predictability.html)             |
| **Move by default**              | Move thay vì copy                     | [Rust Book Ch.4.1](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html)            |
| **Compile-time safety**          | Bắt lỗi tại compile-time              | [Fearless Concurrency Blog](https://blog.rust-lang.org/2015/04/10/Fearless-Concurrency.html) |
| **No null pointers**             | Dùng `Option` thay vì null            | [Rust Book Ch.6](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)               |
| **Immutable by default**         | Mặc định mọi giá trị là bất biến      | [Rust Book Ch.3.1](https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html)     |
| **Composition over inheritance** | Trait thay vì inheritance             | [Rust Book Ch.10](https://doc.rust-lang.org/book/ch10-02-traits.html)                        |
