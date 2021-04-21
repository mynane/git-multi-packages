# git-multi-packages

> 解决多个 git 仓库同步管理问题，统一的分支管理

- [git-multi-packages](#git-multi-packages)
  - [安装](#%e5%ae%89%e8%a3%85)
  - [使用](#%E4%BD%BF%E7%94%A8)
    - [初始化](#初始化)
    - [分支管理](#分支管理)
    - [日志管理](#日志管理)

## 安装

```bash
npm install -g git-multi-packages
```

## 使用

在控制台中使用命令：

```js
> gm

Usage: gm <command> [options]

Options:
  -V, --version       output the version number
  -h, --help          display help for command

Commands:
  init|i [options]    initialize your project
  branch|b [options]  switch branches
  log|l               show the branch lists
  store|s             store data
  help [command]      display help for command
```

## 选项

### 初始化

```js
> gm init -h

Usage: gm init|i [options]

initialize your project

Options:
  -f, --force  force initialize
  -h, --help   display help for command

```

### 分支管理

```js
> gm init -h

Usage: gm branch|b [options]

switch branches

Options:
  -n, --name <name>    branch name
  -u, --upstream       --set-upstream
  -r, --remove <name>  remove branch
  -h, --help           display help for command
```

### 日志管理

```js
> gm log -h

Usage: gm log|l [options]

show the branch lists

Options:
  -h, --help  display help for command
```
