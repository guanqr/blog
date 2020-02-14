+++
title = "Linux 服务器安装宝塔面板"
date = "2019-04-15T00:00:00+08:00"
tags = ["linux","wordpress"]
aliases = ["/study/blog/create-a-website-1/"]
dropCap = false
+++

![bt-linux-pc-free.png](/images/bt-linux-pc-free.png "宝塔面板")

宝塔面板是当前国内使用最多的 Linux 系统网站面板之一。安装宝塔面板之前，你需要先租一个 VPS 虚拟专用服务器。

## 安装环境和对应一键命令包

CentOS 安装命令：

```
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install.sh && sh install.sh
```

Ubuntu / Deepin 安装命令：

```
wget -O install.sh http://download.bt.cn/install/install-ubuntu.sh && sudo bash install.sh
```

Debian 安装命令：

```
wget -O install.sh http://download.bt.cn/install/install-ubuntu.sh && bash install.sh
```

Fedora 安装命令:

```
wget -O install.sh http://download.bt.cn/install/install.sh && bash install.sh
```

以上是根据不同的 Linux 系统，然后选择对应的一键安装包。

## 宝塔面板安装过程

输入命令之后，回车就可以。

```
Do you want to install Bt-Panel to the /www directory now?(y/n): y
```

在遇到上面提示，我们输入 `y` 后回车，然后会自动安装。

![bt-install.png](/images/bt-install.png)

看到上图，就表示安装完毕。然后我们用所给的宝塔面板地址和用户名密码进入服务器的 `8888` 端口。

## 安装 LAMP 或者 LNMP

登入面板之后，我们选择安装 LAMP 或者 LNMP 一键包。这里需要选择 LNMP，将 PHP 改为 7.2 版

![bt-install-lnmp.png](/images/bt-install-lnmp.png)

等待安装完毕即可。

<p class="note-warning">为了网站的安全，别忘了更改用户名、密码以及端口号。</p>