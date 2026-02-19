---
title: Vulkan Resources & Components
creation date: 2026-02-18T01:00:00
last edited: 2026-02-18T01:00:00
slug: vulkan-00-v2
series: vulkan
excerpt:
lang: en
cover img: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F2NVlG9TFT1c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=1bc48266157d288817a9fdf26479c7009f947736ff5e91538c17a7f2afed3274
tags:
  - vulkan
---


# 🔷 INSTANCE & DEVICE

### `VkInstance`

The root Vulkan object. Connects your app to the Vulkan runtime, loads validation layers and instance-level extensions. Everything starts here. Created once, destroyed last.

### `VkPhysicalDevice`

A handle representing a physical GPU. Not created — enumerated from `VkInstance`. You query it for memory types, queue families, format support, and device limits. You pick one (or multiple for multi-GPU).

### `VkDevice`

The logical device — your actual working interface to the GPU. Created from a `VkPhysicalDevice` with a list of features and queue families you want. All resource creation flows through it.

### `VkQueue`

A submission endpoint on the GPU. Retrieved from `VkDevice`. Types: Graphics, Compute, Transfer, Present (sometimes the same family). You submit `VkCommandBuffer`s to it.

### `VkQueueFamily`

Not a Vk object — a concept. A group of queues with the same capabilities. You must query which family supports graphics, compute, transfer, and presentation before creating the device.

---

# 🔷 SURFACE & PRESENTATION

### `VkSurfaceKHR`

A platform-agnostic handle to an OS window's renderable area. Created via platform extensions. The bridge between Vulkan and your windowing system (winit, SDL, etc.).

### `VkSwapchainKHR`

A ring of presentable images (usually 2–3) tied to a surface. You render into these, then present them to the display. Must be recreated on window resize.

### `VkPresentModeKHR`

Not an object — an enum you choose when creating the swapchain. Options: `FIFO` (vsync), `MAILBOX` (triple buffer, low latency), `IMMEDIATE` (no vsync, tearing possible).

### `VkSurfaceFormatKHR`

Not an object — a struct describing color format + color space of the swapchain. You query supported formats and pick one (usually `B8G8R8A8_SRGB` + `SRGB_NONLINEAR`).

---

# 🔷 MEMORY

### `VkDeviceMemory`

A raw GPU memory allocation. Backing store for buffers and images. You allocate it, then bind it to a resource. Vulkan has a hard limit on allocation count (`maxMemoryAllocationCount`, often 4096) — always use an allocator like `gpu-allocator` or `vk-mem`.

### `VkMemoryType`

Not an object — a property of a heap describing how memory can be accessed. Key flags: `DEVICE_LOCAL` (fast GPU memory), `HOST_VISIBLE` (CPU can map/write it), `HOST_COHERENT` (no manual flush needed).

### `VkMemoryHeap`

Not an object — represents a physical memory pool (VRAM vs system RAM). You query these from `VkPhysicalDevice` to understand available memory budget.

---

# 🔷 BUFFERS

### `VkBuffer`

A linear block of GPU memory for arbitrary data. Has no format — just raw bytes. Always paired with `VkDeviceMemory`. Usage flags determine what it's for:

|Usage Flag|Purpose|
|---|---|
|`VERTEX_BUFFER`|Mesh vertex data|
|`INDEX_BUFFER`|Triangle indices|
|`UNIFORM_BUFFER`|Small read-only shader data (UBO)|
|`STORAGE_BUFFER`|Large read/write shader data (SSBO)|
|`TRANSFER_SRC`|Source for copy operations|
|`TRANSFER_DST`|Destination for copy operations|
|`INDIRECT_BUFFER`|GPU-driven draw call arguments|
|`ACCELERATION_STRUCTURE`|Ray tracing BVH|

### `VkBufferView`

A typed view into a subset of a `VkBuffer`. Used only with texel buffers (uniform texel / storage texel). Rare in typical rendering — more common in compute.

---

# 🔷 IMAGES & TEXTURES

### `VkImage`

A GPU image resource. Unlike `VkBuffer`, it has a format, dimensionality, mip levels, array layers, and a layout. Usage flags:

|Usage Flag|Purpose|
|---|---|
|`SAMPLED`|Read in shaders as texture|
|`STORAGE`|Read/write in compute shaders|
|`COLOR_ATTACHMENT`|Render target (color)|
|`DEPTH_STENCIL_ATTACHMENT`|Render target (depth/stencil)|
|`TRANSFER_SRC/DST`|Copy operations|
|`TRANSIENT_ATTACHMENT`|Tile-based GPU optimization|
|`INPUT_ATTACHMENT`|Read previous subpass output|

### `VkImageView`

Describes how to interpret a `VkImage` — format, which mip levels, which array layers, component swizzle, aspect (color vs depth vs stencil). You never bind a `VkImage` directly to a shader — always through a `VkImageView`.

### `VkImageLayout`

Not an object — an enum describing the current access pattern of an image. Vulkan requires you to explicitly transition layouts:

|Layout|Used When|
|---|---|
|`UNDEFINED`|Initial state, content discardable|
|`GENERAL`|Any access, not optimal|
|`COLOR_ATTACHMENT_OPTIMAL`|Being written as render target|
|`DEPTH_STENCIL_ATTACHMENT_OPTIMAL`|Being written as depth buffer|
|`SHADER_READ_ONLY_OPTIMAL`|Being sampled in shader|
|`TRANSFER_SRC/DST_OPTIMAL`|Copy operations|
|`PRESENT_SRC_KHR`|Ready to be presented|

### `VkSampler`

Defines how a shader samples a `VkImage`. Controls: filtering (nearest/linear/anisotropic), address mode (repeat/clamp/mirror), mip LOD bias, min/max LOD, border color, comparison function (for shadow maps). Samplers are expensive to create — create few, reuse many.

---

# 🔷 RENDER PASS & FRAMEBUFFER

### `VkRenderPass`

Describes the structure of a render pass: what attachments exist (color, depth, resolve), how many subpasses, and load/store operations (`CLEAR`, `LOAD`, `DONT_CARE`, `STORE`). A blueprint — no actual images bound here.

### `VkSubpass`

Not a standalone object — defined inside `VkRenderPass`. A rendering phase within a pass. Multiple subpasses allow tile-based GPUs to keep intermediate results in fast on-chip memory (important on mobile). On desktop, typically just one subpass.

### `VkSubpassDependency`

Also defined inside `VkRenderPass`. Describes memory and execution dependencies between subpasses. Essentially a built-in pipeline barrier between subpass stages.

### `VkFramebuffer`

Binds concrete `VkImageView`s to the attachment slots defined by a `VkRenderPass`. The actual render target. Must be recreated when swapchain resizes.

> ⚠️ **Modern alternative:** With `VK_KHR_dynamic_rendering` (core in Vulkan 1.3), you skip `VkRenderPass` and `VkFramebuffer` entirely. You specify attachments inline at command recording time with `vkCmdBeginRendering()`.

---

# 🔷 SHADERS & PIPELINES

### `VkShaderModule`

A compiled SPIR-V binary loaded into the driver. One per shader file. Can be destroyed after pipeline creation — the driver has already compiled it. In Rust, compile GLSL/HLSL → SPIR-V at build time with `shaderc` or `glslc`.

### `VkPipelineLayout`

Describes the full resource interface of a pipeline — which `VkDescriptorSetLayout`s are used and what `PushConstantRange`s exist. Shared across compatible pipelines.

### `VkPipeline`

The compiled, immutable state machine for GPU execution. Two types:

**`VkGraphicsPipeline`** — encodes:

- Shader stages (vertex, fragment, geometry, tessellation, mesh)
- Vertex input format
- Primitive topology (triangles, lines, points)
- Rasterization (fill mode, cull mode, winding order, depth bias)
- Multisample state (MSAA)
- Depth/stencil state (test, write, compare op)
- Color blend state (alpha blending per attachment)
- Dynamic states (viewport, scissor, line width, etc.)
- Pipeline layout
- Render pass / subpass (or dynamic rendering format)

**`VkComputePipeline`** — encodes:

- One compute shader stage
- Pipeline layout

### `VkPipelineCache`

Stores compiled pipeline binaries. Speeds up pipeline creation dramatically on subsequent runs. Serialize to disk between sessions. Share across pipelines created with the same device.

### `VkPipelineShaderStageCreateInfo`

Not a standalone object — a struct used during pipeline creation. Pairs a `VkShaderModule` with a stage flag (`VERTEX`, `FRAGMENT`, etc.) and an entry point name (usually `"main"`).

### `VkSpecializationInfo`

Not an object — a struct that injects compile-time constants into a shader at pipeline creation time. Zero runtime cost. Use to specialize a single shader for multiple configurations (e.g., `MAX_LIGHTS = 4` vs `= 16`) without writing separate shaders.

---

# 🔷 DESCRIPTORS

### `VkDescriptorSetLayout`

A blueprint describing what bindings a descriptor set has — binding index, resource type (`UNIFORM_BUFFER`, `COMBINED_IMAGE_SAMPLER`, `STORAGE_BUFFER`, etc.), count, and which shader stages can access it. Shared across many objects.

### `VkDescriptorPool`

Pre-allocates a fixed pool of descriptor sets of specified types and counts. You allocate `VkDescriptorSet`s from it. When full, either reset the pool or create another. Commonly one pool per frame-in-flight.

### `VkDescriptorSet`

The actual binding table — points GPU-side binding slots at real `VkBuffer`s and `VkImageView`+`VkSampler` pairs. Updated with `vkUpdateDescriptorSets()`. One per object/material per frame-in-flight (or use dynamic offsets to share).

### `VkDescriptorUpdateTemplate`

An optimization for updating descriptor sets with the same layout repeatedly. Avoids the overhead of `vkUpdateDescriptorSets()` in hot paths. Useful for per-frame uniform updates.

### `VkWriteDescriptorSet`

Not a standalone object — a struct passed to `vkUpdateDescriptorSets()` describing what to write into which binding of a `VkDescriptorSet`.

---

# 🔷 COMMANDS

### `VkCommandPool`

A memory pool for allocating `VkCommandBuffer`s. **Not thread-safe** — one pool per thread per queue family. Reset the pool to recycle all its command buffers at once.

### `VkCommandBuffer`

Where you record GPU commands. Two levels:

- **Primary** — submitted directly to a queue, can call secondary buffers
- **Secondary** — recorded separately, called from a primary buffer (useful for multithreaded recording)

Key commands recorded into it:

```txt
vkCmdBeginRendering / vkCmdEndRendering
vkCmdBindPipeline
vkCmdBindDescriptorSets
vkCmdBindVertexBuffers
vkCmdBindIndexBuffer
vkCmdDraw / vkCmdDrawIndexed
vkCmdDrawIndirect / vkCmdDrawIndexedIndirect   ← GPU-driven
vkCmdDispatch                                  ← compute
vkCmdCopyBuffer / vkCmdCopyImage
vkCmdPipelineBarrier / vkCmdPipelineBarrier2
vkCmdPushConstants
vkCmdSetViewport / vkCmdSetScissor
vkCmdBeginQuery / vkCmdEndQuery
```

---

# 🔷 SYNCHRONIZATION

### `VkSemaphore`

GPU ↔ GPU synchronization. Signals when a queue operation finishes, waits before another begins. Two types:

- **Binary** — signal/wait pair, resets after wait
- **Timeline** (Vulkan 1.2+) — monotonically increasing counter, more flexible, preferred in modern code

Common use: swapchain image acquired → render → present chain.

### `VkFence`

GPU → CPU synchronization. CPU calls `vkWaitForFences()` to block until GPU work finishes. Used to know when a frame-in-flight slot is free to reuse.

### `VkEvent`

Fine-grained GPU ↔ GPU sync within or between command buffers. More granular than semaphores but more complex. Used for splitting a render pass into stages with minimal stall. Less common.

### `VkPipelineBarrier` / `VkPipelineBarrier2`

Not an object — a command recorded into a `VkCommandBuffer`. Enforces memory and execution ordering between pipeline stages. Used for:

- Image layout transitions
- Buffer/image write → read ordering
- Preventing hazards between passes

`VkPipelineBarrier2` (Vulkan 1.3 / `VK_KHR_synchronization2`) is the modern, cleaner version — prefer it.

### `VkMemoryBarrier` / `VkBufferMemoryBarrier` / `VkImageMemoryBarrier`

Structs passed into `vkCmdPipelineBarrier`. Define what memory access to synchronize and (for images) what layout transition to perform.

---

# 🔷 QUERIES

### `VkQueryPool`

A pool of GPU query slots. Types:

|Type|Purpose|
|---|---|
|`OCCLUSION`|How many samples passed depth test|
|`PIPELINE_STATISTICS`|Draw calls, vertices, shader invocations count|
|`TIMESTAMP`|GPU time measurement for profiling|

---

# 🔷 RAY TRACING (VK_KHR_ray_tracing)

### `VkAccelerationStructureKHR`

A BVH (Bounding Volume Hierarchy) data structure on the GPU. Two levels:

- **BLAS** (Bottom Level) — geometry of a single mesh
- **TLAS** (Top Level) — instances of BLASes with transforms

### `VkRayTracingPipelineKHR`

Like `VkGraphicsPipeline` but for ray tracing. Contains ray generation, miss, closest hit, any hit, and intersection shader stages.

### `VkStridedDeviceAddressRegionKHR`

Struct describing the shader binding table (SBT) — a buffer that maps ray types to shader handles.

---

# 🔷 MISCELLANEOUS

### `VkSamplerYcbcrConversion`

Converts YCbCr image formats (video frames) to RGB in the sampler. Used for video texture playback.

### `VkRenderingInfo` (Dynamic Rendering)

Not a persistent object — a struct passed to `vkCmdBeginRendering()`. Specifies color attachments, depth attachment, render area. Replaces `VkRenderPass` + `VkFramebuffer` in modern Vulkan.

### `VkPushConstantRange`

Not an object — defines a small block of data (max 128 bytes guaranteed) pushed directly into shaders via `vkCmdPushConstants()` with zero descriptor overhead. Ideal for per-draw data like transform matrices or material IDs.

### `VkPhysicalDeviceFeatures` / `VkPhysicalDeviceFeatures2`

Not an object — a struct listing optional GPU features you can query and enable (anisotropic sampling, wide lines, geometry shaders, bindless descriptors, etc.).

### `VkExtensionProperties`

Not an object — describes an available instance or device extension. You query these to check support before enabling things like `VK_KHR_dynamic_rendering`, `VK_KHR_ray_tracing`, etc.

---

```txt
╔══════════════════════════════════════════════════════════════════════╗
║  COMPLETE OBJECT TAXONOMY                                            ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  CORE          VkInstance, VkPhysicalDevice, VkDevice, VkQueue       ║
║  PRESENTATION  VkSurfaceKHR, VkSwapchainKHR                         ║
║  MEMORY        VkDeviceMemory                                        ║
║  BUFFERS       VkBuffer, VkBufferView                                ║
║  IMAGES        VkImage, VkImageView, VkSampler                      ║
║  RENDER PASS   VkRenderPass, VkFramebuffer         (classic)        ║
║  PIPELINES     VkShaderModule, VkPipelineLayout,                    ║
║                VkPipeline, VkPipelineCache                          ║
║  DESCRIPTORS   VkDescriptorSetLayout, VkDescriptorPool,             ║
║                VkDescriptorSet, VkDescriptorUpdateTemplate          ║
║  COMMANDS      VkCommandPool, VkCommandBuffer                       ║
║  SYNC          VkSemaphore, VkFence, VkEvent                        ║
║  QUERIES       VkQueryPool                                           ║
║  RAY TRACING   VkAccelerationStructureKHR                           ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

Want me to go deeper on any specific group — for example the descriptor system, synchronization patterns, or how to structure these in your ECS world as Rust types?