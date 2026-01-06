---
title: Cài đặt Rust trên MacOS
creation date: 2026-01-01T01:26:00
slug: post-05
series: rust
excerpt: Cách cài đặt Rust trên macOS.
lang: vn
cover img: https://i.ytimg.com/vi/yt8ujLidMYE/sddefault.jpg?sqp=-oaymwEmCIAFEOAD8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEAgTyhyMA8=&rs=AOn4CLDpJbU3fCmn2jrNXH5TZ5CthPFqxg
tags:
  - 🦀rust
---
## Mở đầu

```callout
[!CAUTION] MacOS only !
Bài viết này chỉ tập trung vào cách setup Rust trên MacOS !
```

Bài viết này tập trung vào việc:
- cài đặt Rust thông qua terminal trên macOS
- các lệnh quan trọng để khởi tạo, build, chạy project

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

Tổng hợp danh sách tài liệu chính thức do các nhà phát triển Rust để học Rust.

```bash
rustup doc
```

---
## Khởi tạo project
### Tạo Rust Project
Trong Rust, chúng ta có 2 loại project:

- **binary**: Là project tạo ra file thực thi (executable) có thể chạy trực tiếp. Project binary phải có hàm `main()` làm điểm khởi đầu của chương trình. File mặc định là `src/main.rs`. Đây là loại project được tạo khi dùng lệnh `cargo new project_name`.
    
- **library**: Là project tạo ra thư viện (library/crate) để các project khác có thể sử dụng. Project library không có hàm `main()` và không thể chạy trực tiếp, thay vào đó nó export các function, struct, trait, v.v. để tái sử dụng. File mặc định là `src/lib.rs`. Để tạo library project, dùng lệnh `cargo new --lib project_name`.
    

**Cách 1: Tạo project mới vào một folder mới**
```bash
cargo new projectName       # binary    
# or
cargo new projectName --bin # binary
# or
cargo new projectName --lib # library
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
.[Ii]dea/ 

# default build files of Rust for all folders
**/target/

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
rustc path_to_a_rust_file.rs
```
