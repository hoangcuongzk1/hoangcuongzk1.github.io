---
title: "Rust Macros: Complete Mastery Guide"
creation date: 2026-02-22T10:58:00
last edited: 2026-02-22T10:58:00
slug: rust-14
series: rust
excerpt:
lang: en
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQjmX93dXLnhAJQV7tb1QfvySrOIA1WB3J7A&s
tags:
  - 🦀rust
---

# Rust Macros: Complete Mastery Guide

## Overview: Two Types of Macros

Rust has **two fundamentally different macro systems**:

1. **Declarative Macros** (`macro_rules!`) — pattern matching on syntax
2. **Procedural Macros** (`proc-macro`) — full Rust code that transforms AST (Abstract Syntax Tree)

---

## Part 1: Declarative Macros (`macro_rules!`)

### What it is

A macro that matches patterns in your code and expands them into other code — like a very powerful `match` expression, but for syntax itself.

### Basic Syntax

```rust
macro_rules! macro_name {
    (pattern) => {
        expansion
    };
    (another_pattern) => {
        another_expansion
    };
}
```

### Designators (Meta-variables)

These are the "types" of things you can capture in patterns:

|Designator|Captures|
|---|---|
|`$x:expr`|Any expression (`1 + 2`, `foo()`, etc.)|
|`$x:ident`|An identifier (`foo`, `my_var`)|
|`$x:ty`|A type (`i32`, `Vec<String>`)|
|`$x:literal`|A literal (`42`, `"hello"`)|
|`$x:stmt`|A statement|
|`$x:pat`|A pattern (used in `match`)|
|`$x:block`|A block `{ ... }`|
|`$x:item`|An item (fn, struct, impl, etc.)|
|`$x:meta`|Meta attributes (`#[...]`)|
|`$x:tt`|**Token tree** — a single token or group (most flexible)|
|`$x:vis`|Visibility (`pub`, `pub(crate)`)|
|`$x:lifetime`|A lifetime (`'a`)|

### Repetitions

```rust
$( ... )*    // zero or more
$( ... )+    // one or more
$( ... )?    // zero or one
```

---

### Example 1: Simple `say_hello!`

```rust
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
    ($name:expr) => {
        println!("Hello, {}!", $name);
    };
}

fn main() {
    say_hello!();           // Hello!
    say_hello!("Alice");    // Hello, Alice!
}
```

---

### Example 2: `vec!` clone — Understanding Repetition

```rust
macro_rules! my_vec {
    // match zero or more expressions separated by comma
    ( $( $x:expr ),* ) => {
        {
            let mut v = Vec::new();
            $( v.push($x); )*  // repeat this for each $x
            v
        }
    };
}

fn main() {
    let v = my_vec![1, 2, 3, 4];
    println!("{:?}", v); // [1, 2, 3, 4]
}
```

---

### Example 3: Creating Structs Dynamically

```rust
macro_rules! create_struct {
    ($name:ident { $( $field:ident : $ty:ty ),* }) => {
        struct $name {
            $( pub $field: $ty, )*
        }
    };
}

create_struct!(Point { x: f64, y: f64 });
create_struct!(Color { r: u8, g: u8, b: u8 });

fn main() {
    let p = Point { x: 1.0, y: 2.0 };
    let c = Color { r: 255, g: 128, b: 0 };
}
```

---

### Example 4: Implementing Multiple Traits (answers your inheritance question!)

```rust
macro_rules! impl_display_for {
    ($($t:ty),+) => {
        $(
            impl std::fmt::Display for $t {
                fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
                    write!(f, "{:?}", self)
                }
            }
        )+
    };
}

#[derive(Debug)] struct Foo;
#[derive(Debug)] struct Bar;
#[derive(Debug)] struct Baz;

impl_display_for!(Foo, Bar, Baz);
```

---

### Example 5: `HashMap` literal macro

```rust
macro_rules! hashmap {
    ( $( $key:expr => $val:expr ),* $(,)? ) => {
        {
            let mut map = std::collections::HashMap::new();
            $( map.insert($key, $val); )*
            map
        }
    };
}

fn main() {
    let m = hashmap! {
        "one" => 1,
        "two" => 2,
        "three" => 3,
    };
}
```

> **Tip:** `$(,)?` allows an optional trailing comma — very idiomatic Rust.

---

### Example 6: Logging with File/Line Info

```rust
macro_rules! log_debug {
    ($($arg:tt)*) => {
        println!("[{}:{}] {}", file!(), line!(), format!($($arg)*));
    };
}

fn main() {
    log_debug!("Value is: {}", 42);
    // [src/main.rs:10] Value is: 42
}
```

---

### Example 7: Recursive Macro — Counting

```rust
macro_rules! count {
    () => (0usize);
    ( $x:tt $($xs:tt)* ) => (1usize + count!($($xs)*));
}

fn main() {
    println!("{}", count!(a b c d e)); // 5
}
```

---

### Example 8: Builder Pattern via Macro

```rust
macro_rules! builder {
    ($name:ident { $( $field:ident : $ty:ty = $default:expr ),* }) => {
        #[derive(Debug)]
        struct $name {
            $( $field: $ty, )*
        }

        impl $name {
            fn new() -> Self {
                Self {
                    $( $field: $default, )*
                }
            }

            $(
                fn $field(mut self, val: $ty) -> Self {
                    self.$field = val;
                    self
                }
            )*
        }
    };
}

builder!(Config {
    host: String = String::from("localhost"),
    port: u16 = 8080,
    debug: bool = false
});

fn main() {
    let cfg = Config::new()
        .host("example.com".into())
        .port(443)
        .debug(true);
    println!("{:?}", cfg);
}
```

---

## Part 2: Procedural Macros (`proc-macro`)

### What it is

A Rust **function** that takes a `TokenStream` (code as tokens) and returns a new `TokenStream`. This runs at **compile time** and can generate arbitrary code.

### Three Types of Proc Macros

|Type|Usage|Example|
|---|---|---|
|**Function-like**|`my_macro!(...)`|`sql!(SELECT * FROM users)`|
|**Derive**|`#[derive(MyTrait)]`|`#[derive(Serialize)]`|
|**Attribute**|`#[my_attr]` on items|`#[route(GET, "/")]`|

### Setup: Proc Macro Crate

Proc macros **must live in their own crate**. Project structure:

```txt
my_project/
├── Cargo.toml          (workspace)
├── my_app/
│   ├── Cargo.toml
│   └── src/main.rs
└── my_macros/          ← proc macro crate
    ├── Cargo.toml
    └── src/lib.rs
```

**`my_macros/Cargo.toml`:**

```toml
[package]
name = "my_macros"
version = "0.1.0"
edition = "2021"

[lib]
proc-macro = true       # ← THIS IS REQUIRED

[dependencies]
syn = { version = "2", features = ["full"] }
quote = "1"
proc-macro2 = "1"
```

**`my_app/Cargo.toml`:**

```toml
[dependencies]
my_macros = { path = "../my_macros" }
```

### Key Libraries

|Crate|Purpose|
|---|---|
|`syn`|**Parse** Rust code (tokens → structured AST)|
|`quote`|**Generate** Rust code (AST → tokens)|
|`proc-macro2`|Token types usable outside proc-macro context|

---

### Proc Macro Type 1: Custom `#[derive]`

**Goal:** Auto-implement a `Describe` trait that prints type name.

**`my_macros/src/lib.rs`:**

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Describe)]
pub fn describe_derive(input: TokenStream) -> TokenStream {
    // Parse the input tokens into a syntax tree
    let ast = parse_macro_input!(input as DeriveInput);

    let name = &ast.ident; // The struct/enum name

    // Generate code using quote!
    let expanded = quote! {
        impl Describe for #name {
            fn describe(&self) -> String {
                format!("I am a '{}'", stringify!(#name))
            }
        }
    };

    expanded.into()
}
```

**`my_app/src/main.rs`:**

```rust
use my_macros::Describe;

trait Describe {
    fn describe(&self) -> String;
}

#[derive(Describe)]
struct Dog;

#[derive(Describe)]
struct Cat;

fn main() {
    let d = Dog;
    let c = Cat;
    println!("{}", d.describe()); // I am a 'Dog'
    println!("{}", c.describe()); // I am a 'Cat'
}
```

---

### Proc Macro Type 2: Derive with Field Inspection

**Goal:** Auto-generate a `new()` constructor from struct fields.

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput, Data, Fields};

#[proc_macro_derive(Constructor)]
pub fn constructor_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    // Extract fields from struct
    let fields = match &ast.data {
        Data::Struct(s) => match &s.fields {
            Fields::Named(f) => &f.named,
            _ => panic!("Only named fields supported"),
        },
        _ => panic!("Only structs supported"),
    };

    let field_names: Vec<_> = fields.iter()
        .map(|f| f.ident.as_ref().unwrap())
        .collect();

    let field_types: Vec<_> = fields.iter()
        .map(|f| &f.ty)
        .collect();

    let expanded = quote! {
        impl #name {
            pub fn new( #( #field_names: #field_types ),* ) -> Self {
                Self { #( #field_names ),* }
            }
        }
    };

    expanded.into()
}
```

**Usage:**

```rust
#[derive(Constructor, Debug)]
struct Point {
    x: f64,
    y: f64,
    label: String,
}

fn main() {
    let p = Point::new(1.0, 2.0, "origin".to_string());
    println!("{:?}", p);
}
```

---

### Proc Macro Type 3: Attribute Macro

**Goal:** `#[log_call]` that prints when a function is called.

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, ItemFn};

#[proc_macro_attribute]
pub fn log_call(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let func = parse_macro_input!(item as ItemFn);
    let func_name = &func.sig.ident;
    let func_block = &func.block;
    let func_sig = &func.sig;
    let func_vis = &func.vis;

    let expanded = quote! {
        #func_vis #func_sig {
            println!("[LOG] Calling '{}'", stringify!(#func_name));
            let result = (|| #func_block)();
            println!("[LOG] '{}' returned", stringify!(#func_name));
            result
        }
    };

    expanded.into()
}
```

**Usage:**

```rust
#[log_call]
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = add(2, 3);
    // [LOG] Calling 'add'
    // [LOG] 'add' returned
    println!("{}", result); // 5
}
```

---

### Proc Macro Type 4: Function-like Macro

**Goal:** A `sql!` macro that validates SQL at compile time (simplified).

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, LitStr};

#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
    let sql_str = parse_macro_input!(input as LitStr);
    let value = sql_str.value();

    // Compile-time "validation"
    if !value.trim_start().to_uppercase().starts_with("SELECT") 
       && !value.trim_start().to_uppercase().starts_with("INSERT") {
        panic!("Only SELECT and INSERT are supported: {}", value);
    }

    quote! {
        // In real use, you'd return a typed query object
        String::from(#value)
    }.into()
}
```

**Usage:**

```rust
let query = sql!("SELECT * FROM users WHERE id = 1");
// let bad = sql!("DROP TABLE users"); // ← compile error!
```

---

## Part 3: Answering Your Key Question

### "Does macro replace inheritance?"

**Yes — and even better.** Here's the full picture:

In C++/C# you use inheritance primarily for:

|C++/C# Use Case|Rust Solution|
|---|---|
|Sharing method implementations|`trait` default methods|
|Code reuse across types|`macro_rules!` or blanket `impl`|
|Polymorphism|`trait` objects (`dyn Trait`)|
|Auto-implementing boilerplate|`#[derive(...)]` proc macros|
|Constructor patterns|Builder macros, `Default` trait|

**Concrete example — inheritance vs Rust:**

```rust
// C# style thinking (WRONG in Rust):
// class Animal { void breathe() {} }
// class Dog : Animal { void bark() {} }

// Rust way with traits + macros:
trait Animal {
    fn name(&self) -> &str;
    
    // Default implementation — like C# virtual method
    fn breathe(&self) {
        println!("{} breathes", self.name());
    }
}

// Macro to reduce boilerplate for simple animals
macro_rules! simple_animal {
    ($struct_name:ident, $name:literal) => {
        struct $struct_name;

        impl Animal for $struct_name {
            fn name(&self) -> &str { $name }
        }
    };
}

simple_animal!(Dog, "Dog");
simple_animal!(Cat, "Cat");
simple_animal!(Bird, "Bird");

fn main() {
    let animals: Vec<Box<dyn Animal>> = vec![
        Box::new(Dog), Box::new(Cat), Box::new(Bird)
    ];
    for a in &animals {
        a.breathe(); // uses default impl
    }
}
```

---

## Part 4: Debugging Macros

### `cargo expand`

The most important tool. Install and use:

```bash
cargo install cargo-expand
cargo expand           # expand all macros
cargo expand main      # expand specific module
```

This shows you exactly what code your macros generate — **invaluable** for debugging.

### `trace_macros!` (nightly)

```rust
#![feature(trace_macros)]
trace_macros!(true);
my_macro!(foo bar);
trace_macros!(false);
```

### `dbg_macro` crate

```toml
[dependencies]
dbg-macro = "0.4"
```

---

## Part 5: When to Use What

|Situation|Use|
|---|---|
|Simple code generation, pattern repetition|`macro_rules!`|
|Auto-implement traits for structs|`#[derive]` proc macro|
|Add behavior to functions/items|Attribute proc macro|
|DSL (domain-specific language)|Function-like proc macro|
|Implement same trait for many types|`macro_rules!` or blanket impl|
|Complex AST manipulation|`proc-macro` + `syn`|

---

## Part 6: Mastery Checklist

To truly master Rust macros, work through these in order:

1. Write `vec!`, `hashmap!`, `assert_eq!` yourself from scratch
2. Write a macro that implements a trait for multiple types
3. Build a Builder pattern generator in `macro_rules!`
4. Create a `#[derive(Getters)]` proc macro that generates getters for all fields
5. Create a `#[retry(3)]` attribute macro that retries a function N times on error
6. Write a function-like proc macro for a mini DSL (config file, SQL, HTML, etc.)
7. Study how `serde`, `tokio::main`, and `thiserror` work — read their source code

---

## Summary

- **`macro_rules!`** = pattern-based syntax rewriting, great for repetitive code generation, easy to write
- **proc macros** = full compile-time Rust programs, unlimited power, require separate crate + `syn`/`quote`
- Macros in Rust **replace the need for inheritance** by letting you generate trait implementations automatically
- Always use **`cargo expand`** to see what your macros produce
- The real path to mastery is reading `serde_derive`, `thiserror`, and `derive_more` source code — they are the gold standard



# Complete Mastery: `syn` + `quote` + Proc-Macro Deep Dive

---

## Part 1: `syn` — Parsing Rust Code

`syn` parses a `TokenStream` into a structured AST you can inspect and manipulate.

### The Core Parse Types

```rust
use syn::{
    // Top-level items
    DeriveInput,    // for #[derive(...)]
    ItemFn,         // fn foo() {}
    ItemStruct,     // struct Foo {}
    ItemEnum,       // enum Bar {}
    ItemImpl,       // impl Foo {}
    ItemTrait,      // trait Baz {}
    ItemMod,        // mod my_mod {}
    
    // Components
    Fields,         // named, unnamed, unit fields
    Field,          // single field
    Variant,        // enum variant
    Attribute,      // #[something]
    Generics,       // <T: Clone, U>
    WhereClause,    // where T: Debug
    Visibility,     // pub, pub(crate), private
    
    // Expressions & Statements  
    Expr,           // any expression
    Stmt,           // any statement
    Block,          // { ... }
    
    // Types
    Type,           // any type
    TypePath,       // std::vec::Vec<i32>
    ReturnType,     // -> i32 or nothing
    
    // Primitives
    Ident,          // identifier: foo, MyStruct
    LitStr,         // "hello"
    LitInt,         // 42
    LitFloat,       // 3.14
    LitBool,        // true/false
    
    // Punctuation helpers
    Token,
    punctuated::Punctuated, // comma-separated list
};
```

---

### Parsing Strategies

#### Strategy 1: `parse_macro_input!` — most common

```rust
use proc_macro::TokenStream;
use syn::{parse_macro_input, DeriveInput, ItemFn, ItemStruct};

#[proc_macro_derive(MyDerive)]
pub fn my_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    // ast.ident  = struct/enum name
    // ast.data   = fields or variants
    // ast.attrs  = attributes on the item
    // ast.generics = generic params
    todo!()
}

#[proc_macro_attribute]
pub fn my_attr(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let func = parse_macro_input!(item as ItemFn);
    todo!()
}
```

#### Strategy 2: Custom `Parse` implementation

When you need to parse custom syntax inside `macro!(...)`:

```rust
use syn::{parse::{Parse, ParseStream}, Token, Ident, LitStr, Result};

// We want: my_macro!(name = "hello", count = 5)
struct MyArgs {
    name: LitStr,
    count: syn::LitInt,
}

impl Parse for MyArgs {
    fn parse(input: ParseStream) -> Result<Self> {
        // Parse: name = "hello"
        let _: Ident = input.parse()?;   // "name"
        let _: Token![=] = input.parse()?;
        let name: LitStr = input.parse()?;
        
        let _: Token![,] = input.parse()?; // comma
        
        // Parse: count = 5
        let _: Ident = input.parse()?;   // "count"
        let _: Token![=] = input.parse()?;
        let count: syn::LitInt = input.parse()?;
        
        Ok(MyArgs { name, count })
    }
}

#[proc_macro]
pub fn my_macro(input: TokenStream) -> TokenStream {
    let args = parse_macro_input!(input as MyArgs);
    let name = args.name.value();       // String
    let count = args.count.base10_parse::<usize>().unwrap();
    
    quote::quote! { /* ... */ }.into()
}
```

#### Strategy 3: Parsing Attribute Arguments

```rust
use syn::{
    parse_macro_input, AttributeArgs,  // old syn 1.x way
    meta::ParseNestedMeta,             // syn 2.x way (preferred)
};

// For #[my_attr(timeout = 30, retry = true)]
#[proc_macro_attribute]
pub fn my_attr(attr: TokenStream, item: TokenStream) -> TokenStream {
    let mut timeout = 10u64;
    let mut retry = false;

    // syn 2.x style attribute parsing
    let attr_parser = syn::meta::parser(|meta| {
        if meta.path.is_ident("timeout") {
            timeout = meta.value()?.parse::<syn::LitInt>()?.base10_parse()?;
            Ok(())
        } else if meta.path.is_ident("retry") {
            retry = true;
            Ok(())
        } else {
            Err(meta.error("unsupported attribute"))
        }
    });

    parse_macro_input!(attr with attr_parser);
    let func = parse_macro_input!(item as ItemFn);
    
    // use timeout and retry...
    quote::quote! { #func }.into()
}
```

---

### Complete `syn` API by Category

#### Working with `DeriveInput`

```rust
use syn::{DeriveInput, Data, Fields, FieldsNamed, FieldsUnnamed};

fn process(ast: DeriveInput) {
    let name = &ast.ident;           // struct name as Ident
    let name_str = name.to_string(); // "MyStruct"
    let vis = &ast.vis;              // visibility
    let attrs = &ast.attrs;          // #[...] attributes
    let generics = &ast.generics;    // <T, U: Clone>

    match &ast.data {
        // STRUCT
        Data::Struct(s) => {
            match &s.fields {
                // struct Foo { x: i32, y: String }
                Fields::Named(FieldsNamed { named, .. }) => {
                    for field in named {
                        let fname = field.ident.as_ref().unwrap();
                        let ftype = &field.ty;
                        let fattrs = &field.attrs;
                        let fvis = &field.vis;
                        println!("field: {} : {:?}", fname, ftype);
                    }
                }
                // struct Foo(i32, String)
                Fields::Unnamed(FieldsUnnamed { unnamed, .. }) => {
                    for (i, field) in unnamed.iter().enumerate() {
                        let ftype = &field.ty;
                        // access by index: self.0, self.1
                    }
                }
                // struct Foo;
                Fields::Unit => {}
            }
        }

        // ENUM
        Data::Enum(e) => {
            for variant in &e.variants {
                let vname = &variant.ident;
                let vattrs = &variant.attrs;
                match &variant.fields {
                    Fields::Named(_) => {}   // Foo { x: i32 }
                    Fields::Unnamed(_) => {} // Foo(i32)
                    Fields::Unit => {}       // Foo
                }
                // discriminant: enum Foo { A = 1 }
                if let Some((_, disc)) = &variant.discriminant {
                    // disc is an Expr
                }
            }
        }

        Data::Union(u) => {
            // union fields
        }
    }
}
```

#### Working with Generics

```rust
use syn::{Generics, GenericParam, TypeParam, LifetimeParam};
use quote::quote;

fn handle_generics(generics: &Generics) {
    // <T, U: Clone, 'a>
    let (impl_generics, ty_generics, where_clause) = generics.split_for_impl();
    
    // Use in quote!:
    // impl #impl_generics MyTrait for MyStruct #ty_generics #where_clause { }
    
    for param in &generics.params {
        match param {
            GenericParam::Type(TypeParam { ident, bounds, .. }) => {
                // ident = T, bounds = Clone + Debug
            }
            GenericParam::Lifetime(LifetimeParam { lifetime, .. }) => {
                // lifetime = 'a
            }
            GenericParam::Const(c) => {
                // const N: usize
            }
        }
    }
}

// Adding bounds to generics
fn add_trait_bound(mut generics: Generics, bound: syn::TypeParamBound) -> Generics {
    for param in &mut generics.params {
        if let GenericParam::Type(type_param) = param {
            type_param.bounds.push(bound.clone());
        }
    }
    generics
}
```

#### Parsing Attributes (`#[...]`)

```rust
use syn::{Attribute, Meta, Expr};

fn parse_field_attrs(attrs: &[Attribute]) {
    for attr in attrs {
        // Check the path: #[serde(...)] → path is "serde"
        if attr.path().is_ident("serde") {
            // Parse inner meta
            attr.parse_nested_meta(|meta| {
                if meta.path.is_ident("rename") {
                    let val: LitStr = meta.value()?.parse()?;
                    println!("rename to: {}", val.value());
                }
                if meta.path.is_ident("skip") {
                    println!("skip this field");
                }
                Ok(())
            }).unwrap();
        }

        // Word attr: #[my_flag]
        if attr.path().is_ident("my_flag") {
            println!("flag is set");
        }
    }
}
```

---

## Part 2: `quote` — Generating Rust Code

`quote!` is a macro that turns Rust-like syntax into a `TokenStream`.

### Interpolation Basics

```rust
use quote::quote;
use syn::Ident;
use proc_macro2::Span;

let name = Ident::new("MyStruct", Span::call_site());
let field_type = quote! { Vec<String> };

let code = quote! {
    impl #name {
        pub fn new() -> Self {
            Self { items: Vec::new() }
        }
    }
};
```

### All Interpolation Forms

```rust
let name: Ident = ...;
let ty: Type = ...;
let expr: Expr = ...;
let val: LitStr = ...;
let items: Vec<Ident> = vec![...];

quote! {
    // Single variable interpolation
    struct #name {}

    // Repeat with separator
    fn foo(#(#items: u32),*) {}         // a: u32, b: u32, c: u32
    
    // Repeat with code around each
    match x {
        #( MyEnum::#items => {} )*
    }
    
    // Nested repeat (zip two vecs together)
    struct #name {
        #( #field_names: #field_types, )*
    }
    
    // Conditional with Option
    // (use a variable holding tokens)
    #maybe_impl   // if this is quote!{} it outputs nothing
}
```

### `quote::format_ident!` — Creating New Identifiers

```rust
use quote::format_ident;

let name = Ident::new("Dog", Span::call_site());

let getter = format_ident!("get_{}", name);      // get_Dog
let setter = format_ident!("set_{}", name);      // set_Dog
let builder = format_ident!("{}Builder", name);  // DogBuilder
let snake = format_ident!("{}_instance", 
    name.to_string().to_lowercase());             // dog_instance

quote! {
    fn #getter(&self) -> &str { &self.name }
    fn #setter(&mut self, v: String) { self.name = v; }
}
```

### Generating Conditional Code

```rust
// Option<TokenStream> pattern — clean conditional generation
let maybe_debug = if should_derive_debug {
    quote! { #[derive(Debug)] }
} else {
    quote! {}  // empty token stream
};

let maybe_where = if has_where_clause {
    quote! { where T: Clone + Debug }
} else {
    quote! {}
};

quote! {
    #maybe_debug
    struct MyStruct<T> #maybe_where {
        value: T,
    }
}
```

### Generating `match` Arms Dynamically

```rust
let variants = vec![
    Ident::new("Red", Span::call_site()),
    Ident::new("Green", Span::call_site()),
    Ident::new("Blue", Span::call_site()),
];
let values = vec![
    quote! { (255, 0, 0) },
    quote! { (0, 255, 0) },
    quote! { (0, 0, 255) },
];

quote! {
    impl Color {
        pub fn to_rgb(&self) -> (u8, u8, u8) {
            match self {
                #( Color::#variants => #values, )*
            }
        }
    }
}
```

### `proc_macro2::TokenStream` vs `proc_macro::TokenStream`

```rust
// proc_macro::TokenStream  → required by proc macro fn signatures
// proc_macro2::TokenStream → used INSIDE your logic (testable!)

use proc_macro::TokenStream;
use proc_macro2::TokenStream as TokenStream2;
use quote::quote;

#[proc_macro_derive(MyTrait)]
pub fn my_derive(input: TokenStream) -> TokenStream {
    // Convert to proc_macro2 for internal work
    let input2: TokenStream2 = input.into();
    
    // Do all logic with proc_macro2
    let output: TokenStream2 = impl_my_trait(input2);
    
    // Convert back
    output.into()
}

// This function is unit-testable!
fn impl_my_trait(input: TokenStream2) -> TokenStream2 {
    let ast: syn::DeriveInput = syn::parse2(input).unwrap();
    quote! { /* ... */ }
}
```

---

## Part 3: Full Real-World Examples

### Example 1: `#[derive(Getters)]` — Full Implementation

```rust
use proc_macro::TokenStream;
use quote::{quote, format_ident};
use syn::{parse_macro_input, DeriveInput, Data, Fields};

#[proc_macro_derive(Getters, attributes(getter))]
pub fn derive_getters(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;
    let (impl_generics, ty_generics, where_clause) = ast.generics.split_for_impl();

    let methods = match &ast.data {
        Data::Struct(s) => match &s.fields {
            Fields::Named(f) => f.named.iter().map(|field| {
                let fname = field.ident.as_ref().unwrap();
                let ftype = &field.ty;
                
                // Check for #[getter(skip)] attribute
                let skip = field.attrs.iter().any(|a| {
                    a.path().is_ident("getter") &&
                    a.parse_nested_meta(|m| {
                        if m.path.is_ident("skip") { Ok(()) }
                        else { Err(m.error("unknown")) }
                    }).is_ok()
                });

                if skip {
                    return quote! {};
                }

                let getter_name = format_ident!("get_{}", fname);
                
                quote! {
                    pub fn #getter_name(&self) -> &#ftype {
                        &self.#fname
                    }
                }
            }).collect::<Vec<_>>(),
            _ => panic!("Getters only supports named fields"),
        },
        _ => panic!("Getters only supports structs"),
    };

    quote! {
        impl #impl_generics #name #ty_generics #where_clause {
            #( #methods )*
        }
    }.into()
}
```

**Usage:**

```rust
#[derive(Getters)]
struct User {
    name: String,
    age: u32,
    #[getter(skip)]
    password_hash: String,
}

let u = User { name: "Alice".into(), age: 30, password_hash: "xyz".into() };
println!("{}", u.get_name()); // Alice
println!("{}", u.get_age());  // 30
// u.get_password_hash() → doesn't exist!
```

---

### Example 2: `#[derive(Builder)]` — Full Real-World Pattern

```rust
#[proc_macro_derive(Builder)]
pub fn derive_builder(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;
    let builder_name = format_ident!("{}Builder", name);

    let fields = match &ast.data {
        Data::Struct(s) => match &s.fields {
            Fields::Named(f) => &f.named,
            _ => panic!("Builder needs named fields"),
        },
        _ => panic!("Builder only for structs"),
    };

    let field_names: Vec<_> = fields.iter()
        .map(|f| f.ident.as_ref().unwrap()).collect();
    let field_types: Vec<_> = fields.iter()
        .map(|f| &f.ty).collect();

    // Builder struct has Option<T> for each field
    let builder_fields = field_names.iter().zip(field_types.iter()).map(|(n, t)| {
        quote! { #n: Option<#t> }
    });

    // Setter methods
    let setters = field_names.iter().zip(field_types.iter()).map(|(n, t)| {
        quote! {
            pub fn #n(mut self, val: #t) -> Self {
                self.#n = Some(val);
                self
            }
        }
    });

    // build() method — fail if any field is None
    let build_fields = field_names.iter().map(|n| {
        let err = format!("field '{}' not set", n);
        quote! {
            #n: self.#n.ok_or(#err)?
        }
    });

    quote! {
        // The builder struct
        pub struct #builder_name {
            #( #builder_fields, )*
        }

        // Builder impl
        impl #builder_name {
            pub fn new() -> Self {
                Self { #( #field_names: None, )* }
            }
            #( #setters )*
            pub fn build(self) -> Result<#name, &'static str> {
                Ok(#name {
                    #( #build_fields, )*
                })
            }
        }

        // Add builder() method to original struct
        impl #name {
            pub fn builder() -> #builder_name {
                #builder_name::new()
            }
        }
    }.into()
}
```

**Usage:**

```rust
#[derive(Builder, Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    workers: usize,
}

fn main() {
    let cfg = ServerConfig::builder()
        .host("localhost".into())
        .port(8080)
        .workers(4)
        .build()
        .expect("config failed");
    
    println!("{:?}", cfg);
}
```

---

### Example 3: `#[retry(n)]` — Attribute Macro

```rust
#[proc_macro_attribute]
pub fn retry(attr: TokenStream, item: TokenStream) -> TokenStream {
    let func = parse_macro_input!(item as ItemFn);
    let retries = parse_macro_input!(attr as syn::LitInt)
        .base10_parse::<usize>()
        .expect("retry count must be integer");

    let fn_name = &func.sig.ident;
    let fn_vis = &func.vis;
    let fn_sig = &func.sig;
    let fn_block = &func.block;
    let fn_inputs = &func.sig.inputs;
    let fn_output = &func.sig.output;

    quote! {
        #fn_vis #fn_sig {
            let mut attempts = 0;
            loop {
                let result = (|| -> _ #fn_block)();
                match result {
                    Ok(val) => return Ok(val),
                    Err(e) => {
                        attempts += 1;
                        if attempts >= #retries {
                            return Err(e);
                        }
                        eprintln!("[retry] attempt {}/{} failed: {:?}", 
                            attempts, #retries, e);
                    }
                }
            }
        }
    }.into()
}
```

**Usage:**

```rust
#[retry(3)]
fn fetch_data(url: &str) -> Result<String, Box<dyn std::error::Error>> {
    // This will retry up to 3 times on error
    let response = some_http_call(url)?;
    Ok(response)
}
```

---

### Example 4: `#[timed]` — Measure Execution Time

```rust
#[proc_macro_attribute]
pub fn timed(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let func = parse_macro_input!(item as ItemFn);
    let fn_name = &func.sig.ident;
    let fn_name_str = fn_name.to_string();
    let fn_vis = &func.vis;
    let fn_sig = &func.sig;
    let fn_block = &func.block;

    quote! {
        #fn_vis #fn_sig {
            let __start = std::time::Instant::now();
            let __result = (|| #fn_block)();
            println!("[timed] '{}' took {:?}", #fn_name_str, __start.elapsed());
            __result
        }
    }.into()
}
```

---

### Example 5: `#[cached]` — Memoization Attribute

```rust
#[proc_macro_attribute]
pub fn cached(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let func = parse_macro_input!(item as ItemFn);
    let fn_name = &func.sig.ident;
    let fn_vis = &func.vis;
    let fn_block = &func.block;
    let fn_sig = &func.sig;
    let cache_name = format_ident!("{}_CACHE", fn_name.to_string().to_uppercase());

    // Extract input types for HashMap key
    let inputs = &func.sig.inputs;

    quote! {
        // Static cache using std::sync::Mutex
        static #cache_name: std::sync::OnceLock
            std::sync::Mutex<std::collections::HashMap<String, String>>
        > = std::sync::OnceLock::new();

        #fn_vis #fn_sig {
            let cache = #cache_name.get_or_init(|| {
                std::sync::Mutex::new(std::collections::HashMap::new())
            });

            let key = format!("{:?}", (__arg0,)); // simplified
            
            if let Some(cached) = cache.lock().unwrap().get(&key) {
                return cached.clone();
            }

            let result = (|| #fn_block)();
            cache.lock().unwrap().insert(key, result.clone());
            result
        }
    }.into()
}
```

---

### Example 6: `#[validate]` — Field Validation

```rust
// Usage:
// #[derive(Validate)]
// struct User {
//     #[validate(min_len = 2, max_len = 50)]
//     name: String,
//     #[validate(min = 0, max = 150)]
//     age: u32,
// }

#[proc_macro_derive(Validate, attributes(validate))]
pub fn derive_validate(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;

    let fields = match &ast.data {
        Data::Struct(s) => match &s.fields {
            Fields::Named(f) => &f.named,
            _ => panic!("named fields only"),
        },
        _ => panic!("structs only"),
    };

    let validations = fields.iter().map(|field| {
        let fname = field.ident.as_ref().unwrap();
        let fname_str = fname.to_string();
        let mut checks = vec![];

        for attr in &field.attrs {
            if !attr.path().is_ident("validate") { continue; }
            
            attr.parse_nested_meta(|meta| {
                if meta.path.is_ident("min_len") {
                    let val: syn::LitInt = meta.value()?.parse()?;
                    let n = val.base10_parse::<usize>()?;
                    checks.push(quote! {
                        if self.#fname.len() < #n {
                            errors.push(format!("'{}' is too short (min {})", #fname_str, #n));
                        }
                    });
                }
                if meta.path.is_ident("max_len") {
                    let val: syn::LitInt = meta.value()?.parse()?;
                    let n = val.base10_parse::<usize>()?;
                    checks.push(quote! {
                        if self.#fname.len() > #n {
                            errors.push(format!("'{}' is too long (max {})", #fname_str, #n));
                        }
                    });
                }
                if meta.path.is_ident("min") {
                    let val: syn::LitInt = meta.value()?.parse()?;
                    checks.push(quote! {
                        if self.#fname < #val {
                            errors.push(format!("'{}' is below minimum", #fname_str));
                        }
                    });
                }
                Ok(())
            }).unwrap();
        }
        quote! { #( #checks )* }
    });

    quote! {
        impl #name {
            pub fn validate(&self) -> Result<(), Vec<String>> {
                let mut errors = Vec::new();
                #( #validations )*
                if errors.is_empty() { Ok(()) } else { Err(errors) }
            }
        }
    }.into()
}
```

---

### Example 7: `#[singleton]` — Turns Any Struct Into a Singleton

```rust
#[proc_macro_attribute]
pub fn singleton(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as ItemStruct);
    let name = &input.ident;
    let static_name = format_ident!("{}_INSTANCE", name.to_string().to_uppercase());

    quote! {
        // Re-emit the original struct unchanged
        #input

        // Add singleton machinery
        static #static_name: std::sync::OnceLock<std::sync::Mutex<#name>> 
            = std::sync::OnceLock::new();

        impl #name {
            pub fn instance() -> std::sync::MutexGuard<'static, #name> {
                #static_name
                    .get_or_init(|| std::sync::Mutex::new(#name::default()))
                    .lock()
                    .unwrap()
            }
        }
    }.into()
}
```

**Usage:**

```rust
#[singleton]
#[derive(Default)]
struct AppState {
    counter: u32,
    running: bool,
}

fn main() {
    AppState::instance().counter += 1;
    println!("{}", AppState::instance().counter); // 1
}
```

---

## Part 4: `macro_rules!` vs `proc-macro` — When to Use What

### Use `macro_rules!` when:

|Scenario|Why|
|---|---|
|Simple code repetition|Easier, no extra crate needed|
|Implementing a trait for many types|`impl_trait_for!(TypeA, TypeB, TypeC)`|
|Creating collection literals|`hashmap!{}`, `set![]`|
|Variadic function-like macros|`println!` style|
|Internal project use|No crate setup overhead|
|Compile-time assertions|`assert_eq!` style|
|The pattern is purely textual/syntactic|No need to inspect type structure|

### Use `proc-macro` when:

|Scenario|Why|
|---|---|
|`#[derive(Trait)]` auto-implementation|Requires inspecting struct fields/variants|
|Modifying function behavior|`#[async_trait]`, `#[instrument]`|
|Transforming/annotating items|Can rewrite the entire item|
|Custom DSLs with complex syntax|`html!{}`, `sql!{}`|
|Generating code based on field attributes|`#[serde(rename = "...")]`|
|Cross-crate code generation|Needs proc-macro crate|
|You need `syn` to inspect AST|Any deep structural analysis|

### NEVER use macros when:

|Situation|Better Alternative|
|---|---|
|Simple generics solve the problem|`fn foo<T: Clone>(x: T)`|
|A trait with default methods is enough|`trait Foo { fn bar(&self) {} }`|
|A wrapper struct/newtype fits|`struct Wrapper<T>(T)`|
|You just want code reuse|Regular functions|
|The macro would be unreadable|Refactor instead|
|Debug/error messages become cryptic|Reconsider the design|

---

## Part 5: Attribute Macro — ALL Use Case Scenarios

Since attribute macros can **see and rewrite the entire item**, they're uniquely powerful. Here's every category:

### Category 1: Function Transformation

```txt
#[timed]            → wrap with timing
#[retry(n)]         → retry on error
#[log_call]         → log entry/exit
#[cached]           → memoize results
#[deprecated_warn]  → custom deprecation
#[rate_limit(100)]  → throttle calls
#[timeout(5s)]      → fail after duration
#[trace]            → distributed tracing
#[authorize("admin")]  → role check before exec
```

### Category 2: Struct/Enum Transformation

```txt
#[singleton]        → global instance
#[builder]          → generate builder
#[event]            → generate event system
#[persistent]       → auto serialize/deserialize to disk
#[versioned]        → struct version migration
#[observable]       → add subscriber pattern
#[table("users")]   → ORM mapping
```

### Category 3: Test Infrastructure

```txt
#[test_case(1, 2 => 3)]   → parameterized tests
#[bench]                   → benchmarking
#[given/when/then]         → BDD style tests
#[snapshot]                → snapshot testing
#[with_db]                 → setup/teardown DB
```

### Category 4: Web/Framework Integration

```txt
#[get("/users")]            → HTTP route (like actix-web)
#[middleware]               → request middleware
#[inject]                   → dependency injection
#[validate_request]         → auto request validation
#[openapi]                  → auto API doc generation
```

### Category 5: Async Transformation

```txt
#[tokio::main]              → async fn main
#[async_trait]              → async in trait
#[spawn_blocking]           → run in thread pool
#[instrument]               → tracing spans (tracing crate)
```

### The Key Pattern — Reconstructing the Original Item

```rust
#[proc_macro_attribute]
pub fn my_transform(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as ItemFn);
    
    // ↓ You can destructure everything
    let syn::ItemFn {
        attrs,      // existing #[...] attributes
        vis,        // pub / pub(crate) / private
        sig,        // entire function signature
        block,      // the body { ... }
    } = input;
    
    let syn::Signature {
        ident,       // function name
        inputs,      // arguments
        output,      // return type
        generics,
        asyncness,
        ..
    } = &sig;

    // Reconstruct with modifications
    quote! {
        // You can add MORE attributes above the original
        #[inline(always)]
        #( #attrs )*          // re-emit original attributes
        #vis #sig {           // re-emit original signature
            // ... wrap the original body:
            let __result = { #block };
            // ... do something after
            __result
        }
    }.into()
}
```

---

## Part 6: Bugs, Pitfalls, and Exceptions to Avoid

### 🔴 Critical Bugs

**1. Hygiene violations — identifier collisions**

```rust
// BAD: if user's code also has a variable named `result`, chaos ensues
quote! {
    let result = compute();  // ← collides with user's `result`
    result
}

// GOOD: use double-underscore prefix to avoid collisions
quote! {
    let __proc_macro_result = compute();
    __proc_macro_result
}
```

**2. Forgetting to re-emit the original item in attribute macros**

```rust
// BAD: the original struct disappears!
#[proc_macro_attribute]
pub fn my_attr(_attr: TokenStream, item: TokenStream) -> TokenStream {
    let input = parse_macro_input!(item as ItemStruct);
    quote! {
        impl MyTrait for MyStruct {}  // original struct is gone!
    }.into()
}

// GOOD: always re-emit
quote! {
    #input  // ← the original struct
    impl MyTrait for #name {}
}
```

**3. Panicking instead of emitting a compile error**

```rust
// BAD: panic gives a terrible error message
panic!("only structs supported");

// GOOD: emit a proper compiler error pointing to the right span
use syn::Error;
use quote::quote;

fn my_derive(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    
    match &ast.data {
        Data::Struct(_) => { /* ok */ }
        _ => {
            // This shows the error AT THE RIGHT LOCATION in user's code
            return Error::new_spanned(&ast.ident, "Only structs are supported")
                .to_compile_error()
                .into();
        }
    }
    todo!()
}
```

**4. Not handling generics in derive macros**

```rust
// BAD: breaks for MyStruct<T>
quote! {
    impl MyTrait for #name { }
}

// GOOD: always use split_for_impl()
let (impl_generics, ty_generics, where_clause) = ast.generics.split_for_impl();
quote! {
    impl #impl_generics MyTrait for #name #ty_generics #where_clause { }
}
```

**5. Using `unwrap()` in macro code**

```rust
// BAD: will give a cryptic panic at compile time
let n = val.base10_parse::<usize>().unwrap();

// GOOD: convert to compile error
let n = match val.base10_parse::<usize>() {
    Ok(n) => n,
    Err(e) => return e.to_compile_error().into(),
};
```

---

### 🟡 Logic Pitfalls

**6. Wrong span usage creates bad error locations**

```rust
use proc_macro2::Span;

// BAD: errors point to macro definition, not user's code
Ident::new("foo", Span::call_site());  // points to the macro call

// For new identifiers derived from user's code, propagate the span:
let user_ident = &field.ident.as_ref().unwrap();
let getter = format_ident!("get_{}", user_ident); // inherits user's span ✓
```

**7. Double-processing attributes**

```rust
// If you declare: #[proc_macro_derive(Foo, attributes(foo))]
// You must manually handle #[foo(...)] attrs on fields
// If you DON'T declare attributes(...), rustc will reject unknown attrs
```

**8. Recursive macro expansion loops**

```rust
// BAD: attribute macro emits code that triggers itself
#[proc_macro_attribute]
pub fn my_attr(_: TokenStream, item: TokenStream) -> TokenStream {
    quote! {
        #[my_attr]  // ← infinite recursion at compile time!
        #item
    }.into()
}
```

**9. Assuming field order is stable**

```rust
// HashMap iteration is unordered — if you collect field metadata
// into a HashMap, your generated code may differ between compilations
// ALWAYS use Vec or iterate fields directly from syn's ordered list
```

**10. Forgetting `#[allow(unused)]` in generated code**

```rust
// Generated code may trigger warnings in user's codebase
quote! {
    #[allow(dead_code, unused_variables)]
    fn __generated_helper() { }
}
```

---

### 🟠 Performance & Design Pitfalls

**11. Huge compile times from complex macros**

- Every proc macro runs at compile time
- Avoid parsing large external files at macro expansion time
- Cache expensive operations using `build.rs` instead if possible

**12. Poor error messages**

```rust
// Use Error::new_spanned for field-level errors
for field in &fields {
    if some_condition_fails {
        return syn::Error::new_spanned(
            field,                          // ← points to the FIELD
            "this field type is not allowed"
        ).to_compile_error().into();
    }
}
```

**13. Not testing your macros**

```rust
// In your proc-macro crate, use proc_macro2 internally
// so you can write unit tests:

#[cfg(test)]
mod tests {
    use super::*;
    use proc_macro2::TokenStream;
    use quote::quote;

    #[test]
    fn test_my_derive() {
        let input: TokenStream = quote! {
            struct Foo {
                x: i32,
                y: String,
            }
        };
        let output = impl_my_trait(input); // your internal function
        // Inspect or just check it compiles
        println!("{}", output);
    }
}
```

**14. Use `cargo-expand` constantly during development**

```bash
cargo install cargo-expand
cargo expand          # see ALL macro expansions
cargo expand --test   # expand test code
```

---

### Quick Reference: Error Reporting Patterns

```rust
// Error at the macro call site
proc_macro_error::abort_call_site!("something went wrong");

// Error pointing to a specific token
syn::Error::new_spanned(token, "message").to_compile_error().into()

// Error from ParseStream (inside Parse impl)
return Err(input.error("expected identifier here"));

// Multiple errors at once (don't stop at first)
use proc_macro_error::{emit_error, proc_macro_error};
#[proc_macro_error]
#[proc_macro_derive(MyDerive)]
pub fn my_derive(input: TokenStream) -> TokenStream {
    // ...
    emit_error!(field.span(), "bad field");  // non-fatal, continues
    emit_error!(other.span(), "also bad");   // collects all errors
    // ...
}
```

---

## Summary Cheat Sheet

```txt
syn::parse_macro_input!  → TokenStream → AST
syn::DeriveInput         → struct/enum inspection
syn::ItemFn              → function inspection
syn::Error::new_spanned  → good compiler errors
quote::quote!            → AST → TokenStream
quote::format_ident!     → create new identifiers
generics.split_for_impl()→ handle <T> correctly
#input / #ast            → re-emit original code
__double_underscore      → avoid hygiene issues
cargo expand             → debug what you generated
proc_macro2              → use internally for testability
```

The real mastery comes from reading the source of `serde_derive`, `thiserror`, and `tokio-macros` — they represent the gold standard of every pattern described here.