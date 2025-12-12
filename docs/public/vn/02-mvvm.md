---
title: 2 - Kiến trúc MVVM
creation date: 2025-12-12T03:26:00
slug: post-02
excerpt: MVVM là gì ? Cách sử dụng MVVM.
lang: vn
cover img: https://media.licdn.com/dms/image/v2/D5612AQHu70XCF6vjYg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1697751716765?e=1767225600&v=beta&t=vFxwh802jCamIg0MXayY5ZIfpVF-HKaoTkyD-IWFX84
tags:
  - y2025
  - architectural_pattern
---

# Lịch sử hình thành

Trước MVVM, cộng đồng .NET chủ yếu dùng:
- **MVC (Model–View–Controller)**
- **MVP (Model–View–Presenter)**

Khi Microsoft chuẩn bị phát hành **WPF (Windows Presentation Foundation)** – một framework UI mới dùng XAML, họ cần một mô hình gắn UI declarative (XAML) với code “logic” sao cho:

- Hỗ trợ **data binding** mạnh
- Tách biệt UI và logic  → Dễ test, dễ bảo trì
- Tận dụng `Command, INotifyPropertyChanged, DependencyProperty`
    
MVC/MVP không tận dụng được triệt để các tính năng này → cần một kiến trúc mới.

**John Gossman**, kiến trúc sư của Microsoft, là người **đề xuất MVVM** vào năm **2005** trong bối cảnh phát triển WPF.


**Kết luận**
MVVM ra đời với vai trò như một giải pháp mới để:
> - tận dụng tối đa các tính năng mà C# đang có tại thời điểm đó, thứ mà các kiến trúc trước đó chưa làm được.
> - Chia nhỏ việc phát triển một tính năng cho các thành viên dự án(Dev, Design, Tester,...)
> - Khi việc chia nhỏ diễn ra thuận lợi, đây sẽ là tiền đề để một dự án như WPF tiếp tục mở rộng và thêm mới tính năng.



# Cấu tạo
___

$$
MVVM = Model + View + ViewModel
$$
**Model**

```img_compare
- [txt1](docs/shared/mvvm_icon)
```
# Tài liệu tham khảo
- [Model–view–viewmodel - Wikipedia](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [Patterns - WPF Apps With The Model-View-ViewModel Design Pattern \| Microsoft Learn](https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/patterns-wpf-apps-with-the-model-view-viewmodel-design-pattern)
- [Introduction to MVC and MVVM patterns with JavaScript](https://www.linkedin.com/pulse/introduction-mvc-mvvm-patterns-javascript-bilal-sevinc-zqcfc/)
- 