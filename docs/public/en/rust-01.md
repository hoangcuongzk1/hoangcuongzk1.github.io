---
title: Creating Your Own Derive Macro
creation date: 2026-02-16T01:00:00
last edited: 2026-02-16T01:00:00
slug: rust-01
series: rust
excerpt:
lang: en
cover img: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FfFKPv_kP77o%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=c77d529ec40741dc612ea3db4414f70d906c924bf7ec2fa8f493eaad7f38be65
tags:
  - 🦀rust
---

# Project Structure

You need TWO crates:

1. A proc-macro crate (the macro definition - Procedural Macro)
2. A regular crate (to use the macro)

```txt
my_workspace/
├── my_derive/          # Proc-macro crate
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
└── my_app/             # User crate
    ├── Cargo.toml
    └── src/
        └── main.rs
```

The `#[derive]` proc-macro **must always be in a separate crate** from where you use it.

### Why? Technical Limitation

The proc-macro crate has `proc-macro = true`, which tells Rust:

- Compile this as a **compiler plugin** (dynamic library)
- This code runs **during compilation** of other crates
- It cannot be in the same crate as regular Rust code

Think of it this way:

- **Proc-macro crate** = Tool that runs at compile-time
- **User crate** = Code being compiled

You can't be both the tool AND the thing being worked on at the same time.

### Can We Put Trait in Proc-Macro Crate?

**NO!** This is the limitation. A proc-macro crate **cannot export regular items** like traits, structs, or functions.

```rust
// my_derive/src/lib.rs
use proc_macro::TokenStream;

// ❌ This trait CANNOT be exported from proc-macro crate
pub trait MyTrait 
{
    fn my_method(&self);
}

#[proc_macro_derive(MyTrait)]
pub fn derive_my_trait(input: TokenStream) -> TokenStream 
{
    // ...
}
```

## Step 1: Create the Proc-Macro Crate

```bash
cargo new my_derive --lib
cd my_derive
```

**my_derive/Cargo.toml:**

```toml
[package]
name = "my_derive"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true

[dependencies]
syn = { version = "2.0", features = ["full"] }
quote = "1.0"
proc-macro2 = "1.0"
```

**my_derive/src/lib.rs:**

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(MyTrait)]
pub fn derive_my_trait(input: TokenStream) -> TokenStream {
    // Parse the input tokens into a syntax tree
    let input = parse_macro_input!(input as DeriveInput);
    
    // Extract the struct/enum name
    let name = &input.ident;
    
    // Handle generics properly
    let generics = &input.generics;
    let (impl_generics, ty_generics, where_clause) = generics.split_for_impl();
    
    // Generate the trait implementation
    let expanded = quote! {
        impl #impl_generics MyTrait for #name #ty_generics #where_clause {
            fn my_method(&self) {
                println!("MyTrait implemented for {}", stringify!(#name));
            }
        }
    };
    
    // Convert back to TokenStream and return
    TokenStream::from(expanded)
}
```

## Step 2: Create the User Crate

```bash
cd ..
cargo new my_app
cd my_app
```

**my_app/Cargo.toml:**

```toml
[package]
name = "my_app"
version = "0.1.0"
edition = "2021"

[dependencies]
my_derive = { path = "../my_derive" }
```

**my_app/src/main.rs:**

```rust
use my_derive::MyTrait;

// Define the trait that our derive macro will implement
trait MyTrait {
    fn my_method(&self);
}

// Use the derive macro
#[derive(MyTrait)]
struct MyStruct {
    field: i32,
}

fn main() {
    let s = MyStruct { field: 42 };
    s.my_method();  // This will print: "MyTrait implemented for MyStruct"
}
```

**Run it:**

```bash
cargo run
# Output: MyTrait implemented for MyStruct
```

# How It Works - Detailed Explanation

## The Magic Explained

When you write `#[derive(MyTrait)]`, here's what happens:

1. **Compile Time**: The compiler sees the derive attribute
2. **Macro Expansion**: Calls your `derive_my_trait` function with the struct definition as input
3. **Code Generation**: Your macro generates the `impl MyTrait for MyStruct` code
4. **Compilation**: The generated code is compiled alongside your original code

To see the generated code, install and use `cargo-expand`:

```bash
cargo install cargo-expand
cd my_app
cargo expand
```

You'll see something like:

```rust
impl MyTrait for MyStruct {
    fn my_method(&self) {
        {
            ::std::io::_print(
                format_args!("MyTrait implemented for {0}\n", "MyStruct"),
            );
        }
    }
}
```

## More Complex Example: Inspecting Fields

Let's create a derive macro that generates code based on the struct's fields.

**my_derive/src/lib.rs:**

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields};

#[proc_macro_derive(Describe)]
pub fn derive_describe(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    
    // Extract field information
    let description = match &input.data {
        Data::Struct(data_struct) => {
            match &data_struct.fields {
                Fields::Named(fields) => {
                    let field_names: Vec<_> = fields.named
                        .iter()
                        .map(|f| f.ident.as_ref().unwrap().to_string())
                        .collect();
                    
                    let field_types: Vec<_> = fields.named
                        .iter()
                        .map(|f| quote!(#f.ty).to_string())
                        .collect();
                    
                    let count = field_names.len();
                    
                    quote! {
                        fn describe(&self) -> String {
                            format!(
                                "{} has {} fields: {}",
                                stringify!(#name),
                                #count,
                                vec![#(#field_names),*].join(", ")
                            )
                        }
                    }
                },
                Fields::Unnamed(_) => {
                    quote! {
                        fn describe(&self) -> String {
                            format!("{} is a tuple struct", stringify!(#name))
                        }
                    }
                },
                Fields::Unit => {
                    quote! {
                        fn describe(&self) -> String {
                            format!("{} is a unit struct", stringify!(#name))
                        }
                    }
                }
            }
        },
        Data::Enum(_) => {
            quote! {
                fn describe(&self) -> String {
                    format!("{} is an enum", stringify!(#name))
                }
            }
        },
        Data::Union(_) => {
            panic!("Unions are not supported")
        }
    };
    
    let expanded = quote! {
        impl Describe for #name {
            #description
        }
    };
    
    TokenStream::from(expanded)
}
```

**my_app/src/main.rs:**

```rust
use my_derive::Describe;

trait Describe {
    fn describe(&self) -> String;
}

#[derive(Describe)]
struct Person {
    name: String,
    age: u32,
    email: String,
}

#[derive(Describe)]
struct Point(i32, i32);

#[derive(Describe)]
struct UnitStruct;

fn main() {
    let person = Person {
        name: "Alice".to_string(),
        age: 30,
        email: "alice@example.com".to_string(),
    };
    
    let point = Point(10, 20);
    let unit = UnitStruct;
    
    println!("{}", person.describe());
    // Output: Person has 3 fields: name, age, email
    
    println!("{}", point.describe());
    // Output: Point is a tuple struct
    
    println!("{}", unit.describe());
    // Output: UnitStruct is a unit struct
}
```

## Example: Builder Pattern (Fully Working)

**my_derive/src/lib.rs:**

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields, Ident};

#[proc_macro_derive(Builder)]
pub fn derive_builder(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    let builder_name = Ident::new(&format!("{}Builder", name), name.span());
    
    // Extract named fields
    let fields = match &input.data {
        Data::Struct(data) => match &data.fields {
            Fields::Named(fields) => &fields.named,
            _ => panic!("Builder only works with named fields"),
        },
        _ => panic!("Builder only works with structs"),
    };
    
    // Generate builder struct fields (all Option<T>)
    let builder_fields = fields.iter().map(|f| {
        let name = &f.ident;
        let ty = &f.ty;
        quote! { #name: std::option::Option<#ty> }
    });
    
    // Generate initialization (all None)
    let builder_inits = fields.iter().map(|f| {
        let name = &f.ident;
        quote! { #name: std::option::Option::None }
    });
    
    // Generate setter methods
    let setters = fields.iter().map(|f| {
        let name = &f.ident;
        let ty = &f.ty;
        quote! {
            pub fn #name(mut self, #name: #ty) -> Self {
                self.#name = std::option::Option::Some(#name);
                self
            }
        }
    });
    
    // Generate build method
    let build_fields = fields.iter().map(|f| {
        let name = &f.ident;
        let name_str = name.as_ref().unwrap().to_string();
        quote! {
            #name: self.#name.ok_or_else(|| format!("Field '{}' not set", #name_str))?
        }
    });
    
    let expanded = quote! {
        pub struct #builder_name {
            #(#builder_fields,)*
        }
        
        impl #name {
            pub fn builder() -> #builder_name {
                #builder_name {
                    #(#builder_inits,)*
                }
            }
        }
        
        impl #builder_name {
            #(#setters)*
            
            pub fn build(self) -> std::result::Result<#name, std::string::String> {
                std::result::Result::Ok(#name {
                    #(#build_fields,)*
                })
            }
        }
    };
    
    TokenStream::from(expanded)
}
```

**my_app/src/main.rs:**

```rust
use my_derive::Builder;

#[derive(Builder, Debug)]
struct User {
    username: String,
    email: String,
    age: u32,
}

fn main() {
    // Using the builder
    let user = User::builder()
        .username("alice".to_string())
        .email("alice@example.com".to_string())
        .age(30)
        .build()
        .unwrap();
    
    println!("{:?}", user);
    // Output: User { username: "alice", email: "alice@example.com", age: 30 }
    
    // Missing field will cause error
    let result = User::builder()
        .username("bob".to_string())
        .build();
    
    println!("{:?}", result);
    // Output: Err("Field 'email' not set")
}
```

# Key Technical Details

## 1. **TokenStream**

- Input: The struct/enum definition as tokens
- Output: Generated implementation code as tokens

## 2. **syn crate**

- Parses TokenStream into a syntax tree (AST)
- Provides types like `DeriveInput`, `Data`, `Fields`

## 3. **quote! macro**

- Converts Rust code into TokenStream
- Use `#variable` to interpolate values
- Use `#()*` for repetition

## 4. **Common Patterns**

```rust
// Interpolation
let name = /* ... */;
quote! { struct #name { } }

// Repetition
let fields = vec![/* ... */];
quote! { 
    struct Foo {
        #(#fields,)*  // Creates: field1, field2, field3,
    }
}

// Method calls on fields
let field_names = fields.iter().map(|f| &f.ident);
quote! { #(self.#field_names),* }
```

## 5. **Debugging**

```bash
# See expanded macros
cargo expand

# Enable macro debugging
RUSTFLAGS="--cfg procmacro2_semver_exempt" cargo build -vv
```

## Helper Attributes

You can add custom attributes:

```rust
#[proc_macro_derive(MyTrait, attributes(my_attr))]
pub fn derive_my_trait(input: TokenStream) -> TokenStream {
    // Now you can use #[my_attr] on fields
    // ...
}
```

Usage:

```rust
#[derive(MyTrait)]
struct Example {
    #[my_attr(skip)]
    field1: i32,
    
    #[my_attr(rename = "custom")]
    field2: String,
}
```

No, not always! There are several options depending on your use case:

## Option 1: Two Separate Crates (Most Common for Libraries)

This is what you do when creating a **library** that others will use:

```txt
my_library/
├── my_derive/        # proc-macro crate
└── my_library/       # main library crate (depends on my_derive)
```

Users just add your main library:

```toml
[dependencies]
my_library = "1.0"
```

**Example**: `serde` does this - they have `serde_derive` (proc-macro) and `serde` (main library).

## Option 2: Workspace with Internal Proc-Macro (Common Pattern)

You can have everything in ONE workspace but with internal separation:

```txt
my_project/
├── Cargo.toml          # Workspace root
├── derive/             # proc-macro crate
│   ├── Cargo.toml
│   └── src/lib.rs
└── src/
    └── main.rs         # or lib.rs
```

**Root Cargo.toml:**

```toml
[workspace]
members = ["derive"]

[package]
name = "my_project"
version = "0.1.0"
edition = "2021"

[dependencies]
my_project_derive = { path = "derive" }
```

**derive/Cargo.toml:**

```toml
[package]
name = "my_project_derive"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true

[dependencies]
syn = "2.0"
quote = "1.0"
proc-macro2 = "1.0"
```

Now you can use it in **the same project**:

**src/main.rs:**

```rust
use my_project_derive::MyTrait;

trait MyTrait {
    fn my_method(&self);
}

#[derive(MyTrait)]
struct MyStruct {
    field: i32,
}

fn main() {
    let s = MyStruct { field: 42 };
    s.my_method();
}
```

## Option 3: Single Crate Re-export (Best for Published Libraries)

This is the cleanest for users - they see ONE crate:

```txt
my_awesome_lib/
├── Cargo.toml
├── my_awesome_lib_derive/
│   ├── Cargo.toml
│   └── src/lib.rs
└── src/
    └── lib.rs
```

**Root Cargo.toml:**

```toml
[package]
name = "my_awesome_lib"
version = "0.1.0"
edition = "2021"

[dependencies]
my_awesome_lib_derive = { path = "my_awesome_lib_derive" }

[workspace]
members = ["my_awesome_lib_derive"]
```

**src/lib.rs:**

```rust
// Re-export the derive macro
pub use my_awesome_lib_derive::MyTrait;

// Define the trait here
pub trait MyTrait {
    fn my_method(&self);
}
```

Users just do:

```rust
use my_awesome_lib::MyTrait;

#[derive(MyTrait)]
struct Foo {}
```

**This is what most popular crates do:**

- `serde` re-exports `serde_derive::Serialize`
- `clap` re-exports `clap_derive::Parser`
- `thiserror` re-exports `thiserror_derive::Error`

## Why Must Proc-Macros Be Separate?

**Technical Reason**: Rust compiles proc-macro crates differently:

1. **Proc-macro crates** are compiled as **dynamic libraries** that run during compilation
2. **Regular crates** are compiled as your final binary/library
3. They have different compilation targets and can't be mixed in the same crate

The Rust compiler needs to:

- First compile the proc-macro crate
- Load it as a plugin
- Then use it while compiling your regular code

This is why `proc-macro = true` must be in a separate crate.

## What I Recommend

**For personal projects:**

- Use Option 2 (workspace with internal proc-macro folder)

**For libraries you'll publish:**

- Use Option 3 (re-export pattern)
- Users never need to know about the internal derive crate

**Quick test/learning:**

- Two completely separate crates (like my first example)

## Complete Example: Library with Re-export

**Project structure:**

```txt
my_lib/
├── Cargo.toml
├── my_lib_derive/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
└── src/
    └── lib.rs
```

**Root Cargo.toml:**

```toml
[workspace]
members = ["my_lib_derive"]

[package]
name = "my_lib"
version = "0.1.0"
edition = "2021"

[dependencies]
my_lib_derive = { path = "my_lib_derive" }
```

**my_lib_derive/Cargo.toml:**

```toml
[package]
name = "my_lib_derive"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true

[dependencies]
syn = { version = "2.0", features = ["full"] }
quote = "1.0"
proc-macro2 = "1.0"
```

**my_lib_derive/src/lib.rs:**

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Hello)]
pub fn derive_hello(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    
    let expanded = quote! {
        impl Hello for #name {
            fn hello(&self) {
                println!("Hello from {}!", stringify!(#name));
            }
        }
    };
    
    TokenStream::from(expanded)
}
```

**src/lib.rs:**

```rust
// Re-export the derive macro
pub use my_lib_derive::Hello;

// Define the trait
pub trait Hello {
    fn hello(&self);
}

// Users can use it like this:
// use my_lib::Hello;
// 
// #[derive(Hello)]
// struct MyStruct;
```

Now users just add:

```toml
[dependencies]
my_lib = "0.1.0"
```

And use:

```rust
use my_lib::Hello;

#[derive(Hello)]
struct MyStruct {
    value: i32,
}

fn main() {
    let s = MyStruct { value: 42 };
    s.hello();
}
```

**Bottom line**: You always need the proc-macro code to be in a crate with `proc-macro = true`, but it can be a sub-crate within your project, not necessarily a completely separate project.

That's the complete picture! The "magic" is just compiler integration at compile-time.

The `#[derive]` proc-macro **must always be in a separate crate** from where you use it.

# Why? Technical Limitation

The proc-macro crate has `proc-macro = true`, which tells Rust:

- Compile this as a **compiler plugin** (dynamic library)
- This code runs **during compilation** of other crates
- It cannot be in the same crate as regular Rust code

Think of it this way:

- **Proc-macro crate** = Tool that runs at compile-time
- **User crate** = Code being compiled

You can't be both the tool AND the thing being worked on at the same time.