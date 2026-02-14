---
title: Test Post Rendering
creation date: 2025-12-08T01:26:00
last edited: 2026-02-15T05:05:00
slug: post-00
series: debug
excerpt: Test Post Rendering from markdown to HTML.
lang: en
cover img: https://i.pinimg.com/originals/82/71/47/82714763ab84910774a889d31ca8e4c1.gif
tags:
  - test
---

## Image Compare

```img_compare
- [txt 1](https://i.pinimg.com/736x/e2/0e/a0/e20ea012621fe94bf9d23612230c0e2c.jpg)
- [txt 2](https://i.pinimg.com/736x/85/be/f9/85bef94fc6080269ca9345737a5aa16e.jpg)
```

## Mermaid
```mermaid
erDiagram

CUSTOMER ||--o{ ORDER : places

ORDER ||--|{ ORDER_ITEM : contains

PRODUCT ||--o{ ORDER_ITEM : includes

CUSTOMER {

string id

string name

string email

}

ORDER {

string id

date orderDate

string status

}

PRODUCT {

string id

string name

float price

}

ORDER_ITEM {

int quantity

float price

}
```
## link video

![youtube link cham than](https://www.youtube.com/watch?v=QfdT9U9p0cU&list=RDMMQfdT9U9p0cU&start_radio=1)


## Gif

| ![Gif 1](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzIzcG41d3Z4Y2diZ3BmNTJma2o3azJuaGQ5OGM1Y2o3M3oxaGg0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif) | ![Gif 1](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzIzcG41d3Z4Y2diZ3BmNTJma2o3azJuaGQ5OGM1Y2o3M3oxaGg0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif) |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

![Gif link](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzIzcG41d3Z4Y2diZ3BmNTJma2o3azJuaGQ5OGM1Y2o3M3oxaGg0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif)




## code block
```cs
class Conga
{
	public int x;
	public Vector3 pos;
}
```

## code block overflow
```cs
class Conga
{
	public int x;
	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos;
}
```
## Inline code
this is `inline code` block.
this is `inline code` block.
this is `inline code` block.
# math inline
This is a formula: $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$used for something ... bla bla
## Math block

$$
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
$$

## Table
| Month    | Savings |
| -------- | ------- |
| January  | $250    |
| February | $80     |
| March    | $420    |
## Table overflow

| Item              | In Stock | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price |
| :---------------- | :------: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: |
| Python Hat        |   True   | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 |
| SQL Hat           |   True   | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 |
| Codecademy Tee    |  False   | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 |
| Codecademy Hoodie |  False   | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 |


## Image

![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg)


| ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
|                                                                                       |                                                                                       | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |                                                                                       |                                                                                       |
| ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |                                                                                       |                                                                                       |                                                                                       |                                                                                       | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |


## Divider
---
---

# H1
## H2
### H3

#### H4

##### H5
###### H6 
```callout
[!NOTE]
a note
```

```callout
[!CAUTION]
a note
```


```callout
[!WARNING]
a note
```


## Formats

normal text. This is normal 

Special characters: ! @ # $ % ^ & * ( ) - _ = + \ | { } ; : , . < > / ?

- list
- list
	- sub-list1
	- sub-list1
		- sub-2
		- sub-2
			- sub-3
				- das
				- sub4

- [ ] check box
- [x] checked box 
- [ ] list check box
	- [ ] list check box
	- [x] list check box
		- [x] list check box
		- [ ] list check box
			- [ ] list check box
			- [x] list check box

## number list
1. one
2. two
3. three
	1. one
	2. two
	3. three
		1. four
		2. five

- "adsadsd"
- *italic*
- **Bold**
- <u>underline</u>
- ~~slash~~
- <font color="#4f81bd">Coloring text 1</font> 
- <font color="#e36c09">Coloring text 2</font>  <font color="#31859b">Coloring text 1</font> 
- <span style="background:#40a9ff">Highlight Text</span>
- <span style="background:#d2cbff">Highlight Text 2</span> normal text <span style="background:#ff4d4f">Highlight text 3</span>


<center>Center Alignment Text</center>

<p align="right">Right ALignment</p>


# Toggle
<details>
<summary>Click me !</summary>


## Image Compare

```img_compare
- [txt 1](https://i.pinimg.com/736x/e2/0e/a0/e20ea012621fe94bf9d23612230c0e2c.jpg)
- [txt 2](https://i.pinimg.com/736x/85/be/f9/85bef94fc6080269ca9345737a5aa16e.jpg)
```

## Mermaid
```mermaid
erDiagram

CUSTOMER ||--o{ ORDER : places

ORDER ||--|{ ORDER_ITEM : contains

PRODUCT ||--o{ ORDER_ITEM : includes

CUSTOMER {

string id

string name

string email

}

ORDER {

string id

date orderDate

string status

}

PRODUCT {

string id

string name

float price

}

ORDER_ITEM {

int quantity

float price

}
```
## link video

![youtube link cham than](https://www.youtube.com/watch?v=QfdT9U9p0cU&list=RDMMQfdT9U9p0cU&start_radio=1)


## Gif

| ![Gif 1](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzIzcG41d3Z4Y2diZ3BmNTJma2o3azJuaGQ5OGM1Y2o3M3oxaGg0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif) | ![Gif 1](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzIzcG41d3Z4Y2diZ3BmNTJma2o3azJuaGQ5OGM1Y2o3M3oxaGg0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif) |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

![Gif link](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzIzcG41d3Z4Y2diZ3BmNTJma2o3azJuaGQ5OGM1Y2o3M3oxaGg0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif)

## code block
```cs
class Conga
{
	public int x;
	public Vector3 pos;
}
```

## code block overflow
```cs
class Conga
{
	public int x;
	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos; 	public Vector3 pos;
}
```
## Inline code
this is `inline code` block.
this is `inline code` block.
this is `inline code` block.
# math inline
This is a formula: $$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$used for something ... bla bla
## Math block

$$
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
$$

## Table
| Month    | Savings |
| -------- | ------- |
| January  | $250    |
| February | $80     |
| March    | $420    |
## Table overflow

| Item              | In Stock | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price | Price |
| :---------------- | :------: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: | ----: |
| Python Hat        |   True   | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 |
| SQL Hat           |   True   | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 | 23.99 |
| Codecademy Tee    |  False   | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 | 19.99 |
| Codecademy Hoodie |  False   | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 | 42.99 |


## Image

![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg)


| ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
|                                                                                       |                                                                                       | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |                                                                                       |                                                                                       |
| ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |                                                                                       |                                                                                       |                                                                                       |                                                                                       | ![texture 1](https://i.pinimg.com/736x/6c/1c/0b/6c1c0bb31b77baf726b3b21186f3a280.jpg) |


## Divider
---
---

# H1
## H2
### H3

#### H4

##### H5
###### H6 
```callout
[!NOTE]
a note
```

```callout
[!CAUTION]
a note
```


```callout
[!WARNING]
a note
```


## Formats

normal text. This is normal 

Special characters: ! @ # $ % ^ & * ( ) - _ = + \ | { } ; : , . < > / ?

- list
- list
	- sub-list1
	- sub-list1
		- sub-2
		- sub-2
			- sub-3
				- das
				- sub4

- [ ] check box
- [x] checked box 
- [ ] list check box
	- [ ] list check box
	- [x] list check box
		- [x] list check box
		- [ ] list check box
			- [ ] list check box
			- [x] list check box

## number list
1. one
2. two
3. three
	1. one
	2. two
	3. three
		1. four
		2. five

- "adsadsd"
- *italic*
- **Bold**
- <u>underline</u>
- ~~slash~~
- <font color="#4f81bd">Coloring text 1</font> 
- <font color="#e36c09">Coloring text 2</font>  <font color="#31859b">Coloring text 1</font> 
- <span style="background:#40a9ff">Highlight Text</span>
- <span style="background:#d2cbff">Highlight Text 2</span> normal text <span style="background:#ff4d4f">Highlight text 3</span>


<center>Center Alignment Text</center>

<p align="right">Right ALignment</p>


</details>
