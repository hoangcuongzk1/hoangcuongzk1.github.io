---
title: Cài đặt Vulkan trên macOS
creation date: 2026-01-14T01:26:00
slug: post-06
series: rust
excerpt: Cài đặt cơ bản dành cho macOS khi làm việc với Rust và Vulkan.
lang: vn
cover img: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd4hxsajtTMpwD_kEhUspdjSJIWLGtE22c5g&s
tags:
  - 🦀rust
  - vulkan
---
## Mở bài

Bài viết này là một phiên bản khái quát - sơ lược của [Vulkan Tutorial](https://docs.vulkan.org/tutorial/latest/02_Development_environment.html), tập trung vào các bước quan trọng trong quá trình setup Vulkan trên `macOS`.

Ngoài các bước có trong [Vulkan Tutorial](https://docs.vulkan.org/tutorial/latest/02_Development_environment.html), tôi có bổ sung thêm một số `custom setup steps` để tiện lợi hơn trong quá trình làm việc với các project viết bằng Rust.


## Các bước cài đặt
---
### Cài đặt XCode

Không cần thực hiện nếu đã làm [bước này](#/dynamic/post-05).

XCode cần thiết cho việc build các project sử dụng `C` apis.

### Cài đặt Vulkan SDK

 
 **Bước 1**: [Tải Vulkan SDK](https://vulkan.lunarg.com/sdk/home)
 
Lưu ý khi chọn `Installation Folder`: phải nhớ path để dùng cho bước tiếp theo. Thông thường nên để ở path mặc định `$HOME/` - `/User/your_name/VulkanSDK/x.x.x`.

**Bước 2(optional):** 
- [Cài đặt Hombrew](https://brew.sh/)
- Sau đó cài đặt `GLFW` và `glm`
```bash
brew install glfw
brew install glm
```

Đây là 2 thư viện khởi tạo window và toán học cơ bản.

Nếu project Vulkan của bạn là `C++` hoặc `C` thì xài bước này, còn không thì thôi, có thể bỏ qua.

Tôi sử dụng Rust nên tôi sẽ skip bước này.

### Thiết lập các biến môi trường

```callout

[!IMPORTANT] Quan trọng

Bước này rất quan trọng, Vulkan không được hỗ trợ trực tiếp trên macOS. Apple đã loại bỏ hỗ trợ Vulkan và chỉ hỗ trợ Metal API của họ.

Để chạy Vulkan trên macOS, bạn cần sử dụng `MoltenVK` - một layer chuyển đổi Vulkan sang Metal.

Trong quá trình làm việc với Vulkan thư viện chính tôi dùng là [ash](https://github.com/ash-rs/ash), nên việc này sẽ giúp ash lấy đúng API khi làm việc với Vulkan.
```

Thêm vào `~/.zshrc` hoặc `~/.bash_profile`:

```bash
export VULKAN_SDK="$HOME/VulkanSDK/x.x.x/macOS"  # Thay x.x.x bằng version đã cài đặt
export PATH="$VULKAN_SDK/bin:$PATH"
export DYLD_LIBRARY_PATH="$VULKAN_SDK/lib:$DYLD_LIBRARY_PATH"
export VK_ICD_FILENAMES="$VULKAN_SDK/share/vulkan/icd.d/MoltenVK_icd.json"
export VK_LAYER_PATH="$VULKAN_SDK/share/vulkan/explicit_layer.d"
```

Sau đó chạy:

```bash
source ~/.zshrc
```


Và thế là xong ! ✅✅✅

---
## Kết bài

Bài viết đã giản lược tương đối nhiều các thông tin về việc cài đặt. Để xem đầy đủ [Đây là link gốc](https://docs.vulkan.org/tutorial/latest/00_Introduction.html).

