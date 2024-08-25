---
title: Hexo博客-本地内容生成
date: 2021-12-12
tags:
  - Hexo Building
categories:
  - Hexo Building
author: 笑清
copyright: true 
---
# 写在前面

在绑定完成ssh之后，我们需要先在本地生成内容。

<!--more-->

# 安装hexo

在本地所要存储博客文件的文件夹右键打开Git Bash，输入

```
cnpm install -g hexo
```

结果如下图

![](/images/hexo-bendi/hexo_install.png)

## hexo 初始化

在Git Bash中输入

```
hexo init
```

结果如下图

![](/images/hexo-bendi/hexo_init.png)

> 成功后我们可以看到所在文件夹多了如下图的文件，这就是我们hexo博客最开始的样子😘
>
> ![](/images/hexo-bendi/hexo_files.png)



# hexo本地网页生成

第一次在本地生成我们的博客网站之前，我们需要了解一下hexo的几个基础命令

以下命令均在Git Bash中运行（参考hexo-helloworld，可在\source\_posts中寻得）

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server 或 $ hexo s
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate 或 $ hexo g
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy 或 $ hexo d
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)



了解之后，我们就可以在Git Bash中输入hexo s 生成本地网页啦

当然，我们得进入本地网址 localhost:4000 才能看到！

[本地](localhost:4000)

> 就如之前所说，我们可以在Git Bash中用ctrl+c中止此次命令，即结束本地网页。
