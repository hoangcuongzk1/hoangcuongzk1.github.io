---
title: Cài đặt Rust trên MacOS
creation date: 2026-01-02T01:26:00
slug: post-04
series: rust
excerpt: Cách cài đặt Rust trên macOS.
lang: vn
cover img: https://locusit.com/wp-content/uploads/2024/08/rust-vs-cplusplus-about-rust.jpg
tags:
  - 🦀rust
---
## Mở đầu

```callout
[!CAUTION] MacOS only !
Bài viết này chỉ tập trung vào cách setup Rust trên MacOS !
```
## Cài đặt

**Bước 1: cài đặt Rust**
```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```
**Bước 2: cài `C` complier**
```bash
xcode-select --install
```

**Bước 3: kiểm tra**
```bash
rustc --version
```

**Bước 4: update**
```bash
rustup update
```

**❌ Gỡ cài đặt**: dùng khi bạn muốn gỡ Rust khỏi máy
```bash
rustup self uninstall
```

**Local Document**

Tổng hợp danh sách tài liệu chính thức (offical) để học Rust.

```bash
rustup doc
```

---
## Khởi tạo project
### Tạo Rust Project

**Cách 1: Tạo project mới vào một folder mới**
```bash
cargo new projectName
```

**Cách 2: Tạo project từ folder có sẵn**
```bash
cargo init existingFolderNameHere
```

**Kết quả**

```cs
projectName
└── src
    └── main.rs
├── .gitignore
├── Cargo.toml
├── README.md
```

Nội dung file `main.rs` sẽ là chương trình "Hello, World !" cơ bản.

### Setup cơ bản

Chỉnh sửa nội dung file `.gitignore` mặc định thành:
```gitignore
# jetbrain IDE
[Ii]dea/ 

# default build files of Rust
/target

# macOS 
*.DS_Store

```

## Builds

### Build Project
**Kiểm tra biên dịch**
```
cargo check
```

**Chỉ build, không chạy chương trình**
```bash
cargo build
```
**Build tối ưu cho release**
```bash
cargo build --release
```

**Build và chạy chương trình**
```bash
cargo run
```

**Build tối ưu + chạy**
```bash
cargo run --release
```

### Build File

Build execution file từ một file `.rs`:

```bash
rustc pathToRustFile.rs
```

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
- [Cargo.toml vs Cargo.lock - The Cargo Book](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html)