---
title: Send & Sync
creation date: 2026-02-18T23:00:00
last edited: 2026-02-18T23:00:00
slug: rust-04
series: rust
excerpt:
lang: en
cover img: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FyJ7YYQKv8uE%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=afdaa654e91a8dc017a4c3dc8e26e80123447af77ebb059fc8ed733fe31d5790
tags:
  - 🦀rust
---

# Summary
---
- A type is **Send** if it can be safely moved from one thread to another.
- A type is **Sync** if it can be referenced `(&T)` safely shared among multiple threads at the same time.

# Data types support Send & Sync
---

| Data Type                                             | Send | Sync | Notes                                                           |
| ----------------------------------------------------- | ---- | ---- | --------------------------------------------------------------- |
| Primitive types (`i32`, `u32`, `f64`, etc.), `String` | ✅    | ✅    | Always safe to move & share                                     |
| `&T`                                                  | ✅*   | ✅*   | `Send/Sync` if `T: Sync`                                        |
| `&mut T`                                              | ✅*   | ❌    | `Send` if `T: Send`, never `Sync` (exclusive access)            |
| Raw pointers (`*const T`, `*mut T`)                   | ❌    | ❌    | Compiler opts out conservatively — use `unsafe impl` manually   |
| `Box<T>`                                              | ✅*   | ✅*   | `Send/Sync` if `T: Send/Sync`                                   |
| `Vec<T>`, `Option<T>`, `Result<T, E>`                 | ✅*   | ✅*   | `Send/Sync` if `T` (and `E`): `Send/Sync`                       |
| `Rc<T>`                                               | ❌    | ❌    | Non-atomic ref count — never safe across threads                |
| `Arc<T>`                                              | ✅*   | ✅*   | `Send/Sync` if `T: Send + Sync`                                 |
| `Cell<T>`, `RefCell<T>`                               | ✅*   | ❌    | `Send` if `T: Send`, never `Sync` (no sync interior mutability) |
| `Mutex<T>`, `RwLock<T>`                               | ✅*   | ✅*   | `Send/Sync` if `T: Send`                                        |
| Vulkan handles (`vk::Buffer`, etc.)                   | ❌    | ❌    | Contain raw pointers — require `unsafe impl`                    |
|                                                       |      |      |                                                                 |

_* Depends on `T`_