+++
title = "树莓派，启动"
date = "2020-04-11T21:23:31+08:00"
lastmod = "2020-04-12T21:23:31+08:00"
tags = ["linux","raspberry-pi"]
displayExpiredTip = true
+++

几天前从淘宝上买的树莓派 4B 和一堆配件终于到货了。为什么要买树莓派呢？大一的电子工程训练课程中有一项任务就是通过「伪」树莓派进行简单的物联网设计，从那时起就很想拥有一个树莓派做一些小研究。正好这学期一门课程的设计作业是要做一个垃圾分拣车，我们小组已经购买了一个树莓派，但因为疫情影响，小组目前无法共同完成项目设计，我就决定自己单独买一个属于自己的树莓派——不用担心自己的胡乱操作对课程设计造成影响。

![raspberry-pi-start-0.jpg](/images/raspberry-pi-start-0.jpg)

由于是第一次接触树莓派，一切都是从零开始。首先在[官网](https://www.raspberrypi.org/downloads/)下载系统镜像，将存储卡插入计算机，通过 [Etcher](https://www.balena.io/etcher/) 软件将系统镜像烧录进存储卡，在根目录下新建 SSH 文件。然后将存储卡插入树莓派，连接电源，用网线将树莓派与我的笔记本电脑相连。

![raspberry-pi-start-1.png](/images/raspberry-pi-start-1.png "烧录系统")

在系统初始化的操作中，遇到的第一个问题就是如何查找树莓派的 IP 地址。首先我的笔记本电脑连接的是家中的 WiFi，需要在计算机的「网络和共享中心」设置 WLAN 链接共享。

![raspberry-pi-start-2.png](/images/raspberry-pi-start-2.png "网络设置")

然后在 CMD 中输入 `arp -a` 查询 IP 地址，在没有连接树莓派之前，有以下列表。

![raspberry-pi-start-3.png](/images/raspberry-pi-start-3.png "IP 地址查询")

连接树莓派后，有以下列表，蓝框中的是连接后多出的列表，由此可以确定红框内的是树莓派的 IP 地址。

![raspberry-pi-start-4.png](/images/raspberry-pi-start-4.png "红框内为树莓派的 IP 地址")

接下来通过 XShell 通过 IP 地址远程登录树莓派，输入默认的用户名和密码，连接，成功。

![raspberry-pi-start-5.png](/images/raspberry-pi-start-5.png "连接树莓派")

由于目前没有显示器，想要通过图形界面操作的话，需要通过开启 VNC 通过计算机进行远程控制。在终端执行 `sudo raspi-config` 命令，然后选择第五项「Interfacing Options」，再将第三项「VNC」设置为 *enable*，开启 VNC 服务。

![raspberry-pi-start-6.png](/images/raspberry-pi-start-6.png "选择「Interfacing Options」")

![raspberry-pi-start-7.png](/images/raspberry-pi-start-7.png "开启 VNC")

然后下载 VNC Viewer 软件，输入 IP 地址，再输入用户名和密码即可访问图形界面。

![raspberry-pi-start-8.png](/images/raspberry-pi-start-8.png "VNC Viewer 登录")

如果无法访问，提示「Cannot currently show the desktop」，可能是因为分辨率设置的问题，执行 `sudo raspi-config` 命令，选择第七项「Advanced Options」，再选择第五项「Resolution」，设置分辨率大小为第一项默认的「720x480」以外的分辨率即可。

如果需要将树莓派设置为中文的话，按照网络上其他人的教程，首先需要安装中文字库：

```sh
sudo apt-get install ttf-wqy-zenhei
```

这里安装的是文泉驿的开源中文字体。然后依然是执行 `sudo raspi-config` 命令，选择第四项「Localisation Options」，再选择第一项「Change Locale」，在出现的语言列表中选择 *zh_CN.GB2312*，*zh_CN.GB18030*，*zh_CN.GBK*，*zh_CN.UTF-8*，确认后还需要选择默认的系统环境语言，这里选择 *zh_CN.UTF-8*，然后重启系统。但是我按照这样的步骤进行下来，系统并没有显示为中文。

我是通过系统首选项「Preferences」的系统设置「Raspberry Pi Configuration」中的「Localisation」，点击「Set Locale...」，在「Character Set」中选择 *GB18030*，重启后即可显示中文。

![raspberry-pi-start-9.png](/images/raspberry-pi-start-9.png "中文语言设置")

对于中文输入法，这里需要注意的是，在系统设置中要将键盘设置为美式键盘。我是用的是 SCIM 输入法。执行以下命令安装：

```sh
sudo apt-get install scim-pinyin
```

我在初次安装后并没有在键盘选项中看到中文输入的选项，这时先退出 SCIM 输入法，然后在终端执行 `sudo scim` 重启键盘，就能愉快的输入中文了。

经过一系列的初始化设置后，树莓派的桌面终于呈现在眼前。

![raspberry-pi-start-10.png](/images/raspberry-pi-start-10.png "树莓派桌面")