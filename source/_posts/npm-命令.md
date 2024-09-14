---
title: npm 命令
date: 2024-09-12 12:56:37
tags:
  - npm
author: 笑清
copyright: true 
---

# 写在前面

最近换了主机，想要多终端更新blog，在使用npm的时候遇到了很多问题，记录一下相关的命令。

<!--more-->

### 1. `npm install`

这个命令用于安装当前项目的依赖项，通常根据项目根目录下的 `package.json` 文件中定义的依赖列表进行安装。

### 2. `npm install -g ...`

此命令用于全局安装一个或多个包。使用 `-g` 标志意味着该包将被安装到全局环境中，通常适用于命令行工具。

### 3. `npm cache clean --force`

此命令用于清空 npm 的缓存。使用 `--force` 标志可以强制执行此操作，尽管通常不建议这样做，因为缓存可以加快后续的安装过程。

### 4. `npm root -g`

该命令显示全局安装包的根目录路径。它告诉你全局 npm 包的安装位置。

### 5. `npm config get registry`

此命令用于获取当前 npm 配置中设置的注册表 URL。默认情况下，npm 使用 `https://registry.npmjs.org/`。

### 6. `npm config get prefix`

该命令返回 npm 的全局安装位置前缀，通常用于确定 npm 命令和全局包的位置。

### 7. `npm config set prefix`

此命令用于设置 npm 的全局安装位置前缀。可以更改全局安装包的默认位置。

### 8. `npm config set cache`

该命令用于设置 npm 缓存目录的位置。可以将缓存存储在指定的目录中。

### 9. `npm config set fund false --location=global`

此命令用于全局配置 npm，关闭对项目中资金请求的显示。默认情况下，npm 会在安装包时显示资助信息。

### 10. `npm config set registry https://mirrors.huaweicloud.com/repository/npm/`

此命令将 npm 的注册表设置为指定的 URL，这里是华为云的 npm 镜像。这可以加快依赖项的下载速度，尤其是在某些地区。
