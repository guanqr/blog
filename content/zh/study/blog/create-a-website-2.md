+++
title = "一键快速部署 WordPress 博客程序"
date = "2019-04-16T00:19:35+08:00"
tags = ["WordPress","Linux"]
categories = ["study","blog"]
series = ["Build-Up-Blog"]
displayCopyright = true
gitinfo = true
+++

[^1]![wordpress-screen-themes.png](/images/wordpress-screen-themes.png "WordPress 控制面板")

在依照以下方式进行 WordPress 网站建立之前，你需要安装好宝塔面板。具体操作过程请看我的另一篇文章《[Linux 系统安装宝塔面板建站](/posts/create-a-website-1/)》。

## 准备工作

1. 首先需要在 VPS 中部署好宝塔面板，而且建议是最新版本。
2. 准备的域名已经解析到当前服务器的 IP 地址且生效，这里以我曾经的域名为例。

## 启动一键部署程序

这里登录宝塔面板之后，我们可以看到「宝塔一键部署源码」。

![install-wordpress-0.png](/images/install-wordpress-0.png)

我们在博客分类中找到需要的 WordPress 源码，点击一键部署。

![install-wordpress-1.png](/images/install-wordpress-1.png)

输入需要绑定的域名，以及确认目录以及源码没有问题之后就可以直接提交安装。我们需要记住给生成的数据库信息，等会安装需要用到。

![install-wordpress-2.png](/images/install-wordpress-2.png)

![install-wordpress-3.png](/images/install-wordpress-3.png)

## 安装 WordPress

根据向导点击域名，会看到 WP 程序的安装过程，输入我们上面保存的数据库信息。以及一步步进行站点的配置。网站的管理员用户名和密码需要自己设置。

![install-wordpress-4.png](/images/install-wordpress-4.png)

## 安装成功

输入密码，等待安装成功后，进入控制面板，就可以开始写你的第一篇文章啦。

<p id="div-warning">在进行建站的过程中，各位一定要保护好自己的账号密码，最好在设定完成之后进行更改！</p>

[^1]: 图源：<https://wordpress.org/>。