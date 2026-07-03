+++
title = "Ubuntu 系统的安装与配置"
date = "2020-03-19T10:33:30+08:00"
lastmod = "2020-03-20T10:33:30+08:00"
tags = ["linux"]
dropCap = false
displayExpiredTip = true
+++

## 前言

大一的时候第一次接触到了 Linux，在我的计算机中安装了 Win10 + Ubuntu 双系统。但因为我并没有学习有关 Linux 系统的课程（毕竟是一个非计算机学院学生），对于 Linux 的使用很生疏； 平时专业课需要各种基于 Windows 系统的设计软件，硬盘的空间也越来越小——最终将其删除了。目前专业必修课基本已经结束学习，有了充足的时间让我来学习自己感兴趣的领域。昨天一位学长向我们介绍 YOLO V3 算法，建议我们在 Linux 上深度学习……于是，我又把 Ubuntu 系统给装回来了。本文以 Windows 10 系统为主系统，BIOS 模式为 UEFI，安装的 Ubuntu 版本为 18.04 LTS。

## 准备

首先需要将 Windows 的快速启动和安全启动功能关闭。进入系统设置中的「电源和睡眠」设置页面，点击右边的「其他电源设置」。

![install-ubuntu-desktop-0.png](/images/install-ubuntu-desktop-0.png "「电源和睡眠」设置页面")

这里进入了「电源选项」页面，在当前页面的左边，点击「选择电源按钮的功能」。

![install-ubuntu-desktop-1.png](/images/install-ubuntu-desktop-1.png "「电源选项」页面")

在页面的下方有关于关机的相关设置，不过勾选框的灰色的，无法勾选。我们需要点击上方的「更改当前不可用的设置」，接着就可以取消勾选了。将「启动快速启动(推荐)」取消勾选即可。

![install-ubuntu-desktop-2.png](/images/install-ubuntu-desktop-2.png "「选择电源按钮的功能」页面")

![install-ubuntu-desktop-3.png](/images/install-ubuntu-desktop-3.png "取消勾选「启动快速启动(推荐)」")

接着重启计算机，进入 BIOS，在 Security 页面中设置 Secure Boot 为 Disabled。对于如何进入 BIOS 的问题，不同厂家的计算机进入的方法也不同。我使用的是 ThinkPad，开机显示 LOGO 的时候，按 Enter 键，然后再按 F1 键即可进入。

下面我们需要进行硬盘分区。在现有硬盘的基础上划分一块区域来安装 Ubuntu 系统。右键「这台电脑」，点击「管理」选项，进入计算机管理页面。然后点击「磁盘管理」，我们就可以看到目前计算机硬盘的分区情况。挑选一个你要进行分区的硬盘，右键，点击「压缩卷」，压缩的大小即为你要分区的大小。图中所示的两个盘即为我分出来的，总共为 80G，这里不用进行细分，在下面安装 Ubuntu 的时候再进行细分，这里只要分出一块区即可。

![install-ubuntu-desktop-4.png](/images/install-ubuntu-desktop-4.png "硬盘分区")

然后，在[官网](https://ubuntu.com/download/desktop)下载对应版本的系统镜像，然后准备一个空的 U 盘，使用刻录软件将系统镜像刻录在 U 盘中。下载系统镜像的时候可能因为网速问题，下载得很慢，我建议使用国内镜像网站下载，比如[阿里云镜像](http://mirrors.aliyun.com/ubuntu-releases/18.04/)。刻录软件我使用的是 [UltraISO 软碟通](https://cn.ultraiso.net/)。

## 安装

我们制作了 U 盘启动盘，将 U 盘插入计算机，选择 U 盘启动。ThinkPad 计算机使用 U 盘启动的方法为：重启计算机，在开机 LOGO 页面按 Enter 键，再按 F12，选择 USB 启动选项。等待片刻，在窗口中选择 Install Ubuntu，就进入到了 Ubuntu 的图形操作界面，接下来就可以顺利地进行安装了。

语言选择中文，键盘布局选择默认的汉语，连接 WiFi，在「更新和其他软件」中选择「正常安装」选项。

![install-ubuntu-desktop-5.jpg](/images/install-ubuntu-desktop-5.jpg "选择语言")

![install-ubuntu-desktop-6.jpg](/images/install-ubuntu-desktop-6.jpg "选择键盘布局")

![install-ubuntu-desktop-7.jpg](/images/install-ubuntu-desktop-7.jpg "连接网络")

![install-ubuntu-desktop-8.jpg](/images/install-ubuntu-desktop-8.jpg "选择「正常安装」")

在「安装类型」中，系统检测到你的计算机中存在 Windows Boot Manager，询问你要选择如何安装 Ubuntu。我们直接选择「其他选项」即可，相当于自定义安装。

![install-ubuntu-desktop-9.jpg](/images/install-ubuntu-desktop-9.jpg "选择「其他选项」")

接下来是最关键的分区操作。选中之前分出来的 80G 空闲区，点击 + 号，添加新的分区。我们只需要划分两个区，一个是 `/swap`，一个是 `/`。至于其他的一些区，比如 `/home`、`/usr` 等等不用分区，因为空间大小固定后，将来如果空间不足会很麻烦。

![install-ubuntu-desktop-10.jpg](/images/install-ubuntu-desktop-10.jpg "Ubuntu 分区")

`/swap` 区我们分配 16 G，因为我的计算机内存为 16G 大小。分区类型选择「逻辑分区」，位置为「空间起始位置」，用于「交换空间」。

![install-ubuntu-desktop-11.jpg](/images/install-ubuntu-desktop-11.jpg "`/swap` 区")

剩下的容量全部分配给 `/` 区。分区类型选择「主分区」，位置为「空间起始位置」，用于「Ext4 日志文件系统」，挂载点为 `/`。

![install-ubuntu-desktop-12.jpg](/images/install-ubuntu-desktop-12.jpg "`/` 区")

完成后，我们需要查看 `/` 区的设备名是什么。这里我的是 /dev/sdb6。一般来说名称为 /dev/sdaX 或者 /dev/sdbX （X 为阿拉伯数字）。记下该区的名字，在窗口最下方的「安装启动引导器的设备」处，选择该区。注意一定不要选错。

![install-ubuntu-desktop-13.jpg](/images/install-ubuntu-desktop-13.jpg "安装启动引导器")

然后是选择时区，这里默认的是上海。最后需要填写计算机的基本信息，设置用户名和密码。

![install-ubuntu-desktop-14.jpg](/images/install-ubuntu-desktop-14.jpg "选择时区")

![install-ubuntu-desktop-15.jpg](/images/install-ubuntu-desktop-15.jpg "填写基本信息")

以上步骤完成后，静静等待安装即可。

![install-ubuntu-desktop-16.png](/images/install-ubuntu-desktop-16.png "Ubuntu 用户图形界面")

## 配置

### 更换国内源

为了节省下载某些软件包的速度，可以考虑将源换为国内的镜像源。打开终端，执行下面的命令。

```sh
sudo gedit /etc/apt/sources.list
```

将 sources.list 文件中的内容注释掉，更换为阿里云的源：

```sh
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```

### 安装软件

**安装 Chrome 浏览器**：

```sh
sudo apt-get install google-chrome-stable
```

**安装 TIM（或 QQ）**：

首先我们需要安装 Ubuntu 移植版 Deepin-wine 环境。前往 [GitHub 仓库](https://github.com/wszqkzqk/deepin-wine-ubuntu)下载压缩包文件。解压后切换到解压文件目录，在终端中输入下述代码安装：

```sh
sudo sh ./install.sh
```

然后就可以安装相关应用。前往 <https://mirrors.aliyun.com/deepin/pool/non-free/d/deepin.com.qq.office/> 下载 TIM，完成安装即可顺利运行。其他的一些应用可以在 <http://mirrors.aliyun.com/deepin/pool/non-free/d/> 中寻找。

**安装搜狗输入法**：

首先执行如下两个命令安装必须的框架：

```sh
sudo apt-get install fcitx-bin
sudo apt-get install fcitx-table
```

安装后重启系统，进入语言设置，将键盘输入法系统的 iBus 替换为刚刚安装的 fcitx。

![install-ubuntu-desktop-18.png](/images/install-ubuntu-desktop-17.png "将键盘输入法系统替换为 fcitx")

点击 Ubuntu 顶栏右边的小键盘图标，打开输入法配置窗口。按照下图所示的顺序排序。键盘按 Ctrl + Space 键，即可启用中文输入法。

然后下载 Linux 版的搜狗输入法，在[这里](https://pinyin.sogou.com/linux/?r=pinyin)下载，安装后返回输入法配置窗口，可以看到搜狗输入法已经添加进输入法中，我们将搜狗输入法排序到第二位即可。

![install-ubuntu-desktop-19.png](/images/install-ubuntu-desktop-18.png "输入法配置")

### 界面美化

目前我进行了一些简单的美化，当前的操作界面如下图所示。

![install-ubuntu-desktop-17.png](/images/install-ubuntu-desktop-19.png "美化后的界面")

首先执行以下命令安装主题工具 GNOME Tweaks：

```sh
sudo apt-get install gnome-tweak-tool
sudo apt-get install gnome-shell-extensions
```

打开 Tweaks，在「扩展」中开启「User themes」。

![install-ubuntu-desktop-20.png](/images/install-ubuntu-desktop-20.png "开启「User themes」")

进入网站 <https://www.opendesktop.org/>，在 GTK3 Themes 中挑选桌面主题下载。将下载好的压缩包解压，再将该文件夹移动到 `/usr/share/themes/` 目录下。

```sh
sudo mv filename /usr/share/themes/
```

然后就可以在 Tweaks 的主题设置中选择刚才下载好的主题。图标的设置与主题相同，到上述网站下载图标，将文件夹移动到 `/usr/share/icons/`，在 Tweaks 的图标设置中选择该图标。

至于 Dock 样式的修改，到 Ubuntu 软件应用下载 Dash to Dock 即可。

## 参考

1. [Win10 安装 Ubuntu 18.04 LTS 双系统 | owolf](https://www.jianshu.com/p/38e6be8efecf)
2. [Ubuntu：更换国内源 | 赵水木](https://www.jianshu.com/p/eb9bd6142c71)
3. [Ubuntu18.04 下安装 TIM | water&12](https://blog.csdn.net/qq_32896115/article/details/90371213)
4. [解决 Ubuntu 18.04 中文输入法的问题，安装搜狗拼音 | 一种记忆](https://blog.csdn.net/fx_yzjy101/article/details/80243710)
5. [Ubuntu 18.04 美化主题（完整版）| B丶atty小鹿](https://blog.csdn.net/qq_42527676/article/details/91356154)