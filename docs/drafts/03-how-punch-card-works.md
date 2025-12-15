---
title: Máy tính đục lỗ - punch card
creation date: 2025-12-09T01:26:00
slug: post-03
series: computer-hardwares
excerpt: Cách máy tính đục lỗ - punch card hoạt động.
lang: vn
cover img: https://twobithistory.org/images/ibm029_front.jpg
tags:
  - hardware
---

# Mở bài
Trước khi đi vào cách một máy tính đục lỗ hoạt động ra sao, ta cần phải tìm hiểu xem nguồn gốc của punched card(thẻ đục lỗ) có từ đâu.




[How a "punch card" weaving machine, invented by Joseph Jacquard in 1801, worked - YouTube](https://www.youtube.com/watch?v=qG-OXlIQgZo)

![Cách sử dụng máy tính thẻ đục lỗ](https://www.youtube.com/watch?v=UiVAq3nwD0M)

```mermaid
flowchart LR
    A[Người vận hành] --> B[Đục lỗ dữ liệu<br/>Punch Card]
    B --> C[Card Reader<br/>Đọc thẻ]
    C --> D[Giải mã lỗ đục<br/>Bit / Ký tự]
    D --> E[Control Unit<br/>Đơn vị điều khiển]
    E --> F[Processing Unit<br/>Xử lý tính toán]
    F --> G[Memory cơ học<br/>hoặc Relay]
    G --> E
    F --> H[Output Unit<br/>Xuất kết quả]
    H --> I[In ra giấy<br/>hoặc Punch Card mới]

```


```mermaid
flowchart LR
    Operator e1@--> PunchCard
    PunchCard e2@--> CardReader
    CardReader e3@--> Decoder
    Decoder e4@--> ControlUnit
    ControlUnit e5@--> ProcessingUnit
    ProcessingUnit e6@--> Memory
    Memory e7@--> ControlUnit
    ProcessingUnit e8@--> OutputUnit
    OutputUnit e9@--> Operator

    e1@{ animate: true }
    e2@{ animate: true }
    e3@{ animate: true }
    e4@{ animate: true }
    e5@{ animate: true }
    e6@{ animate: true }
    e7@{ animate: true }
    e8@{ animate: true }
    e9@{ animate: true }

```


[The Virtual Keypunch – Make Your Personal Punch Card](https://www.masswerk.at/keypunch/)
