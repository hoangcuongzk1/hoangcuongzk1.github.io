---
title: Boosting Productivity with Terminal
creation date: 2026-01-01T22:25:00
slug: post-03
series: productivity
excerpt: What is Terminal? Practical applications of Terminal usage.
lang: en
cover img: https://github.com/hoangcuongzk1/hoangcuongzk1.github.io/blob/main/docs/shared/post-03/my_terminal_preview.png?raw=true
tags:
  - productivity
---
## Introduction

![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTY5NWc4aWQxOTF2bGJmZ2U0cmZlaDc2dTBoMTN4N3c4dDdhd21iYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kJ1iL1ZQIyibu/giphy.gif)

We've all been captivated at least once by hackers dancing across keyboards whilst staring at screens filled with nothing but text.

I was utterly fascinated and drawn to this imagery when I first entered this profession. Ironically, however, from the time I started learning to code until now, I've rarely had the opportunity to dedicate time to the terminal. Occasionally, I'd use it solely for package installation.

Recently, I've begun working more extensively with auto-build systems and tooling. Consequently, I've started engaging with the terminal far more frequently.

Throughout my journey working with the terminal, I've had this revelation: "Good grief! I wish I'd started using it sooner."

The benefits of terminal usage are manifold, naturally depending on the specific context of one's work. What I appreciate most, though, is that I no longer need to use the mouse. It's remarkably swift and convenient.

I'm not certain whether you share this sentiment, but I'm decidedly averse to mouse usage. In the early stages of my career, I relied on it extensively, but nowadays, having memorised all the IDE `shortcuts`, I scarcely use it at all.

And I must confess, I rather envy backend developers and data analysts. The bulk of their work centres on the `input/output` of data. Frontend developers, conversely, must test the visual aspects of software as well, making mouse usage unavoidable. They, however, can test the majority of their code through `UnitTests`, which is absolutely... marvellous... _sigh_ 🫠.

Naturally, if a project already has:

- Visual elements, view templates, etc.
- A Designer adjusting parameters rather than developers manually coding visuals
- ...

then this somewhat mitigates the issue 🙃. Perhaps I ought to transition to backend development 😂.

Right, no more rambling. This article comprises two main sections:

- Terminal fundamentals
- Practical applications Note: the environment I'll be using is **macOS - Zsh**.

---

## Terminal Fundamentals

### What is Terminal?

Terminal (also known as Command Line Interface - CLI) is a text-based interface that enables you to communicate with the operating system through text commands rather than a graphical user interface (GUI).

### Why Use Terminal?

- **Efficiency**: Considerably faster than GUI for repetitive tasks
- **Power**: Complete access to system features
- **Automation**: Write scripts to automate workflows
- **Remote Access**: Control machines remotely via SSH
- **Development**: Essential for development work (Git, npm, pip, docker, etc.)

---

### Basic Terminal Usage

**Opening Terminal**

- **Method 1**: `Cmd + Space` → type Terminal → Enter
- **Method 2**: Applications → Utilities → Terminal

**Command Structure**

```bash
command -options arguments
```

Example:

```bash
ls -la /Users/username/Documents
│  │   │
│  │   └─ Argument
│  └─ Option
└─ Command
```

### macOS File System

The most crucial aspect of working with Terminal is maintaining a mental model of your current working directory.

This can be slightly challenging initially, but gradually, you'll naturally visualise a UI in your mind, rather like having a File Explorer interface.

Typically, when launching, terminal automatically starts from the `user` directory.

```bash
/                    # Root (system root)
├── Applications     # Applications
├── Users            # User directories
│   └── username     # 🌟 -> terminal typically starts here by default
│       ├── Desktop
│       ├── Documents
│       ├── Downloads
│       └── ...
├── System          # macOS system files
└── Library         # System libraries
```

---

### Basic Commands

#### Navigating and Viewing Directories

```bash
# View current directory
pwd

# List files/folders
ls                  # Basic
ls -l               # Detailed (long format)
ls -a               # Include hidden files
ls -la              # Combination of both
ls -lh              # Human-readable sizes
ls -lt              # Sort by time
ls -lS              # Sort by size

# Change working directory
cd Documents        # Enter Documents directory
cd ..               # Go up one level
cd ../..            # Go up two levels
cd ~                # Return to home
cd /                # Go to root
cd -                # Return to previous directory
```

#### File and Folder Operations

```bash
# Create new
mkdir project              # Create folder
mkdir -p a/b/c             # Create multiple levels simultaneously
touch file.txt             # Create empty file

# Copy
cp file.txt backup.txt     # Copy file
cp -r folder1 folder2      # Copy folder (-r = recursive)

# Move/Rename
mv old.txt new.txt         # Rename
mv file.txt ~/Desktop/     # Move

# Delete
rm file.txt                # Delete file
rm -r folder               # Delete folder
rm -rf folder              # Force delete (use with caution!)
rmdir empty_folder         # Delete empty folder

# View information
stat file.txt              # Detailed information
file image.jpg             # File type
du -sh folder              # Folder size
```

#### Viewing and Editing Files

```bash
# View content
cat file.txt               # View entire file
less file.txt              # View page by page (q to exit)
head file.txt              # First 10 lines
head -n 20 file.txt        # First 20 lines
tail file.txt              # Last 10 lines
tail -f log.txt            # Monitor file in realtime (logs)

# Edit
nano file.txt              # Simple editor (Ctrl+X to exit)
vim file.txt               # Powerful editor (i to insert, :wq to save)
open file.txt              # Open with default app
open -a "Visual Studio Code" file.txt  # Open with specific app
```

#### Keyboard Shortcuts

```bash
Ctrl + A        # Move to beginning of line
Ctrl + E        # Move to end of line
Ctrl + U        # Delete from cursor to beginning
Ctrl + K        # Delete from cursor to end
Ctrl + W        # Delete one word before cursor
Ctrl + L        # Clear screen (= clear command)
Ctrl + R        # Search history (type to search)
Ctrl + C        # Cancel command
Ctrl + D        # Exit shell
Ctrl + Z        # Suspend process
!!              # Previous command
!$              # Last argument of previous command
```

---

### Intermediate Commands

#### Wildcards

```bash
*           # Represents any characters
?           # Represents single character
[]          # Character set

# Examples
ls *.txt           # All .txt files
ls file?.txt       # file1.txt, fileA.txt, etc.
ls [abc]*.txt      # Files starting with a, b, or c
rm temp*           # Delete all files starting with temp
```

#### Searching

```bash
# Find files/folders
find . -name "*.txt"           # Find .txt files from current directory
find ~ -name "report*"         # Search from home
find . -type f -size +10M      # Find files > 10MB
find . -type d -name "node_modules"  # Find folders

# Search content within files
grep "keyword" file.txt        # Find keyword in file
grep -r "keyword" .            # Search in all files
grep -i "keyword" file.txt     # Case-insensitive
grep -n "keyword" file.txt     # Display line numbers
```

#### Utilities

```bash
# History
history                    # View history
!123                       # Re-run command 123
!git                       # Re-run most recent git command
history | grep "docker"    # Search in history

# Disk usage
df -h                      # Disk space
du -sh *                   # Size of each item
du -sh * | sort -h         # Sort by size

# System info
uname -a                   # System information
sw_vers                    # macOS version
system_profiler            # Hardware info

# Compression
tar -czf archive.tar.gz folder/    # Compress
tar -xzf archive.tar.gz            # Extract
zip -r archive.zip folder/         # Zip
unzip archive.zip                  # Unzip

# Quick server
python3 -m http.server 8000        # Local web server
```

#### Networking

```bash
# Check connectivity
ping google.com            # Test connectivity
curl https://api.github.com  # HTTP request
wget https://example.com/file.zip  # Download file

# Network info
ifconfig                   # Network interfaces
netstat -an               # Network connections
lsof -i :8080             # Check port usage

# SSH
ssh user@hostname         # Remote connection
scp file.txt user@host:/path/  # Copy file via SSH
```

---

## Practical Applications

In practice, it becomes rather laborious if one must continuously type numerous commands into the terminal. Rather than working inefficiently, we can group them into a script to execute via a single command. There are two approaches to achieve this:

- Create `Shell Scripts`
- Create `.zshrc` in user home path
    - `func`
    - `alias`

|Criteria|Shell Script|`.zshrc`|
|---|---|---|
|Purpose|Automation / Tool|Shell configuration|
|When executed|When invoked|Every terminal launch|
|Independence|High|Low|
|Accepts parameters|Yes (`$1`)|Not recommended|
|CI usage|✔|❌|
|Use alias|❌|✔|
|Use small functions|❌|✔|
|Has shebang|✔|❌|
|Has side-effects|Controllable|Prone to errors if written incorrectly|

### `.zshrc` func

For instance, in practice when deleting a folder or files:

```bash
# Delete
rm file.txt                # Delete file
rm -r folder               # Delete folder
rm -rf folder              # Force delete (use with caution!)
rmdir empty_folder         # Delete empty folder
```

```callout
[!CAUTION] Dangerous
These commands are extremely dangerous; they delete permanently without sending to trash 🗑️.
```

The safer approach is to create a custom command in the `.zshrc` file. This command ensures that when you delete, files are moved to trash 🗑️ rather than being permanently deleted:

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

Subsequently, whenever you wish to delete, simply use the `del` command:

```bash
del a.txt  # delete file a.txt            -> moves this file to trash
del *.meta # delete all .meta files -> moves them to trash
```

Remarkably safe and convenient, isn't it!

```callout
[!NOTE] Note
There's another alternative using `alias`, but personally I wouldn't recommend it, as we typically pass parameters to commands, and `alias` is less effective when working with multiple parameters compared to `func`.
```

### `.zshrc` alias

Whilst `alias` isn't particularly useful for handling complex tasks, it's exceedingly convenient for simple operations. For example, rather than continuously using the `cd` command to access working folders, we can simply assign aliases to them!

```bash
# Useful aliases in ~/.zshrc
alias projects="cd ~/Projects"
alias work="cd ~/Projects/work"
alias personal="cd ~/Projects/personal"
```

## Advanced `.zshrc` and `.sh` Usage

#### Basic Functions

```bash
# Syntax
function command_name() {
    # code here
    # $1, $2, $3... are parameters
}

# Example 1: Create and enter folder
function mkcd() {
    mkdir -p "$1"
    cd "$1"
}

# Usage
mkcd my-project       # Create folder and cd into it

# Example 2: Quick Git commit
function gcom() {
    git add .
    git commit -m "$1"
    git push
}

# Usage
gcom "fix bug"        # Add, commit with message, and push

# Example 3: Backup file
function backup() {
    if [ -z "$1" ]; then
        echo "Usage: backup <file>"
        return 1
    fi
    cp "$1" "$1.backup.$(date +%Y%m%d_%H%M%S)"
    echo "Backed up: $1"
}

# Usage
backup important.txt  # Creates important.txt.backup.20250101_143022
```

---

### Shell Scripts - Independent Commands

**Shell Scripts** are standalone executable files, similar to programmes.

#### Step 1: Create Script File

```bash
# Create directory for scripts (first time)
mkdir -p ~/bin

# Create script
nano ~/bin/mycommand

# Content of mycommand file:
#!/bin/zsh

# Your script here
echo "Hello from my custom command!"
echo "You passed: $1"
```

#### Step 2: Make Script Executable

```bash
# Add execute permission
chmod +x ~/bin/mycommand

# Test
~/bin/mycommand hello
```

#### Step 3: Add ~/bin to PATH

To execute commands from anywhere without typing the full path:

```bash
# Open ~/.zshrc
nano ~/.zshrc

# Add this line
export PATH="$HOME/bin:$PATH"

# Save and reload
source ~/.zshrc

# Now can execute from anywhere
mycommand test
```

---

### Practical Script Examples

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

# Create folder structure
mkdir -p src public tests docs

# Create basic files
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
# Installation
chmod +x ~/bin/newproject

# Usage
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

# Run tests (if available)
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

# Deploy (example with Vercel)
if command -v vercel &> /dev/null; then
    echo "Deploying to Vercel..."
    vercel --prod
fi

echo "${GREEN}✅ Deploy complete!${NC}"
```

---

## Summary

|Feature|Alias|Function|Script|
|---|---|---|---|
|Complexity|Simple|Moderate|Complex|
|Parameters|No|Yes|Yes|
|Logic|No|Yes|Yes|
|Reusable|Within session|Within session|Independent|
|Speed|Fastest|Fast|Slower|
|Use for|Shortcuts|Simple logic|Complex tools|

**When to Use?**

- **Alias**: Simple shortcuts, no logic required
- **Function**: Requires parameters, simple logic
- **Script**: Complex tools, shareable, multiple options

Terminal is an extraordinarily powerful tool. You needn't memorise everything; simply:

1. Begin with basic everyday commands
2. Gradually learn more as needed
3. Create aliases for frequently used commands
4. Write scripts for automation
5. Practice consistently