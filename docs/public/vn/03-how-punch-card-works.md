---
title: Máy tính đục lỗ - punch card
creation date: 2025-12-13T05:56:00
slug: post-03
series: computer-hardwares
excerpt: Cách máy tính đục lỗ - punch card hoạt động.
lang: vn
cover img: https://twobithistory.org/images/ibm029_front.jpg
tags:
  - hardware
---

# Nguồn gốc
Trước khi đi vào cách một máy tính đục lỗ hoạt động ra sao, ta cần phải tìm hiểu xem nguồn gốc của punched card(thẻ đục lỗ) có từ đâu.

Ứng dụng cơ khi đầu tiên của thẻ đục lỗ có từ năm 1804, đó là phát minh máy dệt của [Jacquard machine - Wikipedia](https://en.wikipedia.org/wiki/Jacquard_machine).

## Cách hoạt động của máy dệt Jacquard

| ![các thẻ dệt của máy](https://github.com/hoangcuongzk1/hoangcuongzk1.github.io/blob/main/docs/shared/post-03/punch_card_weaving_machine.gif?raw=true) | ![các sợi được đan theo nhiều hàng khác nhau](https://github.com/hoangcuongzk1/hoangcuongzk1.github.io/blob/main/docs/shared/post-03/visual_weaving_machine.gif?raw=true) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
Mỗi thẻ đại diện cho **1 hàng dệt**.

```mermaid
flowchart LR

Card["Thẻ Jacquard<br/>(1 hàng dệt)"]

Card e1@-->|Đọc thẻ| HoleCheck{"kiểm tra lỗ"}

%% Nhánh CÓ LỖ
HoleCheck e2@-->|Có lỗ| NeedlePass["Kim xuyên qua"]
NeedlePass e3@-->|Kéo| HookPull["Móc được kéo"]
HookPull e4@-->|Nâng| ThreadUp["Sợi được nâng"]

%% Nhánh KHÔNG LỖ
HoleCheck e5@-->|Không lỗ| NeedleBlock["Kim bị chặn"]
NeedleBlock e6@-->|Giữ nguyên| ThreadDown["Sợi không nâng"]

%% Animate points (giống ví dụ của bạn)
e1@{animate: true}
e2@{animate: true}
e3@{animate: true}
e4@{animate: true}
e5@{animate: true}
e6@{animate: true}

```




![Cách sử dụng máy tính thẻ đục lỗ](https://www.youtube.com/watch?v=UiVAq3nwD0M)

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

- [Jacquard machine - Wikipedia](https://en.wikipedia.org/wiki/Jacquard_machine)
- [Binary and the Jacquard Mechanism - demonstration - YouTube](https://www.youtube.com/watch?v=pzYucg3Tmho&t=183s)
