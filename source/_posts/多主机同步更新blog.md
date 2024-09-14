---
title: 多主机同步更新blog
date: 2024-09-12 12:55:43
tags:
  - npm	
  - hexo  Building
categories:
  - Hexo Building
author: 笑清
copyright: true 
---

# 写在前面

最近换了主机，需要在多地同步更新blog，找到了办法，记录一下

需要使用到`GitHub`

[原文地址](https://blog.csdn.net/K1052176873/article/details/122879462)

<!--more-->

## 1. hexo blog目录结构

![image-20240912175916838](image-20240912175916838.png)

| 文件夹        | 说明                                                         | 是否需要上传github |
| ------------- | ------------------------------------------------------------ | ------------------ |
| node_modules  | hexo需要的模块，就是一些基础的npm安装模块，比如一些美化插件，在执行`npm install`的时候会重新生成 | 不需要             |
| themes        | 主题文件                                                     | 需要               |
| public        | hexo g命令执行后生成的静态页面文件                           | 不需要             |
| packages.json | 记录了hexo需要的包的信息，之后换电脑了npm根据这个信息来安装hexo环境 | 需要               |
| _config.yml   | 全局配置文件，这个不用多说了吧                               | 需要               |
| .gitignore    | hexo生成的默认的.gitignore模块                               | 需要               |
| scaffolds     | 文章的模板                                                   | 需要               |
| .deploy_git   | hexo g自动生成的                                             | 不需要             |

其中需要上传到`GitHub`的有`themes`、`packages.json`、`_config.yml`、.`gitignore`、`scaffolds`

> `hexo`上传到仓库，即main分支的，其实就是这里的public文件夹

## 2. 同步原理

主要思路是利用git分支来实现`hexo`的同步。

`hexo`生成的静态页面文件默认放在master分支上，这是由`_config.yml`配置文件所决定的

你可以在全局配置文件`_config.yml`中找到这么一段

```yaml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: git@github.com:username/username.github.io.git
  branch: main
```

因此每当我们执行`hexo d`的时候，`hexo`都会帮我们把生成好的静态页面文件推到`main`分支上。

但是执行`hexo d` 对应的分支和默认分支是没有关系的，因为这是由配置文件决定的，配置文件写的哪个分支就是哪个分支。

因此，`hexo`生成的静态博客文件默认放在`main`分支上。`hexo`的源文件（部署环境文件）可以都放在`src`分支上（可以新创建一个`src`分支）。然后把`src`分支设置成默认分支。有小伙伴可能会担心默认分支的改变会不会影响到原来的网页的正常显示，其实如果是用`GitHub Pages`对博客进行托管的话也很简单，第一次搭建博客默认使用main分支作为页面。在下图所示的设置里可以找到。如果不小心搞错了只要把分支设置成静态页面对应的分支就好了。

![img](33df90e6aa039695e8775455bead7e88.png)

把`src`分支设置成默认分支，用来存放源文件，`main`分支依然存放静态文件。在老电脑上，我们需要把必要的源文件`push`到`src`分支。换新电脑时，直接`git clone` 仓库地址此时会从`src`分支下载源文件，剩下的就是安装`hexo`环境，在新电脑上就可以重新生成静态页面了，并且因为配置文件`clone`下来，`deploy`配置依旧是`main`分支，所以在新电脑上执行`hexo d`还是会把更新过后的静态文件推送到`main`分支上。

由于`main`分支和`src`分支实际上是相互独立的两个普通的分支，所以我们源文件和静态页面的更新也是相互独立的，故而需要手动分别执行`git add .` `git commit` `git push`来更新源文件,然后执行`hexo d`更新静态页面。

## 3. 同步操作

### 3.1 旧主机的操作

在`GitHub`对应的`repo`新建一个`src`分支，`clone`下来，并修剪文件结构，只留下上面提到的需要的文件和文件夹，并同步更新`.gitignore`。

之后将这个分支`push`到`repo`

将`src`分支设置为`repo`的默认分支

### 3.2 新主机的操作

`clone`新建的`src`分支

安装对应的`nodejs`以及`npm`

在对应的`username.github.io`文件夹下执行`npm install -g`、`npm install -g hexo`、`npm install  -g hexo-deployer-git`

> 上面步骤中，`npm -g install`其实就是读取了`packages.json`里面的信息，自动安装依赖
