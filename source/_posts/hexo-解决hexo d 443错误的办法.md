---
title: Hexo-解决hexo d 443错误的办法
date: 2021-12-31
tags:
  - Hexo Building
  - Hexo d 443 timed out
categories:
  - Hexo Building
author: 笑清
copyright: true 
---

总结下解决hexo d指令出现错误代码443的几种办法

<!--more-->

## 一：设置代理

## 二：禁用代理

较常用，但是解决问题概率较低

键入以下语句

```
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 三：修改host文件

这是我试了无数个方法之后找出的 **在我的本地环境下** 较为可行的一种

按以下路径找到hosts文档

C:\Windows\System32\drivers\etc\hosts

> 修改hosts文档需要相应权限，请自行百度如何设置

在hosts文档最后加入以下语句

```
199.59.148.8 github.global.ssl.fastly.net
203.208.39.99 assets-cdn.github.com
140.82.113.4 github.com
140.82.113.4 www.github.com
```

保存即可

> 鉴于本人能力有限，以上方法不一定能100%解决443time out。只是在此汇总我所尝试过的许多方法中较为有用的个别