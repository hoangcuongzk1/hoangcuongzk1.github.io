---
title: Gia tăng hiệu suất làm việc cùng Terminal
creation date: 2026-01-01T22:25:00
slug: post-03
series: productivity
excerpt: Terminal là gì ? Một số ứng dụng thực tế sử dụng Terminal.
lang: vn
cover img: https://github.com/hoangcuongzk1/hoangcuongzk1.github.io/blob/main/docs/shared/post-03/my_terminal_preview.png?raw=true
tags:
  - productivity
---
## Mở bài


![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTY5NWc4aWQxOTF2bGJmZ2U0cmZlaDc2dTBoMTN4N3c4dDdhd21iYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kJ1iL1ZQIyibu/giphy.gif)

Chắc hẳn ai trong chúng ta cũng từng ít nhất một lần bị ấn tượng bởi các hacker nhảy múa trên bàn phím và nhìn vào màn hình toàn chữ là chữ.

Bản thân tôi cũng bị lôi cuốn và hấp dẫn bởi hình ảnh này khi bước chân vào nghề này. Nhưng trớ trêu thay, từ khi học lập trình tới giờ, rất ít khi tôi có cơ hội dành thời gian cho terminal. Thi thoảng chỉ dùng để cài đặt package mà thôi.

Gần đây tôi bắt đầu làm việc nhiều hơn với auto-build và tool. Và vì thế tôi bắt đầu làm việc nhiều hơn với terminal. 

Trong qúa trình làm việc cùng terminal, tôi nhận ra rằng: "Trời ! Giá mà mình dùng nó sớm hơn".

Lợi ích của terminal thì vô vàn, tuỳ vào ngữ cảnh đặc thù việc mà ta làm. Nhưng tôi khoái nhất là việc tôi không cần dùng tới chuột nữa. Thật nhanh chóng và tiện lợi.

Tôi không rõ các bạn có giống tôi không, nhưng tôi khá là lười dùng chuột. Giai đoạn đầu khi mới theo nghề thì tôi dùng nó rất thường xuyên, nhưng sau này khi đã thuộc lòng các `shortcut` của IDE rồi thì tôi không mấy khi dùng tới nó nữa.

Và tôi rất ghen tỵ với các lập trình viên backend, data analytics, .... Phần lớn công việc của họ là quan tâm tới `input/output` của data. Còn frontend thì phải test visual của phần mềm nữa, nên không tránh được việc sử dụng chuột. Còn họ có thể test phần lớn code đã viết thông qua `UnitTest`, rất chi là ... tuyệt vời ... hic hic 🫠. 

Dĩ nhiên nếu như project có:
- Visual, View template, ...
- Một bạn Designer ngồi chỉnh thông số thay vì Dev phải tự code tự làm Visual
- ...

sẵn rồi thì việc này cũng hạn chế lại phần nào 🙃. Có lẽ tôi nên chuyển qua làm backend 😂.

Thôi không dông dài nữa, nội dung bài viết này sẽ có 2 phần chính:
- Terminal đại cương
- Các ứng dụng trong thực tế
Và lưu ý: môi trường tôi sử dụng sẽ là **macOS - Zsh**.

---



## Terminal đại cương

### Terminal là gì?

Terminal (hay còn gọi là Command Line Interface - CLI) là giao diện dòng lệnh cho phép bạn giao tiếp với hệ điều hành bằng văn bản thay vì giao diện đồ họa (GUI).

### Tại sao cần dùng Terminal?

- **Hiệu quả**: Nhanh hơn nhiều so với GUI cho các tác vụ lặp đi lặp lại
- **Mạnh mẽ**: Truy cập đầy đủ tính năng hệ thống
- **Tự động hóa**: Viết script để tự động hóa công việc
- **Remote**: Điều khiển máy từ xa qua SSH
- **Lập trình**: Cần thiết cho development (Git, npm, pip, docker, v.v.)


---

### Cách sử dụng Terminal cơ bản

**Mở Terminal**

- **Cách 1**: `Cmd + Space` → gõ Terminal → Enter
- **Cách 2**: Applications → Utilities → Terminal

**Cấu trúc một lệnh**

```bash
command -options arguments
```

Ví dụ:

```bash
ls -la /Users/username/Documents
│  │   │
│  │   └─ Argument (đối số)
│  └─ Option (tùy chọn)
└─ Command (lệnh)
```

### Hệ thống file macOS
Điều quan trọng nhất khi làm việc với Terminal là ta phải luôn hình dung trong đầu là ta đang làm việc ở folder nào.

Việc này sẽ hơi khó một chút khi mới bắt đầu, nhưng không sao đâu, dần dần quen rồi thì trong đầu ta sẽ luôn có một UI visual như thể có UI File Explorer vậy.

Thông thường, terminal khi khởi động sẽ tự động xuất phát từ thư mục `user`.

```bash
/                    # Root (gốc của hệ thống)
├── Applications     # Ứng dụng
├── Users            # Thư mục người dùng
│   └── username     # 🌟 -> terminal mặc định thường sẽ bắt đầu từ đây
│       ├── Desktop
│       ├── Documents
│       ├── Downloads
│       └── ...
├── System          # File hệ thống macOS
└── Library         # Thư viện hệ thống
```

---
### Các Lệnh Cơ Bản 

#### Chuyển và xem thư mục

```bash
# Xem thư mục hiện tại
pwd

# Liệt kê file/folder
ls                  # Cơ bản
ls -l               # Chi tiết (long format)
ls -a               # Bao gồm file ẩn
ls -la              # Kết hợp cả hai
ls -lh              # Kích thước dễ đọc (human-readable)
ls -lt              # Sắp xếp theo thời gian
ls -lS              # Sắp xếp theo kích thước

# Chuyển thư mục làm việc
cd Documents        # Vào thư mục Documents
cd ..               # Lùi 1 cấp
cd ../..            # Lùi 2 cấp
cd ~                # Về home
cd /                # Về root
cd -                # Về thư mục trước đó
```

#### Thao tác với File và Folder

```bash
# Tạo mới
mkdir project              # Tạo folder
mkdir -p a/b/c             # Tạo nhiều cấp cùng lúc
touch file.txt             # Tạo file trống

# Copy
cp file.txt backup.txt     # Copy file
cp -r folder1 folder2      # Copy folder (-r = recursive)

# Di chuyển/Đổi tên
mv old.txt new.txt         # Đổi tên
mv file.txt ~/Desktop/     # Di chuyển

# Xóa
rm file.txt                # Xóa file
rm -r folder               # Xóa folder
rm -rf folder              # Xóa bắt buộc (cẩn thận!)
rmdir empty_folder         # Xóa folder trống

# Xem thông tin
stat file.txt              # Thông tin chi tiết
file image.jpg             # Kiểu file
du -sh folder              # Kích thước folder
```

####  Xem và Chỉnh Sửa File

```bash
# Xem nội dung
cat file.txt               # Xem toàn bộ
less file.txt              # Xem từng trang (q để thoát)
head file.txt              # 10 dòng đầu
head -n 20 file.txt        # 20 dòng đầu
tail file.txt              # 10 dòng cuối
tail -f log.txt            # Theo dõi file realtime (logs)

# Chỉnh sửa
nano file.txt              # Editor đơn giản (Ctrl+X để thoát)
vim file.txt               # Editor mạnh (i để insert, :wq để lưu)
open file.txt              # Mở bằng app mặc định
open -a "Visual Studio Code" file.txt  # Mở bằng app cụ thể
```


#### Keyboard Shortcuts

```bash
Ctrl + A        # Về đầu dòng
Ctrl + E        # Về cuối dòng
Ctrl + U        # Xóa từ con trỏ về đầu
Ctrl + K        # Xóa từ con trỏ đến cuối
Ctrl + W        # Xóa 1 từ trước con trỏ
Ctrl + L        # Clear screen (= lệnh clear)
Ctrl + R        # Tìm trong history (gõ để tìm)
Ctrl + C        # Cancel lệnh
Ctrl + D        # Exit shell
Ctrl + Z        # Suspend process
!!              # Lệnh trước đó
!$              # Argument cuối của lệnh trước
```


---

### Các lệnh trung cấp

#### Wildcards (Ký tự đại diện)

```bash
*           # Đại diện cho bất kỳ ký tự nào
?           # Đại diện cho 1 ký tự
[]          # Tập hợp ký tự

# Ví dụ
ls *.txt           # Tất cả file .txt
ls file?.txt       # file1.txt, fileA.txt, v.v.
ls [abc]*.txt      # File bắt đầu bằng a, b, hoặc c
rm temp*           # Xóa tất cả file bắt đầu bằng temp
```

#### Tìm Kiếm

```bash
# Tìm file/folder
find . -name "*.txt"           # Tìm file .txt từ thư mục hiện tại
find ~ -name "report*"         # Tìm từ home
find . -type f -size +10M      # Tìm file > 10MB
find . -type d -name "node_modules"  # Tìm folder

# Tìm nội dung trong file
grep "keyword" file.txt        # Tìm từ khóa trong file
grep -r "keyword" .            # Tìm trong tất cả file
grep -i "keyword" file.txt     # Không phân biệt hoa thường
grep -n "keyword" file.txt     # Hiển thị số dòng
```

#### Tiện ích

```bash
# History
history                    # Xem lịch sử
!123                       # Chạy lại lệnh 123
!git                       # Chạy lại lệnh git gần nhất
history | grep "docker"    # Tìm trong history

# Disk usage
df -h                      # Dung lượng ổ đĩa
du -sh *                   # Kích thước từng item
du -sh * | sort -h         # Sắp xếp theo size

# System info
uname -a                   # Thông tin hệ thống
sw_vers                    # macOS version
system_profiler            # Hardware info

# Compression
tar -czf archive.tar.gz folder/    # Nén
tar -xzf archive.tar.gz            # Giải nén
zip -r archive.zip folder/         # Zip
unzip archive.zip                  # Unzip

# Quick server
python3 -m http.server 8000        # Local web server
```

#### Networking

```bash
# Kiểm tra kết nối
ping google.com            # Test connectivity
curl https://api.github.com  # HTTP request
wget https://example.com/file.zip  # Download file

# Network info
ifconfig                   # Network interfaces
netstat -an               # Network connections
lsof -i :8080             # Xem port đang dùng

# SSH
ssh user@hostname         # Kết nối remote
scp file.txt user@host:/path/  # Copy file qua SSH
```


---

## Các ứng dụng cơ bản

Trong thực tế, sẽ rất vất vả nếu như ta phải liên tục gõ nhiều lệnh liên tục trên terminal. Thay vì phải làm việc, ta sẽ nhóm chúng lại thành một tập lệnh để chạy thông qua một lệnh duy nhất. Có 2 cách để làm việc này:
- Tạo `Shell Script`
- Tạo `.zshrc` tại user home path
	- `func`
	- `alias`

| Tiêu chí          | Shell Script      | `.zshrc`                |
| ----------------- | ----------------- | ----------------------- |
| Mục đích          | Automation / Tool | Cấu hình shell          |
| Khi nào chạy      | Khi gọi           | Mỗi lần mở terminal     |
| Tính độc lập      | Cao               | Thấp                    |
| Nhận tham số      | Có (`$1`)         | Không nên               |
| Dùng cho CI       | ✔                 | ❌                       |
| Dùng alias        | ❌                 | ✔                       |
| Dùng function nhỏ | ❌                 | ✔                       |
| Có shebang        | ✔                 | ❌                       |
| Có side-effect    | Kiểm soát được    | Dễ gây lỗi nếu viết sai |

### `.zshrc` func
Ví dụ, trong thực tế khi muốn xoá một folder, files:
```bash
# Xóa
rm file.txt                # Xóa file
rm -r folder               # Xóa folder
rm -rf folder              # Xóa bắt buộc (cẩn thận!)
rmdir empty_folder         # Xóa folder trống
```

```callout
[!CAUTION] nguy hiểm
Các lệnh này rất nguy hiểm, chúng sẽ xoá hoàn toàn và không lưu trữ vào thùng rác 🗑️.
```

Cách an toàn là tạo một custom command ở trong file `.zshrc`, lệnh này sẽ đảm bảo khi ta xoá, các file đó sẽ được chuyển vào thùng rác 🗑️ thay vì xoá hoàn toàn:
```bash
# Home/Username/.zshrc

del() {
  (( $# == 0 )) && return 0

  local paths=()
  local files=()
  local f

  for f in "$@"; do
    [[ -e "$f" ]] || continue
    files+=("$f")
    paths+=("POSIX file \"$(realpath "$f")\"")
  done

  (( ${#paths[@]} == 0 )) && return 0

  local apple_list
  apple_list=$(printf ", %s" "${paths[@]}")
  apple_list="{${apple_list:2}}"

  if osascript -ss -e "tell application \"Finder\" to delete $apple_list" >/dev/null; then
    print -u2 -- "✅ moved ${#files[@]} item(s) to the Trash:"
    for f in "${files[@]}"; do
      if [[ -d "$f" ]]; then
        print -u2 -- "  📂 ${f:t}/"
      else
        print -u2 -- "  📝 ${f:t}"
      fi
    done
  fi
}
```


Sau đó mỗi khi ta muốn xoá thì chỉ cần sử dụng lệnh `del`:
```bash
del a.txt  # xoá file a.txt            -> di chuyển file này vào thùng rác
del *.meta # xoá toàn bộ các file.meta -> di chuyển chúng vào thùng ra
```

Rất an toàn và tiện lợi phải không nào !
```callout
[!NOTE] Lưu ý
Có một cách khác nữa là sử dụng `alias`, nhưng cá nhân tôi không khuyến khích các bạn dùng chúng vì thường ta sẽ truyền tham số vào lệnh, và `alias` thì sẽ không hiệu quả khi ta làm việc với nhiều tham số so với `func`.
```


### `.zshrc` alias

Tuy `alias` không hữu ích trong việc xử lý các tác vụ phức tạp. Nhưng dùng nó cho các tác vụ đơn giản thì rất tiện. Ví dụ, thay vì phải liên tục dùng lệnh `cd` để truy cập tới folder cần làm việc ta chỉ cần gán alias cho chúng là xong !

```bash
# Aliases hữu ích trong ~/.zshrc
alias projects="cd ~/Projects"
alias work="cd ~/Projects/work"
alias personal="cd ~/Projects/personal"
```


##  `.zshrc` và `.sh` chi tiết cách sử dụng nâng cao

#### Function Cơ Bản

```bash
# Cú pháp
function tên_lệnh() {
    # code ở đây
    # $1, $2, $3... là parameters
}

# Ví dụ 1: Tạo và vào folder
function mkcd() {
    mkdir -p "$1"
    cd "$1"
}

# Sử dụng
mkcd my-project       # Tạo folder và cd vào luôn

# Ví dụ 2: Git commit nhanh
function gcom() {
    git add .
    git commit -m "$1"
    git push
}

# Sử dụng
gcom "fix bug"        # Add, commit với message, và push

# Ví dụ 3: Backup file
function backup() {
    if [ -z "$1" ]; then
        echo "Usage: backup <file>"
        return 1
    fi
    cp "$1" "$1.backup.$(date +%Y%m%d_%H%M%S)"
    echo "Backed up: $1"
}

# Sử dụng
backup important.txt  # Tạo important.txt.backup.20250101_143022
```


---

### Shell Scripts - Lệnh Độc Lập

**Shell Scripts** là files thực thi độc lập, giống như chương trình.

#### Bước 1: Tạo Script File

```bash
# Tạo thư mục cho scripts (lần đầu)
mkdir -p ~/bin

# Tạo script
nano ~/bin/mycommand

# Nội dung file mycommand:
#!/bin/zsh

# Script của bạn ở đây
echo "Hello from my custom command!"
echo "You passed: $1"
```

#### Bước 2: Làm Script Có Thể Chạy

```bash
# Thêm quyền execute
chmod +x ~/bin/mycommand

# Test
~/bin/mycommand hello
```

#### Bước 3: Thêm ~/bin Vào PATH

Để chạy lệnh ở bất kỳ đâu mà không cần gõ đường dẫn đầy đủ:

```bash
# Mở ~/.zshrc
nano ~/.zshrc

# Thêm dòng này
export PATH="$HOME/bin:$PATH"

# Lưu và load lại
source ~/.zshrc

# Giờ có thể chạy từ bất kỳ đâu
mycommand test
```

---

### Ví Dụ Scripts Thực Tế

#### Script 1: Project Starter

```bash
# File: ~/bin/newproject
#!/bin/zsh

if [ -z "$1" ]; then
    echo "Usage: newproject <project-name>"
    exit 1
fi

PROJECT_NAME="$1"
PROJECT_DIR="$HOME/Projects/$PROJECT_NAME"

echo "Creating project: $PROJECT_NAME"

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Tạo cấu trúc folder
mkdir -p src public tests docs

# Tạo files cơ bản
touch README.md .gitignore
echo "# $PROJECT_NAME" > README.md

# Git init
git init
git add .
git commit -m "Initial commit"

echo "✅ Project created at: $PROJECT_DIR"
echo "📂 Opening in VSCode..."
code .
```

```bash
# Cài đặt
chmod +x ~/bin/newproject

# Sử dụng
newproject my-awesome-app
```

#### Script 2: System Cleanup

```bash
# File: ~/bin/cleanup
#!/bin/zsh

echo "🧹 Starting system cleanup..."

# Homebrew cleanup
echo "Cleaning Homebrew..."
brew cleanup
brew autoremove

# Clear cache
echo "Clearing caches..."
rm -rf ~/Library/Caches/*

# Find large files
echo "Finding large files (>100MB)..."
find ~ -type f -size +100M 2>/dev/null | head -n 10

# Disk usage
echo "Disk usage:"
df -h /

echo "✅ Cleanup complete!"
```

#### Script 3: Git Quick Deploy

```bash
# File: ~/bin/deploy
#!/bin/zsh

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "${RED}❌ Not a git repository${NC}"
    exit 1
fi

# Get commit message
if [ -z "$1" ]; then
    echo "${RED}Usage: deploy <commit-message>${NC}"
    exit 1
fi

MESSAGE="$1"

echo "${YELLOW}📦 Deploying...${NC}"

# Run tests (nếu có)
if [ -f "package.json" ]; then
    echo "Running tests..."
    npm test || exit 1
fi

# Git operations
echo "Committing changes..."
git add .
git commit -m "$MESSAGE"

echo "Pushing to remote..."
git push origin main

# Deploy (ví dụ với Vercel)
if command -v vercel &> /dev/null; then
    echo "Deploying to Vercel..."
    vercel --prod
fi

echo "${GREEN}✅ Deploy complete!${NC}"
```

---

## Tổng kết

|Feature|Alias|Function|Script|
|---|---|---|---|
|Độ phức tạp|Đơn giản|Trung bình|Phức tạp|
|Parameters|Không|Có|Có|
|Logic|Không|Có|Có|
|Reusable|Trong session|Trong session|Độc lập|
|Tốc độ|Nhanh nhất|Nhanh|Chậm hơn|
|Sử dụng cho|Shortcuts|Logic đơn giản|Tools phức tạp|

**Khi nào nên dùng ?**

- **Alias**: Shortcuts đơn giản, không cần logic
- **Function**: Cần parameters, logic đơn giản
- **Script**: Tools phức tạp, muốn chia sẻ, có nhiều options


Terminal là công cụ cực kỳ mạnh mẽ. Bạn không cần nhớ tất cả, hãy:

1. Bắt đầu với các lệnh cơ bản hằng ngày
2. Dần dần học thêm khi cần
3. Tạo aliases cho lệnh hay dùng
4. Viết scripts để tự động hóa
5. Thực hành đều đặn
