---
title: Rust đại cương
creation date: 2026-01-01T05:30:00
slug: post-6
series: rust
excerpt: Các kiến thức cơ bản của ngôn ngữ Rust.
lang: vn
cover img: https://locusit.com/wp-content/uploads/2024/08/rust-vs-cplusplus-about-rust.jpg
tags:
  - 🦀rust
---
## Mở bài
Lần đầu tiên tôi biết tới Rust là vào năm 2021, khi đó tôi đang học hỏi về ECS của Unity. Thời điểm đó, ECS của Unity vẫn chưa hoàn thiện hoàn toàn, còn rất nhiều vấn đề khi làm việc, quản lý data giữa các luồng song song. Và tình cờ, trong một lần lang thang, và tôi biết tới Rust. Một ngôn ngữ rất phù hợp với kiến trúc ECS.

Sau đó thì tôi cũng chỉ dừng lại ở mức hiểu cơ bản những điểm thú vị của Rust như:
- ownership
- move
- `option<T>`
- không kế thừa
- ...

Sau khi tìm hiểu sơ xài là vậy, có rất nhiều triết lý hay ho, nhưng tại thời điểm đó tôi chỉ tham khảo và sử dụng `Option<T>` được mà thôi.
Tôi đã tạo một code convention lấy ý tưởng từ `Option<T>` trong C# dưới các dạng như sau:

1. **dạng `try_get`** 
```cs
bool try_get(int hash, out int output)
{
	output = -1;
	if(something_wrong()) return false;
	output = true_value_here();
	return true;
}
```

Thực ra cú pháp `try_get` khá là quen thuộc trong C, C++, C#. Nhưng điều thú vị nhất mà `Option<T>` truyền cảm hứng cho tôi là ta có thể nhận về nhiều thông tin hơn thế, không chỉ là `TRUE/FALSE`.

2. **Trả về giá trị kèm mô tả**
```cs
struct Option<T, TMessage>
{
	private T        _value;
	private TMessage _message;
	private bool     _value_is_valid;
	
	public TMessage Message => _message;
	
	public static implicit operator T   (Option<T, TMessage> option) => option._value;

	public static implicit operator bool(Option<T, TMessage> option) => option._value_is_valid;
	
	public Option(T val, TMessage message, bool valid)
	{
		_value          = val;
		_message        = message;
		_value_is_valid = valid;
	}
}


enum Message
{
	Succeed,
	PositiveNumber,
	NegativeNumber,
}

Option<int, Message> equal_zero(int someIntValue)
{
	if(someIntValue == 0) return new (someIntValue, Message.Succeed, true);
	
	if(someIntValue <  0) return new (someIntValue, Message.NegativeNumber, false);
	
	return new (someIntValue, Message.PositiveNumber, false);
}
```

Chà, cùng với một hàm, nhưng giờ đây tôi có thể nắm được nhiều thông tin hơn để phục vụ cho việc kiểm tra lỗi. Đây chính là điều tôi thích thú nhất khi khai thác cảm hứng từ `Option<T>` của Rust.

Nhưng nhiêu đây là chưa đủ để tận hưởng trọn vẹn mọi lợi ích từ các triết lý của Rust. Sức mạnh của Rust không chỉ tới từ các triết lý của ngôn ngữ. Mà yếu tố quan trọng hơn cả đó là trình biên dịch của Rust. Nên việc chuyển hoàn toàn sang Rust là điều cần thiết để phát huy toàn bộ sức mạnh mà Rust có.

Giờ tôi mới có thời gian để tập trung hoàn toàn vào việc học và hiểu Rust nhiều hơn.

