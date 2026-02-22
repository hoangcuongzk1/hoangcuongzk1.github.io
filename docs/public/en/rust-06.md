---
title: "macro_rules! vs Custom #[derive]"
creation date: 2026-02-19T18:00:00
last edited: 2026-02-19T18:00:00
slug: rust-06
series: rust
excerpt:
lang: en
cover img: link to cover img
tags:
  - 🦀rust
---


# `macro_rules!` vs Custom `#[derive]`

**Use `macro_rules!` when:**

- You need a simple, pattern-based code generation that works on expressions or statements
- You want something quick to implement (much easier to write)
- You're repeating boilerplate across different types/patterns that don't share a common trait
- You need flexible syntax that doesn't fit the `derive` model

**Use custom `#[derive]` when:**

- You're implementing a specific **trait** for many structs/enums
- You want users to write `#[derive(YourTrait)]` — it's ergonomic and idiomatic
- You need to **inspect the struct's fields or variants** at compile time
- You're building a library where others will use your derive macro

---

# Key differences at a glance

| Key                        | `macro_rules!`   | Custom `#[derive]`                 |
| -------------------------- | ---------------- | ---------------------------------- |
| **Complexity to write**    | Easy             | Hard (requires `proc-macro` crate) |
| **Input**                  | Token patterns   | Struct/Enum definition             |
| **Output**                 | Anything         | Impls added _alongside_ the type   |
| **Use site**               | `my_macro!(...)` | `#[derive(MyTrait)]`               |
| **Inspects fields?**       | No (not easily)  | Yes                                |
| **Separate crate needed?** | No               | Yes (`proc-macro = true`)          |

---

# Rule of thumb

> If you're generating a **trait implementation** based on a struct's shape → use `#[derive]`.  
> If you're generating **arbitrary code** from a pattern → use `macro_rules!`.

For example, `serde`'s `Serialize`/`Deserialize` uses `#[derive]` because it needs to know field names and types. But a macro that generates repetitive match arms or test cases is a natural fit for `macro_rules!`.
