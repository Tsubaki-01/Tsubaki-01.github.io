---
title: Hexo博客-发布博客到互联网
date: 2021-12-21
tags:
  - Hexo Building
categories:
  - Hexo Building
author: 笑清
copyright: true  
---

# 写在前面

要想让他人在互联网看到我们的博客，我们需要把本地文件上传。

<!--more-->

# 配置

## deploy

在博客文件夹找到_config.yml，打开。（推荐用vs或vscode，记事本也行）

在最后加入以下内容

```
deploy:
  type: git
  repository: https://github.com/"your github name"/"your github name".github.io
  branch: main
```

保存

## deployer

在Git Bash中输入

```
cnpm install hexo-deployer-git --save
```

安装部署工具

# 令牌

在github中按下图在setting中新建令牌

![](/images/hexo-yunduan/hexo-github-token.png)

expiration（有效期）可以按自己喜好设置，下面全部选项勾选

**新建后一定要将令牌记下来！！！只有新建的时候才能看到token的内容！！！**

# 部署

在Git Bash中依次输入

```
hexo clean
hexo g
hexo d
```

将本地内容上传到github仓库。

> **注意：**hexo d命令由于国内墙的原因，需要尝试多次，或者挂个代理。这也让我很头疼，但暂时没有什么好的解决办法。hexo d命令需要我们输入的是github用户名和token，并不是密码或秘钥。

hexo d显示deploy done：git 即部署成功

# 完成

最后一步hexo d成功部署之后，我们本地文件已经上传到了github仓库，这时我们就可以通过仓库网址访问我们的博客啦。

> 网址："your github name".github.io





> 至此，我们就完成了hexo博客的搭建，接下来我会继续分享如何**将github博客站点与个人域名绑定**，以及**如何美化该博客**
