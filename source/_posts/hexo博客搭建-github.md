---
title: Hexo博客-github repositories连接
date: 2021-11-28
tags:
  - Hexo Building
categories:
  - Hexo Building
author: 笑清
copyright: true 
---

# 写在前面

上一篇博客中我们已经完成了搭建hexo博客所需要的环境，也就是nodejs与Git的安装，而我们想要搭建网站就必须要有个服务器，来处理流量，让你上传的东西能够被他人看见。

<!--more-->

最开始我想要做博客的契机，也是因为今年六月份买的一个ali云服务器一直闲置着，想要物尽其用。但是在搜索了各类搭建博客的教程之后，发现利用自己服务器搭建博客所需要的计算机网络知识似乎远远超出了我当下的水平，而利用github的仓库作为我们博客的服务器则可以很好解决这个问题。（并且不用担心续费服务器问题！！！🧐）

# 创建github账号

emmm

既然要白嫖github的服务器，那么肯定要创建一个github账号啊哈哈。

github官网很好找到，但因为墙的原因，完成账号注册需要较长的时间，并且等待往往让人抓狂。我这里推荐一个浏览器插件Hoxx，可以在一定时间内免费达到科学上网的目的，用来初步浏览github是完全够用的。当然，这段可能大部分时候属于是赘述了哈哈，大伙应该都有这类方法。

# 新建仓库

我们创建或者登录github账号之后，需要做的就是新建一个仓库，以用来存放我们的博客文件。

![](/images/hexo-github/new_repositories.png)

我们需要做一些设置，如下图。your name  就是我们的github用户名（就是方框左边的）

![](/images/hexo-github/repositories_choice.png)

> 新建仓库成功

# SSH

> [一篇很好的解释文章](https://zhuanlan.zhihu.com/p/134349361)

接下来我们需要进行SSH的绑定。

## 本地生成ssh

在任意一个文件夹右键打开Git Bash界面，输入

``` 
ssh
```

查看是否已安装ssh

> **Git Bash 中复制与粘贴与Windows不同。ctrl+c用来中止进程，而Shift+insert则是唯一的粘贴快捷键（右键+Paste也可完成粘贴）**

![](/images/hexo-github/ssh.png)

确认已经安装ssh之后，输入

```
ssh-keygen -t rsa -C "邮箱地址" 
```

> 邮箱地址替换成github的注册邮箱

之后不需要输入，一直回车即可。

这样我们就在本地生成了ssh秘钥。我们可以在“用户”文件夹中找到“.ssh”文件夹，说明生成成功。

## 绑定ssh

我们在“.ssh”文件夹中找到“id_rsa.pub”文件，里面存储着我们刚才生成的ssh公钥。以记事本打开，将其中的所有内容复制。

打开github，在“settings”中找到“SSH and GPG keys”，点击“New SSH key”

![](/images/hexo-github/addnewkey.png)

![](/images/hexo-github/addnewkey2.png)

title栏按喜好填写，在key栏中粘贴刚刚复制的公钥。点击“Add SSH key”完成创建。

这样我们就完成了ssh的绑定。

### 验证是否绑定成功

我们在Git Bash中键入

```
ssh -T git@github.com
```

查看我们是否绑定成功。

在提示出现后输入“yes”，回车。

查看是否出现自己的github用户名。

会有提示successfully......即成功。
