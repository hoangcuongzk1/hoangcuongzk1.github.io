---
title: Using Result<T, E> in Rust
creation date: 2026-02-15T16:00:00
last edited: 2026-02-15T16:00:00
slug: rust-00
series: rust
excerpt:
lang: en
cover img: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets.st-note.com%2Fproduction%2Fuploads%2Fimages%2F177223162%2Frectangle_large_type_2_b4dc6d155a7b1bf54f9dbe8c3bd02d58.png%3Ffit%3Dbounds%26quality%3D85%26width%3D1280&f=1&nofb=1&ipt=a271a3b43da44010dbf6b9120ff2119c0bc153cbfc4c13e3cfc7fafc7adeb992
tags:
  - 🦀rust
---

# Using Result<T, E> in Rust
---

Result is Rust's primary type for handling recoverable errors. It's an enum with two variants:

```rust
enum Result<T, E> {
    Ok(T),   // Success case containing value of type T
    Err(E),  // Error case containing error of type E
}
```

## Basic Usage
---

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }
}
```

## Error Handling Patterns
---
**Pattern Matching**

```rust
let result = divide(10.0, 0.0);
match result {
    Ok(val) => println!("Success: {}", val),
    Err(e) => eprintln!("Failed: {}", e),
}
```

**unwrap() - Panics on Error**

```rust
let value = divide(10.0, 2.0).unwrap(); // Use only when you're certain it won't fail
```

**expect() - Panics with Custom Message**

```rust
let value = divide(10.0, 2.0).expect("Division failed");
```

**unwrap_or() - Provide Default Value**

```rust
let value = divide(10.0, 0.0).unwrap_or(0.0);
```

**unwrap_or_else() - Compute Default Value**

```rust
let value = divide(10.0, 0.0).unwrap_or_else(|e| {
    eprintln!("Error occurred: {}", e);
    0.0
});
```

## The `?` Operator (Error Propagation)

The `?` operator propagates errors up the call stack:

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file_contents(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;  // Returns early if error
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;  // Returns early if error
    Ok(contents)
}
```

Without `?` operator, you'd need:

```rust
fn read_file_contents(path: &str) -> Result<String, io::Error> {
    let mut file = match File::open(path) {
        Ok(f) => f,
        Err(e) => return Err(e),
    };
    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(e) => Err(e),
    }
}
```

## Custom Error Types
---

```rust
use std::fmt;

#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MathError::DivisionByZero => write!(f, "Cannot divide by zero"),
            MathError::NegativeSquareRoot => write!(f, "Cannot take square root of negative"),
        }
    }
}

impl std::error::Error for MathError {}

fn safe_divide(a: f64, b: f64) -> Result<f64, MathError> {
    if b == 0.0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(a / b)
    }
}
```

## Combining Results
---
**map() - Transform Success Value**

```rust
let result = divide(10.0, 2.0)
    .map(|x| x * 2.0);  // Result<f64, String>
```

**map_err() - Transform Error Value**

```rust
let result = divide(10.0, 0.0)
    .map_err(|e| format!("Math error: {}", e));
```

**and_then() - Chain Operations**

```rust
fn sqrt(x: f64) -> Result<f64, String> {
    if x < 0.0 {
        Err(String::from("Negative number"))
    } else {
        Ok(x.sqrt())
    }
}

let result = divide(16.0, 4.0)
    .and_then(|x| sqrt(x));  // 16/4 = 4, sqrt(4) = 2
```

## Collecting Results
---

```rust
fn parse_numbers(strings: Vec<&str>) -> Result<Vec<i32>, std::num::ParseIntError> {
    strings.iter()
        .map(|s| s.parse::<i32>())
        .collect()  // Stops at first error
}

let nums = parse_numbers(vec!["1", "2", "3"]);  // Ok(vec![1, 2, 3])
let error = parse_numbers(vec!["1", "bad", "3"]);  // Err(...)
```

## Real-World Use Cases
---

**File I/O**

```rust
use std::fs;
use std::io;

fn backup_file(src: &str, dest: &str) -> Result<(), io::Error> {
    let contents = fs::read_to_string(src)?;
    fs::write(dest, contents)?;
    Ok(())
}
```

**HTTP Requests** (with external crate)

```rust
// Using reqwest crate
async fn fetch_user(id: u64) -> Result<User, reqwest::Error> {
    let url = format!("https://api.example.com/users/{}", id);
    let user = reqwest::get(&url)
        .await?
        .json::<User>()
        .await?;
    Ok(user)
}
```

**Database Operations**

```rust
fn get_user_by_id(id: i32) -> Result<User, DatabaseError> {
    let conn = establish_connection()?;
    let user = conn.query_row(
        "SELECT * FROM users WHERE id = ?",
        &[&id],
        |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        }
    )?;
    Ok(user)
}
```

**Configuration Parsing**

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct Config {
    host: String,
    port: u16,
}

fn load_config(path: &str) -> Result<Config, Box<dyn std::error::Error>> {
    let contents = std::fs::read_to_string(path)?;
    let config: Config = toml::from_str(&contents)?;
    Ok(config)
}
```

## Using `Box<dyn Error>` for Multiple Error Types
---

```rust
use std::error::Error;
use std::fs;
use std::io;

fn process_file(path: &str) -> Result<i32, Box<dyn Error>> {
    let contents = fs::read_to_string(path)?;  // io::Error
    let number: i32 = contents.trim().parse()?;  // ParseIntError
    Ok(number * 2)
}
```

## Advanced: Custom Result Type Alias
---

```rust
type MyResult<T> = Result<T, MyError>;

fn operation() -> MyResult<String> {
    // ...
    Ok(String::from("success"))
}
```

## Best Practices
---

1. Use `Result` for recoverable errors, `panic!` for unrecoverable ones
2. Prefer `?` operator over manual matching for cleaner code
3. Use descriptive error types rather than just `String`
4. Don't overuse `unwrap()` - use it only when failure is truly impossible
5. Use `expect()` with meaningful messages when you need to unwrap
6. Consider using the `anyhow` or `thiserror` crates for better error handling in applications

The Result type forces you to handle errors explicitly, making Rust programs more robust and reliable.


# Logging Errors in Result - Optimal Patterns
---

Here are the best ways to log errors when handling `Result` types:

## 1. Using `inspect_err()` (Rust 1.76+) - Most Idiomatic

```rust
use log::{error, warn};

fn process_file(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
        .inspect_err(|e| error!("Invalid path {}: {}", path, e))
}

// Or with ?
fn load_config(path: &str) -> Result<Config, Box<dyn std::error::Error>> {
    let contents = std::fs::read_to_string(path)
        .inspect_err(|e| error!("Failed to read config at {}: {}", path, e))?;
    
    let config: Config = toml::from_str(&contents)
        .inspect_err(|e| error!("Failed to parse config: {}", e))?;
    
    Ok(config)
}
```

**Why it's optimal:**

- Doesn't change the `Result` type
- Chainable with `?` operator
- Only runs on error (no performance cost on success)
- Clean and readable

## 2. Using `map_err()` - For Transforming Errors

```rust
fn process_file(path: &str) -> Result<String, String> {
    std::fs::read_to_string(path)
        .map_err(|e| {
            let msg = format!("Invalid path {}: {}", path, e);
            error!("{}", msg);
            msg  // Return the formatted error
        })
}

// Or keep original error type
fn load_data(path: &str) -> Result<Data, std::io::Error> {
    std::fs::read_to_string(path)
        .map_err(|e| {
            error!("Failed to read {}: {}", path, e);
            e  // Return original error
        })?;
    // ...
}
```

## 3. Helper Function Pattern - Reusable

```rust
use log::error;

// Generic helper
fn log_err<T, E: std::fmt::Display>(
    result: Result<T, E>,
    context: &str,
) -> Result<T, E> {
    result.inspect_err(|e| error!("{}: {}", context, e))
}

// Usage
fn process_file(path: &str) -> Result<String, std::io::Error> {
    log_err(
        std::fs::read_to_string(path),
        &format!("Invalid path {}", path)
    )
}

// Or as extension trait
trait LogError<T, E> {
    fn log_error(self, context: &str) -> Result<T, E>;
}

impl<T, E: std::fmt::Display> LogError<T, E> for Result<T, E> {
    fn log_error(self, context: &str) -> Result<T, E> {
        self.inspect_err(|e| error!("{}: {}", context, e))
    }
}

// Usage
fn load_file(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
        .log_error(&format!("Failed to read {}", path))
}
```

## 4. Using `anyhow` with `context()` - Best for Applications

```rust
use anyhow::{Context, Result};
use log::error;

fn load_config(path: &str) -> Result<Config> {
    let contents = std::fs::read_to_string(path)
        .with_context(|| format!("Failed to read config at {}", path))
        .inspect_err(|e| error!("{:?}", e))?;  // Log the full error chain
    
    let config: Config = toml::from_str(&contents)
        .with_context(|| "Failed to parse config file")
        .inspect_err(|e| error!("{:?}", e))?;
    
    Ok(config)
}

// Or log at the call site
fn main() {
    if let Err(e) = load_config("config.toml") {
        error!("Configuration error: {:?}", e);  // Prints full error chain
        std::process::exit(1);
    }
}
```

## 5. Complete Example with Different Logging Levels

```rust
use log::{debug, info, warn, error};

fn process_user_data(user_id: u64) -> Result<UserData, AppError> {
    debug!("Processing data for user {}", user_id);
    
    let user = fetch_user(user_id)
        .inspect_err(|e| error!("Failed to fetch user {}: {}", user_id, e))?;
    
    let settings = load_settings(&user.id)
        .inspect_err(|e| warn!("Using default settings for user {}: {}", user_id, e))
        .unwrap_or_default();  // Continue with defaults
    
    let data = compute_data(&user, &settings)
        .inspect_err(|e| error!("Computation failed for user {}: {}", user_id, e))?;
    
    info!("Successfully processed data for user {}", user_id);
    Ok(data)
}
```

## 6. Macro Approach - For Repetitive Code

```rust
macro_rules! log_and_propagate {
    ($result:expr, $msg:expr) => {
        $result.inspect_err(|e| error!("{}: {}", $msg, e))?
    };
}

fn process_pipeline(path: &str) -> Result<Output, Box<dyn std::error::Error>> {
    let data = log_and_propagate!(
        std::fs::read_to_string(path),
        format!("Failed to read file {}", path)
    );
    
    let parsed = log_and_propagate!(
        parse_data(&data),
        "Failed to parse data"
    );
    
    Ok(transform(parsed))
}
```

## 7. Logging with Different Strategies

```rust
use log::{error, warn};

// Strategy 1: Log and return error
fn strict_load(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
        .inspect_err(|e| error!("Invalid path {}: {}", path, e))
}

// Strategy 2: Log warning and provide fallback
fn lenient_load(path: &str) -> String {
    std::fs::read_to_string(path)
        .inspect_err(|e| warn!("Could not read {}, using default: {}", path, e))
        .unwrap_or_else(|_| String::from("default content"))
}

// Strategy 3: Log and convert to custom error
fn load_with_context(path: &str) -> Result<String, AppError> {
    std::fs::read_to_string(path)
        .map_err(|e| {
            error!("Failed to read {}: {}", path, e);
            AppError::FileNotFound { path: path.to_string(), source: e }
        })
}
```

## 8. Advanced: Contextual Error Extension Trait

```rust
use log::error;

trait ResultExt<T, E> {
    fn log_err_with(self, f: impl FnOnce(&E) -> String) -> Self;
}

impl<T, E> ResultExt<T, E> for Result<T, E> {
    fn log_err_with(self, f: impl FnOnce(&E) -> String) -> Self {
        self.inspect_err(|e| error!("{}", f(e)))
    }
}

// Usage
fn load_file(path: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(path)
        .log_err_with(|e| format!("Invalid path {}: {} (kind: {:?})", path, e, e.kind()))
}
```

## 9. Real-World Pattern with tracing

```rust
use tracing::{error, instrument, warn};

#[instrument(skip(path), fields(path = %path))]
fn load_config(path: &str) -> Result<Config, ConfigError> {
    let contents = std::fs::read_to_string(path)
        .inspect_err(|e| error!(error = %e, "Failed to read config file"))?;
    
    toml::from_str(&contents)
        .inspect_err(|e| error!(error = %e, "Failed to parse TOML"))
        .map_err(ConfigError::from)
}
```

## Recommendation

**For most cases, use `inspect_err()`:**

```rust
fn your_function(path: &str) -> Result<Data, Error> {
    load_data(path)
        .inspect_err(|e| error!("Invalid path {}: {}", path, e))?;
    // continues...
}
```

**For applications with complex error handling, use `anyhow` + `context()`:**

```rust
use anyhow::{Context, Result};

fn your_function(path: &str) -> Result<Data> {
    load_data(path)
        .with_context(|| format!("Invalid path {}", path))?;
    // Error context is automatically available when logging
}
```

Both patterns are idiomatic, performant, and maintain clean code flow with the `?` operator.