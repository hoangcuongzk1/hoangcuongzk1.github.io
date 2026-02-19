---
title: Vulkan Shared & Non-Shared Resource
creation date: 2026-02-18T01:00:00
last edited: 2026-02-18T01:00:00
slug: vulkan-01
series: vulkan
excerpt: Collections of vulkan resources and how to manage their memory,
lang: en
cover img: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F2NVlG9TFT1c%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=1bc48266157d288817a9fdf26479c7009f947736ff5e91538c17a7f2afed3274
tags:
  - vulkan
---

## Shared & non-shared
```txt
╔══════════════════════════════════════════════════════════════════════════════╗
║                    VULKAN RESOURCE SHARING SUMMARY                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║  ██████  SHARED  ██████  (created ONCE, lives forever until engine dies)    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  [GLOBAL CORE]                                                               ║
║   VkInstance                 ← one per application                          ║
║   VkPhysicalDevice           ← one per GPU                                  ║
║   VkDevice                   ← one per GPU                                  ║
║   VkQueue                    ← one per queue family                         ║
║                                                                              ║
║  [PIPELINES]                                                                 ║
║   VkShaderModule             ← one per shader file                          ║
║   VkPipelineLayout           ← one per pipeline type                        ║
║   VkPipelineCache            ← one globally                                 ║
║   VkPipeline                 ← one per render mode                          ║
║                   e.g: opaque / wireframe / unlit / shadow                  ║
║                                                                              ║
║  [DESCRIPTORS LAYOUT]                                                        ║
║   VkDescriptorSetLayout      ← one per binding schema                       ║
║   VkDescriptorPool           ← one (or few) globally                        ║
║                                                                              ║
║  [MESH ASSETS]                                                               ║
║   VkBuffer (vertex)          ← one per mesh                                 ║
║   VkBuffer (index)           ← one per mesh                                 ║
║   VkDeviceMemory             ← backing memory for above                     ║
║                                                                              ║
║  [TEXTURE ASSETS]                                                            ║
║   VkImage                    ← one per texture                              ║
║   VkImageView (texture)      ← one per texture                              ║
║   VkDeviceMemory             ← backing memory for above                     ║
║   VkSampler                  ← shared across materials                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║  ██████  PER-VIEWPORT  ██████  (one copy per window / offscreen panel)      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  [SURFACE & PRESENTATION]   (only for real OS windows)                       ║
║   VkSurfaceKHR               ← tied to OS window handle                     ║
║   VkSwapchainKHR             ← tied to surface                              ║
║   VkImage (swapchain)        ← owned by swapchain                           ║
║   VkImageView (swapchain)    ← view into swapchain images                   ║
║                                                                              ║
║  [RENDER TARGETS]                                                            ║
║   VkImage (color MSAA)       ← sized to viewport resolution                 ║
║   VkImage (depth/stencil)    ← sized to viewport resolution                 ║
║   VkImageView (color)        ← view into above                              ║
║   VkImageView (depth)        ← view into above                              ║
║   VkDeviceMemory             ← backing memory for render targets            ║
║   VkFramebuffer              ← (classic API only) binds all views above     ║
║                                                                              ║
║  [OFFSCREEN]  (for embedded panels e.g. ImGui viewports)                     ║
║   VkImage (offscreen color)  ← render output, sampled by UI                 ║
║   VkImageView (offscreen)    ← passed to ImGui as texture                   ║
║   VkFramebuffer              ← points to offscreen image                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║  ██████  PER-FRAME-IN-FLIGHT  ██████  (N copies, usually N=2 or 3)          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  (these exist per-viewport × per-frame-in-flight)                           ║
║                                                                              ║
║   VkCommandPool              ← one per thread per queue family              ║
║   VkCommandBuffer            ← recorded fresh every frame                   ║
║   VkSemaphore (image ready)  ← GPU: swapchain image acquired signal         ║
║   VkSemaphore (render done)  ← GPU: rendering finished signal               ║
║   VkFence     (frame done)   ← CPU: wait before reusing this frame slot     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║  ██████  PER-OBJECT  ██████  (one copy per entity / material instance)      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   VkBuffer (UBO)             ← per-object transform, material params        ║
║   VkDeviceMemory             ← backing memory for UBO                       ║
║   VkDescriptorSet            ← binds UBO + texture + sampler for THIS obj   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════════╗
║  ██████  PER-CAMERA / PER-VIEWPORT-STATE  ██████                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   VkBuffer (camera UBO)      ← view/proj matrix per camera                  ║
║   VkDescriptorSet (camera)   ← binds the camera UBO                        ║
║   Viewport + Scissor         ← dynamic state, set at record time            ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════
  QUICK REFERENCE MATRIX
═══════════════════════════════════════════════════════════════════════════════

  Resource               │ Shared │ Per-Viewport │ Per-Frame │ Per-Object
  ───────────────────────┼────────┼──────────────┼───────────┼───────────
  VkInstance             │   ✓    │              │           │
  VkDevice               │   ✓    │              │           │
  VkQueue                │   ✓    │              │           │
  VkPipeline             │   ✓    │              │           │
  VkPipelineLayout       │   ✓    │              │           │
  VkDescriptorSetLayout  │   ✓    │              │           │
  VkDescriptorPool       │   ✓    │              │           │
  VkSampler              │   ✓    │              │           │
  VkBuffer (mesh)        │   ✓    │              │           │
  VkImage (texture)      │   ✓    │              │           │
  VkSurfaceKHR           │        │      ✓        │           │
  VkSwapchainKHR         │        │      ✓        │           │
  VkImage (swap/depth)   │        │      ✓        │           │
  VkImageView (swap)     │        │      ✓        │           │
  VkFramebuffer          │        │      ✓        │           │
  VkCommandBuffer        │        │      ✓        │     ✓     │
  VkSemaphore            │        │      ✓        │     ✓     │
  VkFence                │        │      ✓        │     ✓     │
  VkBuffer (camera UBO)  │        │      ✓        │           │
  VkDescriptorSet (cam)  │        │      ✓        │           │
  VkBuffer (object UBO)  │        │              │           │     ✓
  VkDescriptorSet (obj)  │        │              │           │     ✓
```


## MULTI-VIEWPORT RESOURCE SHARING STRATEGY


```txt
╔══════════════════════════════════════════════════════════════════════════════════════╗
║              MULTI-VIEWPORT RESOURCE SHARING STRATEGY                              ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  THE CORE PRINCIPLE:
  ═══════════════════
  GPU memory is FLAT. A VkBuffer or VkImage doesn't "belong" to a window.
  Windows only own the FINAL OUTPUT SURFACE. Everything else is shared.


╔══════════════════════════════════════════════════════════════════════════════════════╗
║  SHARED (created ONCE, used by ALL viewports)                                      ║
║                                                                                    ║
║   ┌────────────┐  ┌─────────────┐  ┌────────────┐  ┌──────────────────────────┐   ║
║   │  VkDevice  │  │   VkQueue   │  │ VkSampler  │  │  VkDescriptorSetLayout   │   ║
║   └────────────┘  └─────────────┘  └────────────┘  └──────────────────────────┘   ║
║                                                                                    ║
║   MESH ASSETS                  TEXTURE ASSETS             PIPELINES                ║
║   ┌──────────────────┐         ┌──────────────────┐       ┌──────────────────┐     ║
║   │ VkBuffer(vertex) │         │ VkImage          │       │ VkPipeline       │     ║
║   │ VkBuffer(index)  │         │ VkImageView      │       │ (opaque)         │     ║
║   │ VkDeviceMemory   │         │ VkDeviceMemory   │       ├──────────────────┤     ║
║   └──────────────────┘         └──────────────────┘       │ VkPipeline       │     ║
║          ▲  ▲  ▲                     ▲  ▲  ▲              │ (wireframe)      │     ║
║          │  │  │                     │  │  │              ├──────────────────┤     ║
║          │  │  └─────────────────────┘  │  │              │ VkPipeline       │     ║
║          │  └────────────────────────────┘  │              │ (unlit/preview)  │     ║
║          └───────────────────────────────────┘              └──────────────────┘     ║
║                        referenced by ALL viewports                                 ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

          │                    │                    │                    │
          ▼                    ▼                    ▼                    ▼

╔═══════════════╗   ╔═══════════════╗   ╔═══════════════╗   ╔═══════════════════╗
║  GAME VIEW    ║   ║  SCENE VIEW   ║   ║ MODEL PREVIEW ║   ║  MATERIAL PREV.  ║
║               ║   ║               ║   ║               ║   ║                  ║
║ VkSurface     ║   ║ VkSurface     ║   ║ VkSurface     ║   ║ VkSurface        ║
║ VkSwapchain   ║   ║ VkSwapchain   ║   ║ VkSwapchain   ║   ║ VkSwapchain      ║
║ SwapImages    ║   ║ SwapImages    ║   ║ SwapImages    ║   ║ SwapImages       ║
║ DepthBuffer   ║   ║ DepthBuffer   ║   ║ DepthBuffer   ║   ║ DepthBuffer      ║
║               ║   ║               ║   ║               ║   ║                  ║
║ ColorTarget   ║   ║ ColorTarget   ║   ║ ColorTarget   ║   ║ ColorTarget      ║
║ (MSAA buf)    ║   ║ (MSAA buf)    ║   ║ (MSAA buf)    ║   ║ (MSAA buf)       ║
║               ║   ║               ║   ║               ║   ║                  ║
║ CmdBuffer[0]  ║   ║ CmdBuffer[0]  ║   ║ CmdBuffer[0]  ║   ║ CmdBuffer[0]     ║
║ CmdBuffer[1]  ║   ║ CmdBuffer[1]  ║   ║ CmdBuffer[1]  ║   ║ CmdBuffer[1]     ║
║               ║   ║               ║   ║               ║   ║                  ║
║ Semaphore x2  ║   ║ Semaphore x2  ║   ║ Semaphore x2  ║   ║ Semaphore x2     ║
║ Fence x2      ║   ║ Fence x2      ║   ║ Fence x2      ║   ║ Fence x2         ║
╚═══════════════╝   ╚═══════════════╝   ╚═══════════════╝   ╚═══════════════════╝


╔══════════════════════════════════════════════════════════════════════════════════════╗
║  PER-VIEWPORT STATE  (what differs between viewports for the SAME object)          ║
║                                                                                    ║
║  GAME VIEW           SCENE VIEW            MODEL PREVIEW                           ║
║  ───────────         ──────────            ─────────────                           ║
║  Camera UBO A        Camera UBO B          Camera UBO C                            ║
║  (game cam)          (editor free cam)     (orbit cam)                             ║
║                                                                                    ║
║  VkDescriptorSet A   VkDescriptorSet B     VkDescriptorSet C                       ║
║  └─ points to        └─ points to          └─ points to                            ║
║     Camera UBO A        Camera UBO B          Camera UBO C                         ║
║     same mesh buf ◄─────same mesh buf ◄───────same mesh buf                        ║
║     same texture  ◄─────same texture  ◄───────same texture                         ║
║                                                                                    ║
║  Pipeline: opaque    Pipeline: wireframe   Pipeline: unlit/preview                 ║
╚══════════════════════════════════════════════════════════════════════════════════════╝


╔══════════════════════════════════════════════════════════════════════════════════════╗
║  FRAME RENDER LOOP with multiple viewports                                         ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  each frame:
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │  for each viewport:                                                 │
  │    1. vkAcquireNextImageKHR(viewport.swapchain)  ← per viewport     │
  │    2. begin CommandBuffer                         ← per viewport     │
  │    3. begin RenderPass / vkCmdBeginRendering      ← per viewport     │
  │    4. bind VkPipeline           ◄── SHARED                          │
  │    5. bind DescriptorSet        ◄── per viewport (diff camera UBO)  │
  │    6. bind vertex/index buffers ◄── SHARED                          │
  │    7. vkCmdDraw()                                                   │
  │    8. end RenderPass                                                │
  │    9. end CommandBuffer                                             │
  │   10. vkQueueSubmit()                             ← per viewport     │
  │   11. vkQueuePresentKHR()                         ← per viewport     │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════════════════════╗
║  OFFSCREEN VIEWPORTS (embedded in UI / ImGui panels)  ← RECOMMENDED for editors   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

  Instead of multiple OS windows + swapchains, render into offscreen VkImages
  and display them as ImGui textures. This is how Unity/Unreal editor actually works.

  ┌────────────────────────────────────────────────────────────────────────────┐
  │  ONE main OS window + swapchain                                            │
  │  ┌──────────────────────────────────────────────────────────────────────┐  │
  │  │  ImGui docking layout                                                │  │
  │  │  ┌───────────────────┐  ┌───────────────────┐  ┌─────────────────┐  │  │
  │  │  │   GAME VIEW       │  │   SCENE VIEW      │  │  MODEL PREVIEW  │  │  │
  │  │  │                   │  │                   │  │                 │  │  │
  │  │  │  [ImGui::Image]   │  │  [ImGui::Image]   │  │ [ImGui::Image]  │  │  │
  │  │  │   ▲               │  │   ▲               │  │  ▲              │  │  │
  │  │  └───┼───────────────┘  └───┼───────────────┘  └──┼─────────────┘  │  │
  │  └──────┼────────────────────── ┼──────────────────────┼───────────────┘  │
  └─────────┼─────────────────────── ┼──────────────────────┼──────────────────┘
            │                        │                       │
            ▼                        ▼                       ▼
   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   │ Offscreen pass  │    │ Offscreen pass  │    │ Offscreen pass  │
   │                 │    │                 │    │                 │
   │ VkFramebuffer   │    │ VkFramebuffer   │    │ VkFramebuffer   │
   │  └ VkImageView  │    │  └ VkImageView  │    │  └ VkImageView  │
   │     └ VkImage ──┼────┼──► ImGui tex    │    │     └ VkImage   │
   │ VkRenderPass    │    │ VkRenderPass    │    │ VkRenderPass    │
   │ DepthBuffer     │    │ DepthBuffer     │    │ DepthBuffer     │
   └─────────────────┘    └─────────────────┘    └─────────────────┘
   Camera UBO (game)      Camera UBO (editor)     Camera UBO (orbit)
   Pipeline: opaque       Pipeline: wireframe      Pipeline: unlit


  ADVANTAGES of offscreen approach:
  ✓ One swapchain total (much simpler sync)
  ✓ Resize each panel independently without swapchain recreation
  ✓ Easy to composite, add post-FX per viewport
  ✓ Standard approach in all major editors
```

The key insight to remember: **GPU resources are just memory addresses**. A `VkBuffer` with your mesh has no idea how many cameras are looking at it, or into which window the result goes. You simply reference it from as many draw calls as you want, in as many command buffers as you want, in the same frame.

Would you like me to go deeper on the **offscreen render target setup** in Ash/Rust, or on how to structure the **per-viewport descriptor sets** for the camera UBO?


## MESH WITH MULTIPLE SUB-MESHES / MATERIALS

Great point. Let me break this down properly before the diagram.

**A sub-mesh = a range of indices within the same index buffer, with its own material.** So the geometry data is still ONE buffer, but you issue multiple draw calls, each with a different material/pipeline.

```txt
╔══════════════════════════════════════════════════════════════════════════════╗
║              MESH WITH MULTIPLE SUB-MESHES / MATERIALS                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

  GEOMETRY (still ONE buffer, shared)
  ════════════════════════════════════════════════════════════════════════════

  VkBuffer (vertex)  [ pos|norm|uv|pos|norm|uv|pos|norm|uv|pos|norm|uv ... ]
                       ▲                                                    ▲
                       └────────────── all vertices, all sub-meshes ────────┘

  VkBuffer (index)   [ 0,1,2, 0,2,3, | 4,5,6, 4,6,7, | 8,9,10, 8,10,11 ... ]
                       ▲─────────────▲ ▲─────────────▲ ▲────────────────▲
                       sub-mesh 0      sub-mesh 1       sub-mesh 2
                       (metal body)    (glass window)   (rubber tire)


  INDEX BUFFER LAYOUT (what Vulkan sees)
  ════════════════════════════════════════════════════════════════════════════

  offset:  0          500        900        1200
           │          │          │          │
           ▼          ▼          ▼          ▼
  [ ███████████████ | ██████████ | █████████ ]
    sub-mesh 0        sub-mesh 1   sub-mesh 2
    indexCount=500    count=400    count=300

  each sub-mesh is just:  { first_index: u32, index_count: u32 }
  you pass these into:    vkCmdDrawIndexed(cmd, index_count, 1, first_index, 0, 0)


╔══════════════════════════════════════════════════════════════════════════════╗
║  PER SUB-MESH: what changes vs what stays the same                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

                        sub-mesh 0      sub-mesh 1      sub-mesh 2
                        (metal body)    (glass)         (rubber tire)
                        ────────────    ───────────     ─────────────

  VkBuffer (vertex)       SAME ──────────SAME ──────────SAME
  VkBuffer (index)        SAME ──────────SAME ──────────SAME
  first_index             0              500             900
  index_count             500            400             300

  VkPipeline              opaque         transparent     opaque
                          ↑ same         ↑ DIFFERENT     ↑ same as 0

  VkImage (albedo)        metal_d.png    glass_d.png     rubber_d.png
  VkImage (normal)        metal_n.png    glass_n.png     rubber_n.png
  VkImage (roughness)     metal_r.png    glass_r.png     rubber_r.png
  VkDescriptorSet         mat_A          mat_B           mat_C
                          ↑ DIFFERENT    ↑ DIFFERENT     ↑ DIFFERENT


╔══════════════════════════════════════════════════════════════════════════════╗
║  COMMAND BUFFER RECORDING for one mesh, 3 sub-meshes                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

  vkCmdBindVertexBuffers(cmd, 0, 1, &vertex_buffer, &[0])   ← bind ONCE
  vkCmdBindIndexBuffer(cmd, index_buffer, 0, INDEX_TYPE)    ← bind ONCE

  // sub-mesh 0 — metal body
  vkCmdBindPipeline(cmd, GRAPHICS, pipeline_opaque)
  vkCmdBindDescriptorSets(cmd, ..., &[camera_set, material_set_A])
  vkCmdDrawIndexed(cmd, 500, 1, 0,   0, 0)

  // sub-mesh 1 — glass (different pipeline!)
  vkCmdBindPipeline(cmd, GRAPHICS, pipeline_transparent)
  vkCmdBindDescriptorSets(cmd, ..., &[camera_set, material_set_B])
  vkCmdDrawIndexed(cmd, 400, 1, 500, 0, 0)

  // sub-mesh 2 — rubber tire
  vkCmdBindPipeline(cmd, GRAPHICS, pipeline_opaque)         ← rebind if changed
  vkCmdBindDescriptorSets(cmd, ..., &[camera_set, material_set_C])
  vkCmdDrawIndexed(cmd, 300, 1, 900, 0, 0)


╔══════════════════════════════════════════════════════════════════════════════╗
║  MULTI-PASS (different from sub-mesh)                                       ║
║  same geometry rendered MULTIPLE TIMES in different render passes            ║
╚══════════════════════════════════════════════════════════════════════════════╝

  Examples:
  ─────────
  Shadow Pass     → render mesh with depth-only pipeline → shadow map
  G-Buffer Pass   → render mesh with gbuffer pipeline    → deferred targets
  Forward Pass    → render mesh with lit pipeline        → color target
  Outline Pass    → render mesh scaled up, front-face cull, solid color

  PASS 0: Shadow
  ┌────────────────────────────────────────────────────────────┐
  │ vkCmdBeginRendering(shadow_attachment)                     │
  │   bind pipeline_shadow   (depth only, no frag shader)      │
  │   bind descriptor_set    (object transform only)           │
  │   vkCmdDrawIndexed(...)  all sub-meshes in one shot        │
  │ vkCmdEndRendering()                                        │
  └────────────────────────────────────────────────────────────┘
           │
           ▼ pipeline barrier (shadow map → shader read)
           │
  PASS 1: G-Buffer
  ┌────────────────────────────────────────────────────────────┐
  │ vkCmdBeginRendering(gbuffer_attachments)                   │
  │   for each sub-mesh:                                       │
  │     bind pipeline_gbuffer                                  │
  │     bind material descriptor set (textures per sub-mesh)   │
  │     vkCmdDrawIndexed(first_index, count)                   │
  └────────────────────────────────────────────────────────────┘
           │
           ▼ pipeline barrier
           │
  PASS 2: Lighting / Composition
  ┌────────────────────────────────────────────────────────────┐
  │ vkCmdBeginRendering(color_attachment)                      │
  │   bind pipeline_lighting                                   │
  │   bind gbuffer textures + shadow map as inputs             │
  │   vkCmdDraw(3, 1, 0, 0)  ← fullscreen triangle, no mesh   │
  └────────────────────────────────────────────────────────────┘


╔══════════════════════════════════════════════════════════════════════════════╗
║  UPDATED RESOURCE OWNERSHIP for a multi-material mesh                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

  MESH ENTITY
  ├── [SHARED - once per mesh]
  │     VkBuffer (vertex)
  │     VkBuffer (index)
  │     VkDeviceMemory
  │
  └── [PER SUB-MESH]
        SubMesh 0
        ├── first_index: u32         ← just a number, no Vk object
        ├── index_count: u32         ← just a number, no Vk object
        └── MaterialHandle → Material A
              ├── VkImage (albedo, normal, roughness...)
              ├── VkImageView x N
              ├── VkDeviceMemory
              ├── VkDescriptorSet   ← binds all textures for this material
              └── VkPipeline ref    ← opaque / transparent / etc.

        SubMesh 1
        ├── first_index: u32
        ├── index_count: u32
        └── MaterialHandle → Material B
              └── ... own textures, own VkDescriptorSet

        SubMesh 2
        └── MaterialHandle → Material C
              └── ...


╔══════════════════════════════════════════════════════════════════════════════╗
║  KEY RULES TO REMEMBER                                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

  ✓  Vertex + Index buffer    → shared across ALL sub-meshes of a mesh
  ✓  Sub-mesh boundary        → just an (first_index, count) pair, no Vk object
  ✓  Material / DescriptorSet → one per sub-mesh (or shared if same material)
  ✓  Pipeline                 → one per render mode, shared across many objects
  ✓  Multi-pass               → same buffers re-bound, different pipeline+attachment
  ✓  Transparent sub-meshes   → must be sorted and drawn in a separate pass
  ✗  Never create a new VkBuffer per sub-mesh — that defeats the purpose
```

The short version: **sub-meshes cost you almost nothing in Vulkan terms** — just an offset and a count. What actually multiplies is `VkDescriptorSet` (one per material) and draw calls. This is why **material batching and bindless rendering** become important as object counts grow — but that's a topic for another day if you want to go there.