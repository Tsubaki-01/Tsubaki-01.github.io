---
title: Hexo博客-环境搭建
date: 2021-11-02
tags:
  - Hexo Building
categories:
  - Hexo Building
author: 笑清
copyright: true 
---

# 写在前面

在介绍使用Hexo搭建个人博客所必备的环境之前，先说明我们为什么采用Hexo框架。

首先，搭建个人博客采用框架的选择其实很丰富，有Hexo、Hugo和WordPress等。但如果是搭建个人博客，Hexo在开源内容方面是较为丰富的，各种主题插件资源能够在GitHub等网站上找到。

另一方面是Hexo框架用户基数大，遇到的各种问题可以很容易在网上找到解答，教程也是较多的。

<!--more-->

> [本篇文章参考](https://www.bilibili.com/video/BV1mU4y1j72n?from=search&seid=11261496233121285254&spm_id_from=333.337.0.0)

## Node.js配置

> [Node.js官网安装](https://nodejs.org/en/download/)
>
> [Node.js中文网](http://nodejs.cn/)
>
> > [What is Node.js](https://www.sitepoint.com/node-js-is-the-new-black/)

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型,使其轻量又高效。Node.js 的包管理器 npm,是全球最大的开源库生态系统。(官网介绍)

总之，我们需要Node.js这个工具以及其包管理器npm，而具体的原理在上面的文件中有专业说明，鉴于我也是一知半解，就不在此赘述。😣

### Node.js下载

在Node.js官网的download选项中选择与自身计算机相匹配的系统版本下载。

![](/images/hexoenvironment/Nodejs.png)

### Node.js安装

打开下载好的安装包，除了在安装路径选项处修改默认的C盘路径到自己想要的硬盘路径，一路点击next，完成安装。

为了防止不可知的错误，我们要对node测试是否安装成功。

按下【win+R】打开运行对话框，输入【cmd】进入命令行，依次输入

```
node -v
npm -v
```

若Nodejs安装成功，将会显示当前版本。(这里的cnpm会在后面介绍)

![](/images/hexoenvironment/nodetest.png)

### Node环境配置

成功安装完Node.js后，在所选路径中会包含一个名称为“node_modules”的文件夹以及一些文件。这时我们如果要保证之后所添加的插件不被默认安装在C盘，我们需要修改我们的安装路径。

首先，在nodejs文件夹中新建两个文件夹，文件夹名分别为“node_cache”与"node_global"。

创建完两个文件夹后，在命令行中输入以下命令：

```
npm config set prefix "...\nodejs\node_global"
npm config set cache "...\nodejs\node_cache"
```

接下来需要修改环境变量&nbsp; “此电脑->属性->高级系统设置->环境变量”&nbsp; 用户变量中选择“Path”，点击“编辑”，“新建”，键入你刚刚建立的node_global文件夹路径，确定，完成环境配置。

### cnpm安装

由于国内墙的存在，使用npm下载安装插件时经常会出现连接超时的情况，这时，我们可以安装淘宝cnpm镜像来解决这个问题。而在之后的命令中，若npm命令失败，可以采用cnpm命令进行替代。

在cmd命令行中输入

```
npm install -g cnpm -registry=https://registry.npm.taobao.org
```

等待安装结束后输入

```
cnpm -v
```

查看cnpm版本号。若出现上方截图中类似情况，则cnpm安装成功。

> 至此，Nodejs配置完成，其中最为重要的是环境变量的设置。这个问题解决方法很多，这里只是列出了一种在我个人电脑上可以实现的方法，若出现不同情况，可以在搜索引擎与论坛上寻找答案。
>
> 另外，对于cnpm的安装，大家可以在cmd命令行中键入"npm install express -g"、"cnpm install express -g"等安装实例来检测npm或cnpm是否安装成功。

## Git配置

> [Git官网](https://git-scm.com/) 

Git是世界上最优秀的开源分布式版本控制系统之一，我们需要它来帮助我们管理博客项目。

### Git下载

在Git官网下载对应版本的Git，可以看到，在官网的右侧会自动检测你的系统，推荐相应版本安装。如果与你的计算机版本有出入，可以点击download来选择安装对应版本。

![](/images/hexoenvironment/Git.png)

### Git安装

打开下载好的安装包，除了在安装路径选项处修改默认的C盘路径到自己想要的硬盘路径，一路点击next，完成安装。

安装完成后，在开始菜单可以看到Git的三个启动项，分别为Git Bash、Git Cmd、Git Gui，他们也同时被绑定到我们的右键菜单中（可以修改右键菜单，只留下Git Bash）。我们一般使用Git Bash。

在cmd命令行输入

```
git --version
```

查看git版本号以检查是否安装成功。

![](/images/hexoenvironment/gitversion.png)

> 至此，安装Hexo框架之前的准备工作大抵完成，下一篇文章将介绍如何安装Hexo框架并将Hexo框架连接到GitHub的repository以完成Hexo+GitHub.io博客的搭建。

