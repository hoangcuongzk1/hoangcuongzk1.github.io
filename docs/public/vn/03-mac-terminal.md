---
title: MacOS Terminal tutorial
creation date: 2026-01-01T22:25:00
slug: post-03
series: tools
excerpt: Tăng hiệu suất làm việc cùng terminal.
lang: vn
cover img: link to cover img
tags:
  - terminal
---
# Hướng Dẫn Terminal Toàn Diện. Từ Cơ Bản Đến Nâng Cao - Dành Cho macOS

---
![[my_terminal_preview.png]]
## Phần 1: Nguồn Gốc và Lịch Sử

### 1.1 Terminal là gì?

Terminal (hay còn gọi là Command Line Interface - CLI) là giao diện dòng lệnh cho phép bạn giao tiếp với hệ điều hành bằng văn bản thay vì giao diện đồ họa (GUI).

### 1.2 Lịch sử

- **Những năm 1960-1970**: Các máy tính mainframe chỉ có terminal văn bản (teletype machines)
- **Unix (1969)**: Ken Thompson và Dennis Ritchie tại Bell Labs tạo ra Unix - hệ điều hành nền tảng cho macOS
- **Shell đầu tiên**: Thompson shell (sh) → Bourne shell (sh) → Bash (1989) → Zsh (1990)
- **macOS**: Được xây dựng trên nền Darwin (dựa trên BSD Unix và Mach kernel)
- **2019**: Apple chuyển từ Bash sang Zsh làm shell mặc định

### 1.3 Tại sao cần dùng Terminal?

- **Hiệu quả**: Nhanh hơn nhiều so với GUI cho các tác vụ lặp đi lặp lại
- **Mạnh mẽ**: Truy cập đầy đủ tính năng hệ thống
- **Tự động hóa**: Viết script để tự động hóa công việc
- **Remote**: Điều khiển máy từ xa qua SSH
- **Lập trình**: Cần thiết cho development (Git, npm, pip, docker, v.v.)

---

## Phần 2: Cơ Bản - Bắt Đầu Với Terminal

### 2.1 Mở Terminal

- **Cách 1**: `Cmd + Space` → gõ "Terminal" → Enter
- **Cách 2**: Applications → Utilities → Terminal
- **Cách 3**: Dùng iTerm2 (terminal thay thế tốt hơn)

### 2.2 Cấu trúc một lệnh

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

### 2.3 Hệ thống file macOS

```
/                    # Root (gốc của hệ thống)
├── Applications     # Ứng dụng
├── Users           # Thư mục người dùng
│   └── username    # Thư mục home của bạn (~)
│       ├── Desktop
│       ├── Documents
│       ├── Downloads
│       └── ...
├── System          # File hệ thống macOS
└── Library         # Thư viện hệ thống
```

### 2.4 Đường dẫn (Path)

- **Absolute path**: Đường dẫn đầy đủ từ root: `/Users/username/Documents/file.txt`
- **Relative path**: Đường dẫn tương đối: `./Documents/file.txt` hoặc `../Downloads/`
- **Home directory**: `~` = `/Users/username`

---

## Phần 3: Lệnh Cơ Bản Hằng Ngày

### 3.1 Di chuyển và xem thư mục

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

# Di chuyển thư mục
cd Documents        # Vào thư mục Documents
cd ..               # Lùi 1 cấp
cd ../..            # Lùi 2 cấp
cd ~                # Về home
cd /                # Về root
cd -                # Về thư mục trước đó
```

### 3.2 Thao tác với File và Folder

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

### 3.3 Xem và Chỉnh Sửa File

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

---

## Phần 4: Kỹ Năng Trung Cấp

### 4.1 Wildcards (Ký tự đại diện)

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

### 4.2 Tìm Kiếm

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

### 4.3 Pipes và Redirects

```bash
# Redirect output
command > file.txt         # Ghi đè vào file
command >> file.txt        # Thêm vào cuối file
command 2> error.log       # Ghi lỗi vào file

# Pipe (|) - Nối lệnh
ls -la | grep ".txt"       # Lọc kết quả ls
cat file.txt | wc -l       # Đếm số dòng
history | grep "git"       # Tìm trong lịch sử

# Kết hợp
cat access.log | grep "error" | wc -l  # Đếm số lỗi
```

### 4.4 Quyền (Permissions)

```bash
# Xem quyền
ls -l
# -rw-r--r--  1 user  staff  1234 Jan 1 12:00 file.txt
# │││││││││
# │││└┬┘└┬┘ └─ Others (khác)
# ││└──┬──┘ ─── Group (nhóm)
# │└───┴───────── Owner (chủ sở hữu)
# └─────────────── File type (- = file, d = directory)
# r = read (4), w = write (2), x = execute (1)

# Thay đổi quyền
chmod 644 file.txt         # rw-r--r-- (owner: rw, other: r)
chmod 755 script.sh        # rwxr-xr-x (owner: rwx, other: rx)
chmod +x script.sh         # Thêm quyền execute

# Thay đổi owner
sudo chown user:group file.txt
```

---

## Phần 5: Kỹ Năng Nâng Cao

### 5.1 Process Management

```bash
# Xem processes
ps                         # Process của user
ps aux                     # Tất cả process
top                        # Realtime (q để thoát)
htop                       # Top đẹp hơn (cần cài: brew install htop)

# Quản lý process
command &                  # Chạy background
jobs                       # Xem jobs
fg                         # Đưa lên foreground
Ctrl+Z                     # Tạm dừng
bg                         # Tiếp tục ở background

# Kill process
kill PID                   # Kill bằng ID
killall process_name       # Kill bằng tên
pkill -f pattern          # Kill theo pattern
```

### 5.2 Variables và Environment

```bash
# Variables
name="John"
echo $name                 # In ra: John
echo "Hello $name"         # Hello John

# Environment variables
echo $PATH                 # Đường dẫn tìm commands
echo $HOME                 # Thư mục home
echo $USER                 # Tên user

# Export variables
export MY_VAR="value"      # Biến global
echo $MY_VAR

# Xem tất cả env vars
env
printenv
```

### 5.3 Aliases và Functions

```bash
# Tạo alias (shortcut)
alias ll="ls -la"
alias ..="cd .."
alias gs="git status"

# Alias vĩnh viễn: thêm vào ~/.zshrc
echo 'alias ll="ls -la"' >> ~/.zshrc
source ~/.zshrc            # Load lại config

# Functions
function mkcd() {
    mkdir -p "$1"
    cd "$1"
}

# Sử dụng
mkcd new_project           # Tạo và vào folder
```

### 5.4 Shell Scripting Cơ Bản

```bash
# Tạo file script
touch script.sh
chmod +x script.sh

# Nội dung script.sh
#!/bin/zsh

# Variables
name="World"

# Conditional
if [ -f "file.txt" ]; then
    echo "File exists"
else
    echo "File not found"
fi

# Loop
for i in {1..5}; do
    echo "Number: $i"
done

# Function
greet() {
    echo "Hello, $1!"
}

greet "Alice"

# Chạy script
./script.sh
```

### 5.5 Networking

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

## Phần 6: Công Cụ Hằng Ngày Cho Developer

### 6.1 Git

```bash
git clone <url>
git status
git add .
git commit -m "message"
git push
git pull
git branch
git checkout -b new-branch
```

### 6.2 Package Managers

```bash
# Homebrew (cài đặt phần mềm)
brew install node
brew install python
brew update
brew upgrade

# Node.js
npm install
npm start
npm run build

# Python
pip install requests
pip list
```

### 6.3 Docker

```bash
docker ps                  # Container đang chạy
docker images              # List images
docker run -d nginx        # Chạy container
docker exec -it <id> bash  # Vào container
docker-compose up          # Start services
```

---

## Phần 7: Tips và Tricks Hằng Ngày

### 7.1 Keyboard Shortcuts

```
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

### 7.2 Useful Commands

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

### 7.3 Cấu Hình Terminal Đẹp Hơn

```bash
# Cài Oh My Zsh (theme và plugins cho Zsh)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Chỉnh ~/.zshrc
ZSH_THEME="agnoster"       # Theme đẹp
plugins=(git docker node npm python)

# Syntax highlighting
brew install zsh-syntax-highlighting
echo "source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc
```

---

## Phần 8: Workflow Thực Tế

### 8.1 Quy trình làm việc web developer

```bash
# Sáng - Start
cd ~/Projects/my-app
git pull origin main
npm install                # Cập nhật dependencies
code .                     # Mở VSCode

# Development
npm run dev                # Start dev server
git checkout -b feature/new-button
# ... code ...
git add .
git commit -m "Add new button"
git push origin feature/new-button

# Testing
npm test
npm run lint

# Deploy
npm run build
git checkout main
git merge feature/new-button
git push origin main
```

### 8.2 Tự động hóa tác vụ lặp

```bash
# Backup script
#!/bin/zsh
DATE=$(date +%Y-%m-%d)
tar -czf ~/Backups/backup-$DATE.tar.gz ~/Documents/important
echo "Backup completed: backup-$DATE.tar.gz"

# Cleanup script
#!/bin/zsh
# Xóa file node_modules cũ
find ~/Projects -name "node_modules" -type d -mtime +30 -exec rm -rf {} +
# Xóa .DS_Store
find ~/Projects -name ".DS_Store" -delete
echo "Cleanup completed"
```

### 8.3 Bulk operations

```bash
# Đổi tên hàng loạt
for file in *.jpg; do
    mv "$file" "photo_${file}"
done

# Resize images (cần ImageMagick: brew install imagemagick)
for img in *.jpg; do
    convert "$img" -resize 50% "resized_${img}"
done

# Convert files
for file in *.md; do
    pandoc "$file" -o "${file%.md}.pdf"
done
```

---

## Phần 9: Troubleshooting và Debug

### 9.1 Common Issues

```bash
# Permission denied
sudo command               # Chạy với quyền admin

# Command not found
which command              # Kiểm tra command có tồn tại
echo $PATH                 # Kiểm tra PATH

# Port đã được sử dụng
lsof -ti:3000              # Xem process dùng port 3000
lsof -ti:3000 | xargs kill # Kill process đó

# Disk full
du -sh /* | sort -h        # Tìm folder lớn
brew cleanup               # Dọn dẹp Homebrew cache
```

### 9.2 Logs và Debugging

```bash
# System logs
log stream                 # Realtime logs
log show --last 1h         # Logs 1 giờ qua

# Application logs
tail -f /var/log/system.log
tail -f app.log | grep ERROR

# Debug script
bash -x script.sh          # Chạy với debug mode
set -x                     # Bật debug trong script
set +x                     # Tắt debug
```

---

## Phần 10: Best Practices

### 10.1 An Toàn

- ✅ Luôn kiểm tra kỹ trước khi dùng `rm -rf`
- ✅ Backup trước khi thay đổi file hệ thống
- ✅ Không chạy script từ nguồn không rõ ràng
- ✅ Dùng `sudo` một cách cẩn thận
- ✅ Kiểm tra đường dẫn trước khi xóa: `pwd` trước `rm -rf *`

### 10.2 Hiệu Quả

- Học shortcuts - tiết kiệm rất nhiều thời gian
- Dùng tab completion thay vì gõ đầy đủ
- Tạo aliases cho lệnh hay dùng
- Viết scripts cho tác vụ lặp lại
- Dùng history để tìm lại lệnh cũ

### 10.3 Tổ Chức

```bash
# Cấu trúc project tốt
~/Projects/
  ├── work/
  ├── personal/
  └── learning/

# Aliases hữu ích trong ~/.zshrc
alias projects="cd ~/Projects"
alias work="cd ~/Projects/work"
alias personal="cd ~/Projects/personal"
```

---

## Phần 11: Resources Để Học Thêm

### 11.1 Documentation

- `man command` - Manual pages ngay trong terminal
- [https://ss64.com/osx/](https://ss64.com/osx/) - macOS command reference
- [https://explainshell.com/](https://explainshell.com/) - Giải thích lệnh

### 11.2 Tools nên cài

```bash
brew install htop          # Process monitor đẹp hơn
brew install tree          # Hiển thị cây thư mục
brew install bat           # cat với syntax highlighting
brew install fzf           # Fuzzy finder
brew install ripgrep       # grep nhanh hơn
```

### 11.3 Cheat Sheets

```bash
# Tạo file cheat sheet riêng
touch ~/cheatsheet.txt
alias cheat="cat ~/cheatsheet.txt | grep"

# Dùng khi cần
cheat "git"
```

---

## Kết Luận

Terminal là công cụ cực kỳ mạnh mẽ. Bạn không cần nhớ tất cả, hãy:

1. Bắt đầu với các lệnh cơ bản hằng ngày
2. Dần dần học thêm khi cần
3. Tạo aliases cho lệnh hay dùng
4. Viết scripts để tự động hóa
5. Thực hành đều đặn

**Nhớ**: `man command` là bạn tốt nhất của bạn!

Happy coding! 🚀
