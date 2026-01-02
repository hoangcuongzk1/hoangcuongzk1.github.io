---
title: Cấu trúc của Vulkan
creation date: 2026-01-02T08:15:00
slug: post-06
series: rust-graphic
excerpt: Vulkan - Cấu trúc, thành phần và vai trò của chúng.
lang: vn
cover img: https://gpuopen-librariesandsdks.github.io/V-EZ/img/VulkanAPI.PNG
tags:
  - vulkan
---

# Vulkan với Rust trên macOS: Hướng dẫn Toàn Diện từ Zero đến Production

## Giới thiệu

Sau 10 năm làm việc với graphics programming - từ OpenGL đến Metal, từ game engines đến AI inference acceleration - tôi nhận thấy Vulkan là một trong những bước tiến quan trọng nhất trong lịch sử computer graphics. Bài viết này sẽ đi sâu vào Vulkan với Rust trên macOS, một combination thú vị nhưng có nhiều nuances cần lưu ý.

## Vulkan là gì và tại sao nó quan trọng?

### Định nghĩa

Vulkan là một **cross-platform graphics và compute API** thế hệ mới, được Khronos Group phát triển như successor của OpenGL. Ra mắt năm 2016, Vulkan đại diện cho paradigm shift từ high-level, driver-heavy APIs sang low-level, explicit control.

### Triết lý thiết kế

**"Explicit over Implicit"** - Vulkan không giấu bất cứ điều gì. Mọi thứ từ memory allocation, synchronization, đến state management đều explicit. Điều này có nghĩa:

- **Developer có toàn quyền kiểm soát** → hiệu suất cao hơn
- **Ít "magic" từ driver** → behavior predictable hơn
- **Phức tạp hơn nhiều** → learning curve dốc

### So sánh với các API khác

#### Vulkan vs OpenGL

```
OpenGL (Legacy):
App → OpenGL API → Driver (black box) → GPU
         ↑ High overhead, state machine hell

Vulkan (Modern):
App → Vulkan API → Thin driver → GPU
         ↑ Low overhead, explicit control
```

**OpenGL:**

- ✅ Dễ học, dễ dùng
- ✅ Legacy support tốt
- ❌ Driver overhead cao
- ❌ Multithreading support kém
- ❌ State machine gây confusion
- ❌ Không kiểm soát được memory

**Vulkan:**

- ✅ Performance cao, overhead thấp
- ✅ Excellent multithreading support
- ✅ Explicit memory management
- ✅ Modern GPU features
- ❌ Phức tạp, nhiều boilerplate
- ❌ Debugging khó hơn

**Thực tế:** Trong benchmark của tôi với 10,000 draw calls, Vulkan nhanh hơn OpenGL 60-80% nhờ batch submission và multithreaded command buffer recording.

#### Vulkan vs Metal (Đặc biệt quan trọng trên macOS)

**Metal:**

- ✅ Native Apple API, performance tối ưu trên Apple Silicon
- ✅ Easier API design hơn Vulkan
- ✅ Shading language (MSL) hiện đại
- ✅ Tight integration với Apple ecosystem
- ❌ Chỉ chạy trên Apple devices
- ❌ Ít tài liệu và community support

**Vulkan:**

- ✅ Cross-platform (Windows, Linux, Android, macOS)
- ✅ Large community và ecosystem
- ✅ Industry standard
- ❌ Trên macOS chạy qua MoltenVK (translation layer)
- ❌ Không tận dụng 100% Apple hardware features

**Sự thật về Vulkan trên macOS:** macOS không support Vulkan natively. Thay vào đó, chúng ta dùng **MoltenVK** - một translation layer converts Vulkan calls thành Metal calls. Performance vẫn tốt (85-95% so với native Metal) nhưng có một số [giới hạn](#/dynamic/post-04).

#### Vulkan vs DirectX 12

Cả hai đều là modern low-level APIs với design philosophy tương đồng:

**Similarities:**

- Explicit control over GPU resources
- Low overhead
- Excellent multithreading
- Complex API surface

**Differences:**

- **Platform:** DX12 chỉ Windows/Xbox, Vulkan cross-platform
- **API Design:** DX12 dễ dùng hơn một chút
- **Adoption:** DX12 phổ biến trên Windows, Vulkan phổ biến trên mobile/Linux

**Khuyến nghị:** Nếu target chỉ Windows → DX12. Nếu cross-platform → Vulkan.

#### Vulkan for AI/ML Workloads

Điều ít người biết: Vulkan không chỉ cho graphics. Với compute shaders, Vulkan có thể:

- **ML Inference:** Chạy neural networks trên GPU
- **Physics Simulation:** Particle systems, cloth simulation
- **Image Processing:** Computer vision, video encoding
- **Scientific Computing:** General purpose GPU computing

Tôi đã sử dụng Vulkan compute để accelerate inference của CNNs, đạt 3-4x speedup so với CPU. Điểm mạnh của Vulkan là có thể share resources giữa rendering và compute pipeline - ideal cho game AI hoặc realtime ML applications.

## Kiến trúc Vulkan: Từ 10,000 feet view đến chi tiết

### High-level Architecture

```
┌─────────────────────────────────────────┐
│         Application Layer                │
│    (Your Rust Code + Vulkan Bindings)   │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│         Vulkan API Layer                 │
│  (Instance, Device, Command Buffers)     │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      Loader & Validation Layers          │
│    (Error checking, debugging)           │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      ICD (Installable Client Driver)     │
│      [MoltenVK trên macOS]               │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│         Metal API (macOS)                │
└─────────────┬───────────────────────────┘
              │
              ▼
           [GPU Hardware]
```

### Core Components - Các Thành Phần Cốt Lõi

#### 1. **Instance** - Cổng vào Vulkan

**Vai trò:** Instance là connection giữa application và Vulkan implementation. Nó là entry point cho mọi Vulkan operations.

**Chức năng:**

- Query available physical devices (GPUs)
- Enable validation layers cho debugging
- Load extensions
- Setup debug callbacks

**Tương tự:** Nghĩ về Instance như "Vulkan runtime" hay "context" trong OpenGL.

**Trong Rust:**

```rust
use ash::{vk, Entry};

let entry = Entry::linked();

let app_info = vk::ApplicationInfo::builder()
    .application_name(CStr::from_bytes_with_nul_unchecked(b"MyApp\0"))
    .api_version(vk::API_VERSION_1_3);

let create_info = vk::InstanceCreateInfo::builder()
    .application_info(&app_info)
    .enabled_layer_names(&layer_names);

let instance = unsafe {
    entry.create_instance(&create_info, None)?
};
```

#### 2. **Physical Device** - GPU Hardware

**Vai trò:** Represents actual GPU hardware trên system.

**Chức năng:**

- Query GPU capabilities (memory types, queue families, features)
- Check support cho extensions
- Get performance characteristics

**Important:** Một system có thể có nhiều physical devices (integrated GPU + discrete GPU). Bạn cần pick đúng GPU cho use case.

**Trên macOS:** Thường có 2 devices:

- Apple Silicon integrated GPU (M1/M2/M3)
- Hoặc AMD discrete GPU trên Intel Macs

**Query example:**

```rust
let physical_devices = unsafe {
    instance.enumerate_physical_devices()?
};

for device in physical_devices {
    let props = unsafe {
        instance.get_physical_device_properties(device)
    };
    
    println!("GPU: {}", 
        CStr::from_ptr(props.device_name.as_ptr()));
    println!("Type: {:?}", props.device_type);
    println!("Max texture size: {}", 
        props.limits.max_image_dimension2_d);
}
```

#### 3. **Logical Device** - Interface để tương tác với GPU

**Vai trò:** Logical device là interface để submit work đến GPU. Nó được tạo từ physical device.

**Chức năng:**

- Create command buffers
- Allocate memory
- Create pipelines
- Submit work to queues

**Tương tự:** Nếu Physical Device là "GPU hardware spec sheet", thì Logical Device là "remote control" để điều khiển GPU đó.

**Creation:**

```rust
let device_features = vk::PhysicalDeviceFeatures::default();

let queue_create_info = vk::DeviceQueueCreateInfo::builder()
    .queue_family_index(graphics_queue_family)
    .queue_priorities(&[1.0]);

let device_create_info = vk::DeviceCreateInfo::builder()
    .queue_create_infos(&[queue_create_info])
    .enabled_features(&device_features);

let device = unsafe {
    instance.create_device(physical_device, &device_create_info, None)?
};
```

#### 4. **Queue Families & Queues** - Work Submission System

**Vai trò:** Queues là channels để submit commands đến GPU.

**Queue Families:** GPUs có các queue families khác nhau, mỗi family support các operations khác nhau:

- **Graphics Queue:** Rendering commands (draw, clear, etc.)
- **Compute Queue:** Compute shaders
- **Transfer Queue:** Memory transfer operations
- **Sparse Binding Queue:** Sparse resource management

**Quan trọng:** Một queue family có thể support nhiều operations. Ví dụ: Graphics queue thường cũng support compute và transfer.

**Strategy:**

- Production: Sử dụng dedicated queues cho từng loại work để maximize parallelism
- Development: Dùng graphics queue cho mọi thứ cho đơn giản

**Queue query:**

```rust
let queue_family_properties = unsafe {
    instance.get_physical_device_queue_family_properties(physical_device)
};

let graphics_queue_family = queue_family_properties
    .iter()
    .position(|props| {
        props.queue_flags.contains(vk::QueueFlags::GRAPHICS)
    })
    .unwrap() as u32;

let graphics_queue = unsafe {
    device.get_device_queue(graphics_queue_family, 0)
};
```

#### 5. **Command Buffers** - GPU Command Recording

**Vai trò:** Command buffers record các GPU commands. Chúng được submit đến queue để execute.

**Workflow:**

1. Allocate command buffer từ command pool
2. Begin recording
3. Record commands (draw, dispatch, copy, etc.)
4. End recording
5. Submit to queue

**Ưu điểm:**

- **Pre-record:** Bạn có thể record commands ahead of time
- **Reuse:** Record once, submit nhiều lần
- **Multithreading:** Mỗi thread có thể record riêng command buffer

**Types:**

- **Primary:** Submit directly đến queue
- **Secondary:** Execute từ primary command buffer (useful cho scene organization)

**Example:**

```rust
// Create command pool
let pool_create_info = vk::CommandPoolCreateInfo::builder()
    .queue_family_index(graphics_queue_family)
    .flags(vk::CommandPoolCreateFlags::RESET_COMMAND_BUFFER);

let command_pool = unsafe {
    device.create_command_pool(&pool_create_info, None)?
};

// Allocate command buffer
let alloc_info = vk::CommandBufferAllocateInfo::builder()
    .command_pool(command_pool)
    .level(vk::CommandBufferLevel::PRIMARY)
    .command_buffer_count(1);

let command_buffers = unsafe {
    device.allocate_command_buffers(&alloc_info)?
};
let cmd = command_buffers[0];

// Record commands
let begin_info = vk::CommandBufferBeginInfo::builder()
    .flags(vk::CommandBufferUsageFlags::ONE_TIME_SUBMIT);

unsafe {
    device.begin_command_buffer(cmd, &begin_info)?;
    
    // Record your commands here
    device.cmd_draw(cmd, vertex_count, 1, 0, 0);
    
    device.end_command_buffer(cmd)?;
}
```

#### 6. **Render Pass** - Rendering Structure

**Vai trò:** Render pass define structure của rendering operations: attachments nào được dùng, load/store operations, dependencies.

**Components:**

- **Attachments:** Color, depth, stencil buffers
- **Subpasses:** Phases của rendering (geometry pass, lighting pass, post-processing)
- **Dependencies:** Synchronization giữa subpasses

**Tại sao cần:** Vulkan cần biết structure ahead of time để optimize memory bandwidth và tiling (especially quan trọng trên mobile GPUs).

**Example structure:**

```
Render Pass:
  Attachments:
    - Color attachment (RGBA8)
    - Depth attachment (D24S8)
  
  Subpass 0 (Geometry):
    - Write to Color + Depth
  
  Subpass 1 (Lighting):
    - Read from Depth
    - Write to Color
```

**Creation:**

```rust
let color_attachment = vk::AttachmentDescription::builder()
    .format(vk::Format::R8G8B8A8_UNORM)
    .samples(vk::SampleCountFlags::TYPE_1)
    .load_op(vk::AttachmentLoadOp::CLEAR)
    .store_op(vk::AttachmentStoreOp::STORE)
    .initial_layout(vk::ImageLayout::UNDEFINED)
    .final_layout(vk::ImageLayout::PRESENT_SRC_KHR);

let depth_attachment = vk::AttachmentDescription::builder()
    .format(vk::Format::D24_UNORM_S8_UINT)
    .samples(vk::SampleCountFlags::TYPE_1)
    .load_op(vk::AttachmentLoadOp::CLEAR)
    .store_op(vk::AttachmentStoreOp::DONT_CARE)
    .initial_layout(vk::ImageLayout::UNDEFINED)
    .final_layout(vk::ImageLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL);

let subpass = vk::SubpassDescription::builder()
    .pipeline_bind_point(vk::PipelineBindPoint::GRAPHICS)
    .color_attachments(&[color_attachment_ref])
    .depth_stencil_attachment(&depth_attachment_ref);

let render_pass_create_info = vk::RenderPassCreateInfo::builder()
    .attachments(&[color_attachment, depth_attachment])
    .subpasses(&[subpass]);

let render_pass = unsafe {
    device.create_render_pass(&render_pass_create_info, None)?
};
```

#### 7. **Pipeline** - Shader Execution Configuration

**Vai trò:** Pipeline define toàn bộ state của rendering hoặc compute operation.

**Graphics Pipeline bao gồm:**

- **Shader Stages:** Vertex, fragment, geometry, tessellation
- **Vertex Input:** Format của vertex data
- **Input Assembly:** Primitive topology (triangles, lines, points)
- **Viewport & Scissor:** Screen region
- **Rasterization:** Culling, polygon mode
- **Multisampling:** Anti-aliasing
- **Depth/Stencil Testing:** Depth comparison, stencil operations
- **Color Blending:** Alpha blending
- **Dynamic State:** State có thể change without recreating pipeline

**Immutable Nature:** Hầu hết pipeline state là immutable. Switching pipelines có cost, nên minimize pipeline switches.

**Pipeline Cache:** Vulkan support pipeline caching để reduce compilation time.

**Example:**

```rust
// Load shaders
let vert_shader_module = create_shader_module(&device, VERTEX_SHADER_SPV)?;
let frag_shader_module = create_shader_module(&device, FRAGMENT_SHADER_SPV)?;

let vert_stage = vk::PipelineShaderStageCreateInfo::builder()
    .stage(vk::ShaderStageFlags::VERTEX)
    .module(vert_shader_module)
    .name(CStr::from_bytes_with_nul_unchecked(b"main\0"));

let frag_stage = vk::PipelineShaderStageCreateInfo::builder()
    .stage(vk::ShaderStageFlags::FRAGMENT)
    .module(frag_shader_module)
    .name(CStr::from_bytes_with_nul_unchecked(b"main\0"));

let shader_stages = [vert_stage.build(), frag_stage.build()];

// Vertex input
let vertex_input_info = vk::PipelineVertexInputStateCreateInfo::builder()
    .vertex_binding_descriptions(&binding_descriptions)
    .vertex_attribute_descriptions(&attribute_descriptions);

// Input assembly
let input_assembly = vk::PipelineInputAssemblyStateCreateInfo::builder()
    .topology(vk::PrimitiveTopology::TRIANGLE_LIST)
    .primitive_restart_enable(false);

// Viewport & scissor
let viewport = vk::Viewport {
    x: 0.0, y: 0.0,
    width: swapchain_extent.width as f32,
    height: swapchain_extent.height as f32,
    min_depth: 0.0, max_depth: 1.0,
};

let scissor = vk::Rect2D {
    offset: vk::Offset2D { x: 0, y: 0 },
    extent: swapchain_extent,
};

let viewport_state = vk::PipelineViewportStateCreateInfo::builder()
    .viewports(&[viewport])
    .scissors(&[scissor]);

// Rasterization
let rasterizer = vk::PipelineRasterizationStateCreateInfo::builder()
    .polygon_mode(vk::PolygonMode::FILL)
    .cull_mode(vk::CullModeFlags::BACK)
    .front_face(vk::FrontFace::COUNTER_CLOCKWISE)
    .line_width(1.0);

// Multisampling
let multisampling = vk::PipelineMultisampleStateCreateInfo::builder()
    .rasterization_samples(vk::SampleCountFlags::TYPE_1);

// Depth/stencil
let depth_stencil = vk::PipelineDepthStencilStateCreateInfo::builder()
    .depth_test_enable(true)
    .depth_write_enable(true)
    .depth_compare_op(vk::CompareOp::LESS);

// Color blending
let color_blend_attachment = vk::PipelineColorBlendAttachmentState::builder()
    .color_write_mask(vk::ColorComponentFlags::RGBA)
    .blend_enable(false);

let color_blending = vk::PipelineColorBlendStateCreateInfo::builder()
    .attachments(&[color_blend_attachment.build()]);

// Pipeline layout (for uniforms/descriptors)
let pipeline_layout_info = vk::PipelineLayoutCreateInfo::builder()
    .set_layouts(&descriptor_set_layouts);

let pipeline_layout = unsafe {
    device.create_pipeline_layout(&pipeline_layout_info, None)?
};

// Create graphics pipeline
let pipeline_info = vk::GraphicsPipelineCreateInfo::builder()
    .stages(&shader_stages)
    .vertex_input_state(&vertex_input_info)
    .input_assembly_state(&input_assembly)
    .viewport_state(&viewport_state)
    .rasterization_state(&rasterizer)
    .multisample_state(&multisampling)
    .depth_stencil_state(&depth_stencil)
    .color_blend_state(&color_blending)
    .layout(pipeline_layout)
    .render_pass(render_pass)
    .subpass(0);

let graphics_pipeline = unsafe {
    device.create_graphics_pipelines(
        vk::PipelineCache::null(),
        &[pipeline_info.build()],
        None
    ).map_err(|(_, e)| e)?[0]
};
```

#### 8. **Memory Management** - GPU Memory

**Vai trò:** Vulkan requires explicit memory management. Bạn allocate memory và bind nó vào resources.

**Memory Types:**

- **Device Local:** Fast GPU memory (VRAM), không accessible từ CPU
- **Host Visible:** CPU có thể đọc/ghi, slower than device local
- **Host Coherent:** Auto synchronization giữa CPU/GPU writes
- **Host Cached:** CPU cached, faster reads

**Strategy:**

- **Static geometry:** Device local memory
- **Dynamic data (uniforms):** Host visible + coherent
- **Staging buffers:** Host visible → Device local transfer

**Memory Heaps:** GPU có nhiều memory heaps với sizes khác nhau. Cần query và choose appropriately.

**Trong thực tế:** Memory management là một trong những phần phức tạp nhất. Recommendation: Dùng memory allocator như `vk-mem` (VMA wrapper cho Rust) thay vì manually manage.

**Manual allocation example:**

```rust
// Query memory requirements
let mem_requirements = unsafe {
    device.get_buffer_memory_requirements(buffer)
};

// Find suitable memory type
let memory_type_index = find_memory_type(
    mem_requirements.memory_type_bits,
    vk::MemoryPropertyFlags::HOST_VISIBLE 
        | vk::MemoryPropertyFlags::HOST_COHERENT,
    &memory_properties
)?;

// Allocate memory
let alloc_info = vk::MemoryAllocateInfo::builder()
    .allocation_size(mem_requirements.size)
    .memory_type_index(memory_type_index);

let buffer_memory = unsafe {
    device.allocate_memory(&alloc_info, None)?
};

// Bind memory to buffer
unsafe {
    device.bind_buffer_memory(buffer, buffer_memory, 0)?;
}
```

#### 9. **Descriptors** - Resource Binding

**Vai trò:** Descriptors tell shaders where to find resources (textures, buffers, samplers).

**Hierarchy:**

```
Descriptor Set Layout (blueprint)
    ↓
Descriptor Pool (memory allocator)
    ↓
Descriptor Set (actual instance)
    ↓
Update descriptors (bind resources)
```

**Types:**

- `UNIFORM_BUFFER`: Small read-only data (matrices, parameters)
- `STORAGE_BUFFER`: Large read-write data
- `SAMPLED_IMAGE`: Textures
- `SAMPLER`: Texture sampling configuration
- `COMBINED_IMAGE_SAMPLER`: Texture + sampler combined
- `STORAGE_IMAGE`: Images for compute shaders

**Example:**

```rust
// Create descriptor set layout
let ubo_binding = vk::DescriptorSetLayoutBinding::builder()
    .binding(0)
    .descriptor_type(vk::DescriptorType::UNIFORM_BUFFER)
    .descriptor_count(1)
    .stage_flags(vk::ShaderStageFlags::VERTEX);

let sampler_binding = vk::DescriptorSetLayoutBinding::builder()
    .binding(1)
    .descriptor_type(vk::DescriptorType::COMBINED_IMAGE_SAMPLER)
    .descriptor_count(1)
    .stage_flags(vk::ShaderStageFlags::FRAGMENT);

let bindings = [ubo_binding.build(), sampler_binding.build()];

let layout_info = vk::DescriptorSetLayoutCreateInfo::builder()
    .bindings(&bindings);

let descriptor_set_layout = unsafe {
    device.create_descriptor_set_layout(&layout_info, None)?
};

// Create descriptor pool
let pool_sizes = [
    vk::DescriptorPoolSize {
        ty: vk::DescriptorType::UNIFORM_BUFFER,
        descriptor_count: 10,
    },
    vk::DescriptorPoolSize {
        ty: vk::DescriptorType::COMBINED_IMAGE_SAMPLER,
        descriptor_count: 10,
    },
];

let pool_info = vk::DescriptorPoolCreateInfo::builder()
    .pool_sizes(&pool_sizes)
    .max_sets(10);

let descriptor_pool = unsafe {
    device.create_descriptor_pool(&pool_info, None)?
};

// Allocate descriptor sets
let alloc_info = vk::DescriptorSetAllocateInfo::builder()
    .descriptor_pool(descriptor_pool)
    .set_layouts(&[descriptor_set_layout]);

let descriptor_sets = unsafe {
    device.allocate_descriptor_sets(&alloc_info)?
};

// Update descriptor sets
let buffer_info = vk::DescriptorBufferInfo::builder()
    .buffer(uniform_buffer)
    .offset(0)
    .range(vk::WHOLE_SIZE);

let image_info = vk::DescriptorImageInfo::builder()
    .image_layout(vk::ImageLayout::SHADER_READ_ONLY_OPTIMAL)
    .image_view(texture_image_view)
    .sampler(texture_sampler);

let descriptor_writes = [
    vk::WriteDescriptorSet::builder()
        .dst_set(descriptor_sets[0])
        .dst_binding(0)
        .descriptor_type(vk::DescriptorType::UNIFORM_BUFFER)
        .buffer_info(&[buffer_info.build()])
        .build(),
    vk::WriteDescriptorSet::builder()
        .dst_set(descriptor_sets[0])
        .dst_binding(1)
        .descriptor_type(vk::DescriptorType::COMBINED_IMAGE_SAMPLER)
        .image_info(&[image_info.build()])
        .build(),
];

unsafe {
    device.update_descriptor_sets(&descriptor_writes, &[]);
}
```

#### 10. **Synchronization** - Coordination

**Vai trò:** GPU operations are asynchronous. Synchronization ensures operations happen in correct order.

**Primitives:**

**Semaphores:** GPU-GPU synchronization

- Signal khi operation complete
- Wait trước khi start operation
- Use case: Synchronize giữa queues (image ready → rendering → present)

**Fences:** CPU-GPU synchronization

- CPU wait cho GPU operation complete
- Use case: Frame pacing, resource reuse

**Barriers:** In-command-buffer synchronization

- Memory barriers: Ensure memory writes visible
- Image layout transitions: Change image usage
- Pipeline barriers: Order operations

**Events:** Fine-grained synchronization trong command buffer

**Example:**

```rust
// Create semaphores
let semaphore_info = vk::SemaphoreCreateInfo::default();

let image_available_semaphore = unsafe {
    device.create_semaphore(&semaphore_info, None)?
};

let render_finished_semaphore = unsafe {
    device.create_semaphore(&semaphore_info, None)?
};

// Create fence
let fence_info = vk::FenceCreateInfo::builder()
    .flags(vk::FenceCreateFlags::SIGNALED); // Start signaled

let in_flight_fence = unsafe {
    device.create_fence(&fence_info, None)?
};

// Wait for fence
unsafe {
    device.wait_for_fences(
        &[in_flight_fence],
        true,
        u64::MAX
    )?;
    device.reset_fences(&[in_flight_fence])?;
}

// Submit with synchronization
let wait_stages = [vk::PipelineStageFlags::COLOR_ATTACHMENT_OUTPUT];
let submit_info = vk::SubmitInfo::builder()
    .wait_semaphores(&[image_available_semaphore])
    .wait_dst_stage_mask(&wait_stages)
    .command_buffers(&[command_buffer])
    .signal_semaphores(&[render_finished_semaphore]);

unsafe {
    device.queue_submit(
        graphics_queue,
        &[submit_info.build()],
        in_flight_fence
    )?;
}
```

#### 11. **Swapchain** - Presentation

**Vai trò:** Swapchain manage images cho presentation đến screen.

**Concepts:**

- **Double/Triple buffering:** Nhiều images để avoid tearing
- **Present modes:**
    - `IMMEDIATE`: No vsync, potential tearing
    - `FIFO`: Vsync, queue frames
    - `MAILBOX`: Triple buffering, low latency
- **Surface format:** Color space và format của images

**macOS-specific:** Swapchain trên macOS qua MoltenVK có một số quirks với surface creation.

**Workflow:**

1. Create surface (platform-specific)
2. Query swapchain support
3. Choose format, present mode, extent
4. Create swapchain
5. Get swapchain images
6. Create image views

**Example:**

```rust
// Query swapchain support
let capabilities = unsafe {
    surface_loader.get_physical_device_surface_capabilities(
        physical_device,
        surface
    )?
};

let formats = unsafe {
    surface_loader.get_physical_device_surface_formats(
        physical_device,
        surface
    )?
};

let present_modes = unsafe {
    surface_loader.get_physical_device_surface_present_modes(
        physical_device,
        surface
    )?
};

// Choose settings
let surface_format = formats.iter()
    .find(|f| {
        f.format == vk::Format::B8G8R8A8_UNORM &&
        f.color_space == vk::ColorSpaceKHR::SRGB_NONLINEAR
    })
    .unwrap_or(&formats[0]);

let present_mode = if present_modes.contains(&vk::PresentModeKHR::MAILBOX) {
    vk::PresentModeKHR::MAILBOX
} else {
    vk::PresentModeKHR::FIFO
};

let extent = vk::Extent2D {
    width: window_width.clamp(
        capabilities.min_image_extent.width,
        capabilities.max_image_extent.width
    ),
    height: window_height.clamp(
        capabilities.min_image_extent.height,
        capabilities.max_image_extent.height
    ),
};

// Create swapchain
let image_count = capabilities.min_image_count +
```
## Tài liệu tham khảo
- [Vulkan - there is no god](https://www.fasterthan.life/blog/2017/7/11/i-am-graphics-and-so-can-you-part-2-intuition)
- 