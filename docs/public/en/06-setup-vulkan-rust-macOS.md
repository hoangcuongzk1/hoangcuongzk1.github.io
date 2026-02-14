---
title: Setting Up Vulkan on macOS
creation date: 2026-01-14T01:26:00
last edited: 2026-02-15
slug: post-06
series: vulkan
excerpt: Essential setup guide for macOS when working with Rust and Vulkan.
lang: en
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd4hxsajtTMpwD_kEhUspdjSJIWLGtE22c5g&s
tags:
  - 🦀rust
  - vulkan
---
## Introduction

This article presents a streamlined, high-level adaptation of the [Vulkan Tutorial](https://docs.vulkan.org/tutorial/latest/02_Development_environment.html), concentrating on the critical steps required for establishing Vulkan on `macOS`.

Beyond the procedures outlined in the [Vulkan Tutorial](https://docs.vulkan.org/tutorial/latest/02_Development_environment.html), I've incorporated several `custom setup steps` to enhance workflow efficiency when developing Rust-based projects.


## Installation Steps
---
### Installing XCode

Skip this if you've already completed [this step](#/dynamic/post-05).

XCode is essential for building projects that utilize `C` APIs.

### Installing Vulkan SDK

 
**Step 1**: [Download Vulkan SDK](https://vulkan.lunarg.com/sdk/home)
 
Note regarding `Installation Folder` selection: you must remember the path for subsequent steps. It's typically advisable to use the default path `$HOME/` - `/User/your_name/VulkanSDK/x.x.x`.

**Step 2 (optional):** 
- [Install Homebrew](https://brew.sh/)
- Subsequently, install `GLFW` and `glm`
```bash
brew install glfw
brew install glm
```

These are two libraries for window initialization and fundamental mathematics.

If your Vulkan project is in `C++` or `C`, proceed with this step; otherwise, you may skip it.

Since I'm working with Rust, I'll be skipping this step.

### Configuring Environment Variables
```callout

[!IMPORTANT] Critical

This step is absolutely critical. Vulkan is not natively supported on macOS. Apple has discontinued Vulkan support and exclusively supports their proprietary Metal API.

To run Vulkan on macOS, you must utilize `MoltenVK` - a translation layer that converts Vulkan to Metal.

Throughout my work with Vulkan, the primary library I employ is [ash](https://github.com/ash-rs/ash), so this configuration ensures ash retrieves the correct API when interfacing with Vulkan.
```

Add to `~/.zshrc` or `~/.bash_profile`:
```bash
export VULKAN_SDK="$HOME/VulkanSDK/x.x.x/macOS"  # Replace x.x.x with your installed version
export PATH="$VULKAN_SDK/bin:$PATH"
export DYLD_LIBRARY_PATH="$VULKAN_SDK/lib:$DYLD_LIBRARY_PATH"
export VK_ICD_FILENAMES="$VULKAN_SDK/share/vulkan/icd.d/MoltenVK_icd.json"
export VK_LAYER_PATH="$VULKAN_SDK/share/vulkan/explicit_layer.d"
```

Then execute:
```bash
source ~/.zshrc
```


And that's it! ✅✅✅

---
## Conclusion

This article has considerably streamlined the installation information. For comprehensive details, [here's the original source](https://docs.vulkan.org/tutorial/latest/00_Introduction.html).