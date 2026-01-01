---
title: So sánh các thư viện Vulkan phổ biến của Rust
creation date: 2026-01-02T05:30:00
slug: post-05
series: rust
excerpt: So sánh các thư viện Vulkan phổ biến của Rust, cách lựa chọn thư viện phù hợp.
lang: vn
cover img: https://www.collabora.com/assets/images/blog/Rust-Vukan_CC.jpg
tags:
  - 🦀rust
  - vulkan
---
## Mở bài

Bài viết này sẽ phân tích chi tiết các thư viện Vulkan phổ biến trong hệ sinh thái Rust, dựa trên kinh nghiệm thực tế của tôi trong việc xây dựng game engine và rendering pipeline.

---
## Tại sao lại là Vulkan?

Trước khi đi sâu vào các thư viện Rust, hãy điểm qua lý do tại sao Vulkan lại là lựa chọn đáng cân nhắc:

**Vulkan vs OpenGL:** Vulkan cho phép kiểm soát chi tiết hơn nhiều về GPU, giảm thiểu driver overhead và tăng hiệu suất đáng kể, đặc biệt trong các scene phức tạp với nhiều draw call. Trong khi OpenGL trừu tượng hóa nhiều chi tiết, Vulkan đặt quyền kiểm soát vào tay developer - điều này đồng nghĩa với hiệu suất cao hơn nhưng cũng phức tạp hơn.

**Vulkan vs DirectX 12:** Cả hai đều là modern low-level API với triết lý thiết kế tương đồng. Vulkan có lợi thế về tính đa nền tảng (Windows, Linux, Android, macOS thông qua MoltenVK), trong khi DirectX 12 chỉ chạy trên Windows và Xbox. Về hiệu suất, cả hai đều xuất sắc và khác biệt chủ yếu nằm ở ecosystem.

**Vulkan vs Metal:** Metal là API độc quyền của Apple với hiệu suất tuyệt vời trên các thiết bị Apple. Tuy nhiên, Vulkan qua MoltenVK vẫn chạy tốt trên macOS/iOS và mang lại lợi ích về code base thống nhất. Nếu bạn chỉ target Apple ecosystem, Metal là lựa chọn tốt hơn. Nếu cần đa nền tảng, Vulkan là con đường đúng đắn.

Với Rust, sự kết hợp giữa memory safety và performance của ngôn ngữ phù hợp hoàn hảo với Vulkan - một API đòi hỏi quản lý tài nguyên chặt chẽ.

---
## Các thư viện Vulkan chính trong Rust

### 1. **Ash** - The Vulkan Bindings Foundation

**Repository:** [GitHub - ash-rs/ash: Vulkan bindings for Rust](https://github.com/ash-rs/ash)

**Triết lý:** Ash là low-level bindings trực tiếp tới Vulkan C API, giữ nguyên cấu trúc và naming convention của Vulkan specification.

**Ưu điểm:**

- **Thin wrapper:** Gần như là 1:1 mapping với Vulkan C API, cho phép bạn translate bất kỳ Vulkan tutorial/example C++ nào sang Rust một cách trực tiếp
- **Zero overhead:** Không có abstraction layer nào, hiệu suất tương đương code C/C++
- **Cập nhật nhanh:** Thường được update ngay khi Vulkan có extension mới
- **Kiểm soát tuyệt đối:** Bạn có toàn quyền quyết định mọi aspect của rendering pipeline
- **Phù hợp cho engine development:** Nếu bạn đang xây dựng game engine hoặc rendering framework từ đầu, Ash cho bạn foundation vững chắc

**Nhược điểm:**

- **Boilerplate code nhiều:** Bạn phải tự handle hầu hết mọi thứ - synchronization, resource management, lifetime tracking
- **Learning curve dốc:** Cần hiểu sâu về Vulkan specification và graphics programming
- **Dễ mắc lỗi:** Với quyền tự do đến trách nhiệm - một sai sót nhỏ có thể gây crash hoặc undefined behavior
- **Thiếu convenience features:** Không có helper cho các tác vụ phổ biến như texture loading, shader compilation

**Kinh nghiệm thực tế:** Tôi đã sử dụng Ash để xây dựng custom rendering backend cho một game project. Code rất verbose nhưng khi đã quen, bạn có thể tối ưu từng byte của GPU memory và từng clock cycle. Rất phù hợp khi bạn cần squeeze performance tối đa.

**Code example:**

```rust
// Creating a Vulkan instance in Ash - very explicit
let app_info = vk::ApplicationInfo::builder()
    .application_name(CStr::from_bytes_with_nul_unchecked(b"MyApp\0"))
    .application_version(vk::make_api_version(0, 1, 0, 0))
    .engine_name(CStr::from_bytes_with_nul_unchecked(b"MyEngine\0"))
    .engine_version(vk::make_api_version(0, 1, 0, 0))
    .api_version(vk::API_VERSION_1_3);

let instance = unsafe {
    entry.create_instance(&create_info, None)?
};
```

### 2. **Vulkano** - Safe Rust-First Abstraction

**Repository:** [GitHub - vulkano-rs/vulkano: Safe and rich Rust wrapper around the Vulkan API](https://github.com/vulkano-rs/vulkano)

**Triết lý:** Vulkano mang triết lý "Rusty" vào Vulkan, sử dụng type system và ownership của Rust để enforce safety và correctness tại compile time.

**Ưu điểm:**

- **Type-safe:** Sử dụng Rust type system để ngăn chặn nhiều loại lỗi Vulkan phổ biến (invalid state, resource lifetime issues)
- **Ergonomic API:** Code ngắn gọn và dễ đọc hơn nhiều so với Ash
- **Automatic resource management:** Tự động handle resource destruction và synchronization
- **Shader integration tốt:** Có macro để compile GLSL shader tại compile time với type checking
- **Documentation xuất sắc:** Có lẽ là thư viện Vulkan Rust với docs tốt nhất
- **Suitable cho prototyping:** Cho phép bạn iterate nhanh chóng

**Nhược điểm:**

- **Performance overhead:** Abstraction layer có thể gây overhead nhỏ so với raw Vulkan
- **Ít linh hoạt hơn:** Một số Vulkan features có thể chưa được expose hoặc khó access
- **Compile time chậm:** Type system phức tạp và shader compilation làm tăng thời gian compile đáng kể
- **Breaking changes:** API vẫn đang evolve, có thể có breaking changes giữa các version
- **Learning curve riêng:** Bạn cần học cả Vulkan và cách Vulkano abstract nó

**Kinh nghiệm thực tế:** Vulkano tuyệt vời cho các dự án cần balance giữa safety và performance. Tôi đã dùng nó cho một tool rendering và thấy development speed nhanh hơn nhiều. Tuy nhiên, khi cần optimize critical path, đôi khi phải fight với abstraction.

**Code example:**

```rust
// Vulkano - much more concise and safe
let instance = Instance::new(
    library.clone(),
    InstanceCreateInfo {
        application_name: Some("MyApp".to_owned()),
        application_version: Version::V1_0,
        ..Default::default()
    },
)?;
```

### 3. **Erupt** - Lightweight Alternative

**Repository:** [erupt - Rust](https://docs.rs/erupt/latest/erupt/)`

**Triết lý:** Tương tự Ash nhưng được generate tự động từ Vulkan specification, với một số convenience features.

**Ưu điểm:**

- **Luôn up-to-date:** Được generate từ vk.xml nên support extensions mới rất nhanh
- **Lighter than Ash:** Compile time nhanh hơn một chút
- **Function pointer loading flexibility:** Cho phép load function pointers theo nhu cầu

**Nhược điểm:**

- **Cộng đồng nhỏ hơn:** Ít người dùng và contributor hơn Ash
- **Documentation hạn chế:** Phải rely nhiều vào Vulkan spec
- **Ecosystem nhỏ:** Ít helper crates và examples

**Nhận xét:** Erupt là lựa chọn tốt nếu bạn thích Ash nhưng muốn faster compile times. Tuy nhiên, với cộng đồng nhỏ hơn, tôi thường recommend Ash cho production projects.

### 4. **Wgpu** - The Cross-API Solution

**Repository:** [GitHub - gfx-rs/wgpu: A cross-platform, safe, pure-Rust graphics API.](https://github.com/gfx-rs/wgpu)

**Triết lý:** Wgpu không chỉ là Vulkan wrapper mà là abstraction layer trên Vulkan, Metal, DirectX 12 và WebGPU. Được thiết kế theo WebGPU specification.

**Ưu điểm:**

- **True cross-platform:** Một code base chạy trên mọi platform với backend phù hợp
- **Modern API design:** API sạch đẹp, học nhanh, giống WebGPU
- **Production-ready:** Được sử dụng trong nhiều game và app thực tế (Firefox, Bevy engine)
- **Active development:** Team gfx-rs rất active và responsive
- **Safety guarantees:** Rust-native với strong safety guarantees
- **Excellent for indie devs:** Balance hoàn hảo giữa power và ease of use

**Nhược điểm:**

- **Abstraction overhead:** Do phải support multiple backends, có abstraction cost
- **Không access được Vulkan-specific features:** Chỉ có thể dùng features có trong WebGPU spec
- **Less control:** Không thể micro-optimize như với Ash
- **Indirect debugging:** Khi có bug, khó biết issue nằm ở application code hay backend implementation

**Kinh nghiệm thực tế:** Đây là lựa chọn của tôi cho hầu hết game projects hiện tại. Wgpu cho phép tôi ship game trên Windows, Linux, macOS và web mà không cần maintain nhiều rendering backends. Performance rất tốt cho 90% use cases. Chỉ khi cần optimize extreme edge cases thì mới cần drop xuống Vulkan native.

**Code example:**

```rust
// Wgpu - clean and portable
let instance = wgpu::Instance::new(wgpu::InstanceDescriptor {
    backends: wgpu::Backends::all(),
    ..Default::default()
});

let adapter = instance
    .request_adapter(&wgpu::RequestAdapterOptions::default())
    .await
    .unwrap();
```

### 5. **Basalt** - UI-Focused Vulkan

**Repository:** [GitHub - AustinJ235/basalt: A rust library that provides window creation, input handling, and most importantly a UI.](https://github.com/AustinJ235/basalt)

**Triết lý:** Basalt là layer trên Vulkan tập trung vào UI rendering và window management.

**Ưu điểm:**

- **UI-first design:** Built-in support cho text rendering, UI elements
- **Window management:** Tích hợp winit cho cross-platform windowing
- **Higher-level abstraction:** Không cần lo về nhiều chi tiết Vulkan

**Nhược điểm:**

- **Niche use case:** Chỉ phù hợp cho UI applications, không dành cho game hoặc general graphics
- **Limited flexibility:** Khó customize cho các use cases ngoài UI
- **Small community:** Ít người dùng và hỗ trợ

**Nhận xét:** Basalt là specialized tool. Nếu bạn đang build desktop UI app và muốn dùng Vulkan for rendering, đây là option. Cho game development thì không phù hợp.

## So sánh tổng quan

|Tiêu chí|Ash|Vulkano|Wgpu|Erupt|
|---|---|---|---|---|
|**Performance**|⭐⭐⭐⭐⭐|⭐⭐⭐⭐|⭐⭐⭐⭐|⭐⭐⭐⭐⭐|
|**Safety**|⭐⭐|⭐⭐⭐⭐⭐|⭐⭐⭐⭐⭐|⭐⭐|
|**Ease of Use**|⭐⭐|⭐⭐⭐⭐|⭐⭐⭐⭐⭐|⭐⭐|
|**Flexibility**|⭐⭐⭐⭐⭐|⭐⭐⭐|⭐⭐⭐|⭐⭐⭐⭐⭐|
|**Cross-platform**|⭐⭐⭐⭐|⭐⭐⭐⭐|⭐⭐⭐⭐⭐|⭐⭐⭐⭐|
|**Documentation**|⭐⭐⭐⭐|⭐⭐⭐⭐⭐|⭐⭐⭐⭐|⭐⭐⭐|
|**Community**|⭐⭐⭐⭐⭐|⭐⭐⭐⭐|⭐⭐⭐⭐⭐|⭐⭐|
|**Compile Time**|⭐⭐⭐⭐|⭐⭐|⭐⭐⭐|⭐⭐⭐⭐|

## Kinh nghiệm về Performance trong thực tế

Từ các benchmark và profiling tôi đã thực hiện:

**Ash vs Vulkano:** Trong các scene đơn giản, performance gần như tương đương. Sự khác biệt chỉ rõ ràng trong extreme cases với hàng nghìn objects và frequent state changes. Ash thường nhanh hơn 5-10% trong các trường hợp này do không có abstraction overhead.

**Wgpu overhead:** Wgpu backend Vulkan chỉ chậm hơn raw Vulkan khoảng 2-5% trong hầu hết workload. Trade-off này hoàn toàn đáng giá cho cross-platform capability.

**Memory management:** Vulkano automatic resource management rất tiện nhưng đôi khi giữ resources lâu hơn cần thiết. Với Ash, bạn có thể release resources ngay khi không cần nữa.

## Use Cases cụ thể

### Dùng **Ash** hoặc **Erupt** khi:

- Bạn đang xây dựng game engine hoặc rendering framework từ đầu
- Cần squeeze từng phần trăm performance
- Đã có kinh nghiệm với Vulkan C/C++ và muốn translate
- Dự án cần sử dụng Vulkan extensions đặc biệt
- Đang port existing Vulkan codebase sang Rust

### Dùng **Vulkano** khi:

- Đang học Vulkan và muốn feedback tốt hơn từ compiler
- Dự án personal hoặc prototype cần development speed cao
- Không cần optimize tới mức extreme
- Muốn leverage Rust type system để tránh bugs
- Team thiếu kinh nghiệm Vulkan chuyên sâu

### Dùng **Wgpu** khi:

- Đang phát triển game hoặc app cần chạy trên nhiều platform
- Muốn support cả WebAssembly
- Không cần Vulkan-specific features
- Đánh giá cao development velocity và code maintainability
- Đang dùng hoặc cân nhắc Bevy game engine
- Team có mix của graphics engineers và game programmers

### Dùng **Basalt** khi:

- Đang xây dựng desktop UI application
- Cần GPU-accelerated UI rendering
- Không phải game hoặc general graphics work

## Lựa chọn phù hợp

Danh sách các lựa chọn này dựa theo tham khảo từ cộng đồng Rust.
### Cho Game Development - **Wgpu**

Wgpu là lựa chọn tốt nhất cho phần lớn game projects. Cross-platform support tuyệt vời, API clean, performance đủ tốt, và được support bởi ecosystem mạnh (Bevy, fyrox). Trừ khi bạn đang làm AAA title cần optimize tới từng instruction, Wgpu đáp ứng mọi nhu cầu.

Ví dụ điển hình: Bevy engine sử dụng wgpu và đạt performance rất tốt. Hầu hết indie games không cần nhiều hơn thế.

### Cho Engine Development - **Ash** 

Nếu bạn đang xây dựng rendering engine từ đầu hoặc cần control tuyệt đối, Ash là con đường đi. Bạn sẽ viết nhiều code hơn nhưng có toàn quyền quyết định architecture và optimization strategy.

Cân nhắc Erupt nếu compile time là concern, nhưng Ash có community support tốt hơn.

### Cho Learning Vulkan - **Vulkano** 

Nếu mục tiêu là học Vulkan, Vulkano giúp bạn hiểu concepts mà không bị overwhelm bởi boilerplate. Compiler sẽ catch nhiều mistakes phổ biến. Sau khi nắm vững, có thể chuyển sang Ash nếu cần.

### Cho Production App - **Wgpu** hoặc **Vulkano** 

Phụ thuộc vào requirements:

- **Wgpu** nếu cần cross-platform (kể cả web)
- **Vulkano** nếu chỉ cần desktop và muốn type safety mạnh

## Xu hướng và tương lai

**Wgpu đang lên:** Với sự backing từ Mozilla và adoption trong Bevy, wgpu đang trở thành de-facto standard cho graphics trong Rust ecosystem. WebGPU standard cũng đang dần trưởng thành và bền bỉ hơn.

**Ash vẫn là foundation:** Cho các project cần direct Vulkan access, Ash vẫn là lựa chọn đáng tin cậy và sẽ tiếp tục được maintain.

**Vulkano đang refactor:** Vulkano đang trong process major refactor để improve compile times và API. Version tương lai hứa hẹn giải quyết nhiều pain points hiện tại.

## Kết luận

Không có thư viện nào "tốt nhất" cho mọi trường hợp. Lựa chọn phụ thuộc vào:

1. **Project scope:** Game, engine, tool, hay app?
2. **Platform targets:** Single platform hay cross-platform?
3. **Team experience:** Junior developers hay veteran graphics programmers?
4. **Performance requirements:** AAA game hay indie project?
5. **Development timeline:** Prototype nhanh hay long-term production?

**Quy tắc lựa chọn:**

```rust
if indie_game || cross_platform_needed {
    use wgpu;
} else if learning || prototype {
    use vulkano;
} else if aaa_game || custom_engine {
    use ash;
} else if compile_time_critical {
    consider erupt;
}
```

Rust với Vulkan là combination mạnh mẽ. Memory safety của Rust complement rất tốt với explicit resource management của Vulkan. Bất kể bạn chọn thư viện nào, bạn đều có foundation vững chắc để build high-performance graphics applications.

Hãy bắt đầu với thư viện match với skill level và requirements của bạn. Bạn luôn có thể migrate sau này nếu cần - concepts và kiến thức Vulkan là transferable.

Happy rendering! 🎮🦀
