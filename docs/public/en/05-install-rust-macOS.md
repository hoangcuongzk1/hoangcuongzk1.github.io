---
title: Installing Rust on MacOS
creation date: 2026-01-01T01:26:00
slug: post-05
series: rust
excerpt: A comprehensive guide to installing Rust on macOS
lang: en
cover img: https://i.ytimg.com/vi/yt8ujLidMYE/sddefault.jpg?sqp=-oaymwEmCIAFEOAD8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGEAgTyhyMA8=&rs=AOn4CLDpJbU3fCmn2jrNXH5TZ5CthPFqxg
tags:
  - 🦀rust
---
## Introduction

```callout
[!CAUTION] MacOS only!
This article exclusively focuses on setting up Rust on MacOS!
```

## Installation

**Step 1: Install Rust**

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

**Step 2: Install the `C` compiler**

```bash
xcode-select --install
```

**Step 3: Verify the installation**

```bash
rustc --version
```

**Step 4: Update Rust**

```bash
rustup update
```

**❌ Uninstallation**: Use this command when you wish to remove Rust from your system

```bash
rustup self uninstall
```

**Local Documentation**

A comprehensive collection of official documentation resources for learning Rust.

```bash
rustup doc
```

---

## Project Initialization

### Creating a Rust Project

**Method 1: Create a new project in a new directory**

```bash
cargo new projectName       # binary    
# or
cargo new projectName --bin # binary
# or
cargo new projectName --lib # library
```

**Method 2: Create a project from an existing directory**

```bash
cargo init existingFolderNameHere
```

**Result**

```cs
projectName
└── src
    └── main.rs
├── .gitignore
├── Cargo.toml
├── README.md
```

The content of the `main.rs` file will be a fundamental "Hello, World!" programme.

### Basic Configuration

Modify the default `.gitignore` file content to:

```gitignore
# jetbrain IDE
.[Ii]dea/ 

# default build files of Rust for all folders
**/target/

# macOS 
*.DS_Store
```

## Builds

### Building the Project

**Verification compilation**

```
cargo check
```

**Build only, without executing the programme**

```bash
cargo build
```

**Optimised build for release**

```bash
cargo build --release
```

**Build and execute the programme**

```bash
cargo run
```

**Optimised build and execution**

```bash
cargo run --release
```

### Building Individual Files

Compile an executable file from a `.rs` file:

```bash
rustc path_to_a_rust_file.rs
```

## References

- [The Rust Book](https://doc.rust-lang.org/book/)
- [https://rust-lang.org/learn/](https://rust-lang.org/learn/)
- [Rust for .Net Developer](https://microsoft.github.io/rust-for-dotnet-devs/latest/)
- [Cargo Book](https://doc.rust-lang.org/cargo/index.html)
- [Rust References - Rust's behaviors](https://doc.rust-lang.org/reference/introduction.html)
- [Book of Rust Macros](https://lukaswirth.dev/tlborm/)
- [Rust playground - Online Rust Compiler](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024)
- [Rust Exercise](https://practice.course.rs/why-exercise.html)
- [https://rust-unofficial.github.io/too-many-lists/index.html](https://rust-unofficial.github.io/too-many-lists/index.html)
- [Rust Roadmap - GeeksforGeeks](https://www.geeksforgeeks.org/rust/rust-roadmap/)
- [Cargo.toml vs Cargo.lock - The Cargo Book](https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html)