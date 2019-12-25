+++
title = "玉泉校区上网指南"
date = "2019-09-04T15:39:44+08:00"
tags = ["ip","google","zju"]
aliases = ["/2019/09/04/internet-service-in-yuquan/"]
dropCap = true
displayCopyright = true
gitinfo = true
toc = true
+++

初来玉泉校区，遇到的第一个问题就是，如何将计算机与有线网络相连？在紫金港的两年中，不论是笔记本电脑，手机还是平板，我大部分时间用的都是 ZJUWLAN 无线网络。虽然经常吐槽校园网的垃圾，但说实话，浙大的网络服务比大部分学校好多了。

在紫金港经常用无线网络的原因有以下几点：第一，笔记本电脑连着网线后，只能将放在桌子上老老实实地操作，而连着无线网，就可以端着笔记本电脑到床上去看；第二，我上课的时候经常背着笔记本电脑，一直连着无线网络比在宿舍里来回插拔网线方便一些；第三，我的位置上的网线接口有一些毛病，接触不良，导致我如果连接网线的话，可能过一会就掉线了。

既然来到了玉泉，老老实实用无线网络是不可能的，有线网络的优势还是足够吸引人，网线接口接触很好，而且网络支持 IPv6 协议，进入一些 404 网站不在话下。只要接入网线，网络速度起飞，下载内网资源的速度令人极度舒适。除此之外，听一些学长说，宿舍楼里的无线网信号很差，~~不过我现在还没遇到这样的问题~~，实践证明，真的很差。所以，在玉泉，连接有线网络绝对是最佳选择。

玉泉的有线网络连接，比紫金港稍微复杂了那么一点点。因为紫金港宿舍楼分配的是动态 IP 地址，直连就可以，而玉泉宿舍楼分配的是静态 IP 地址，需要自己去申请一个 IP 地址。目前我在 CC98 上搜索到的玉泉上网方法都是过时的版本，如今已经不能再用。下面就详细讲述一下目前在玉泉校区如何连接有线网络以及自建 VPN 的方法。

## 有线网络连接

### 查询网卡 MAC 地址

#### Windows 10

目前 Windows 系统使用最多的是 Win10 版本的，因此这里我主要 Win10 系统的方法，如果你使用的是 Win7 也可参考，假如对网络设置一点也不懂，可以自行 Google。

首先找到桌面右下角网络连接的图标，右键，进入「打开 “网络和 Internet” 设置」。

![internet-service-in-yuquan-0.jpg](/images/internet-service-in-yuquan-0.jpg)

然后点击「查看网络属性」，即可查询到网卡的 MAC 地址。

![internet-service-in-yuquan-1.jpg](/images/internet-service-in-yuquan-1.jpg)

![internet-service-in-yuquan-2.jpg](/images/internet-service-in-yuquan-2.jpg)

#### Mac OS X

如果是 Macbook Pro 之类的没有 RJ45 网口的电脑，需要先插上带网口的扩展坞（以下用 Macbook Pro 作为示例）。

打开 Terminal（终端命令行工具，可以直接在搜索栏内搜索打开），在插上扩展坞之前，运行：

```bash
$ cd ~/Desktop
$ ifconfig > mac-addr-none
```

在插上 USB 扩展坞之后等待几秒钟：

```bash
$ ifconfig > mac-addr
$ diff mac-addr mac-addr-none
```

最后删除临时文件：

```bash
$ rm mac-addr*
```

如下图所示：

![internet-service-in-yuquan-3.jpg](/images/internet-service-in-yuquan-3.jpg)

### 申请 IP 地址

在老版本的教程中，说的是需要进入某个网站进行申请，目前该网站申请通道已经关闭，唯一的方法就是通过微信公众号进行申请。

从「浙大学生公寓管理服务中心」微信公众号进入「iHome」，在「iHome」的公寓服务栏内进入「IP 地址申请」。

![internet-service-in-yuquan-4.jpg](/images/internet-service-in-yuquan-4.jpg)

进入「申请新 IP 地址」，填入你的网卡 MAC 地址和手机号码即可获取到一个 IP 地址。这里输入 MAC 地址的时候不需要输入冒号。

![internet-service-in-yuquan-5.jpg](/images/internet-service-in-yuquan-5.jpg)

记下获取到的 IP 地址、网络掩码等相关数据。

### 网络属性设置

<p id="div-warning">
由于我使用的是 Win10，下面的操作只适用于 Windows 系统，Mac OS X 请自行设定。
</p>

回到「“网络和 Internet” 设置」界面，进入「更改适配器选项」。

![internet-service-in-yuquan-6.jpg](/images/internet-service-in-yuquan-6.jpg)

右键点击以太网的「属性」选项。

![internet-service-in-yuquan-7.jpg](/images/internet-service-in-yuquan-7.jpg)

双击如下图所示的内容，进入网络设定界面。

![internet-service-in-yuquan-8.jpg](/images/internet-service-in-yuquan-8.jpg)

选取「使用下面的 IP 地址」，输入之前申请 IP 时获取到的数据即可。

![internet-service-in-yuquan-9.jpg](/images/internet-service-in-yuquan-9.jpg)

等待二十四小时之后就能够通过有线网络愉快地上网了。

另外，上网的时候，还需要一个拨号上网的软件，学校提供了[下载地址](http://itc.zju.edu.cn/2017/1207/c7936a728417/page.htm)，下载最新版本即可，新版本同样支持无线网 ZJUWLAN 的连接。如果你不想用学校提供的软件，也可以使用下面的方法，自建一个 VPN。

## 自建 VPN

<p id="div-warning">
同样，这里仅给出的是 Win10 系统的设置方法。
</p>

依旧是「“网络和 Internet” 设置」界面，进入「网络和共享中心」。

![internet-service-in-yuquan-10.jpg](/images/internet-service-in-yuquan-10.jpg)

点击「设置新的连接或网络」。

![internet-service-in-yuquan-11.jpg](/images/internet-service-in-yuquan-11.jpg)

选择「连接到工作区」，创建新连接。

![internet-service-in-yuquan-12.jpg](/images/internet-service-in-yuquan-12.jpg)

![internet-service-in-yuquan-13.jpg](/images/internet-service-in-yuquan-13.jpg)

选择「使用我的 Internet 连接 (VPN)」。

![internet-service-in-yuquan-14.jpg](/images/internet-service-in-yuquan-14.jpg)

在「Internet 地址」一栏输入 `10.5.1.5`，「目标名称」任意填写。

![internet-service-in-yuquan-15.jpg](/images/internet-service-in-yuquan-15.jpg)

然后进入「更改适配器选项」，右键你自定义名称的 VPN连接，进入属性设置。

![internet-service-in-yuquan-16.jpg](/images/internet-service-in-yuquan-16.jpg)

在「安全」选项卡中，「VPN 类型」选用 IPsec 的第 2 层隧道协议。因为学校 VPN 的类型是 L2TP ，全程就是基于 IPsec 的第二层隧道协议之类。

![internet-service-in-yuquan-17.jpg](/images/internet-service-in-yuquan-17.jpg)

「数据加密」确定为「可选加密」。因为学校没有开启加密。下面勾选「允许使用这些协议」，再勾选如图所示的选项，确认即可。

![internet-service-in-yuquan-18.jpg](/images/internet-service-in-yuquan-18.jpg)

然后，你就可以在网络连接里输入用户名和密码进行连接了。

![internet-service-in-yuquan-19.jpg](/images/internet-service-in-yuquan-19.jpg)

## 参考

1. [玉泉寝室无线路由器（荣耀路由）上网 | Fenghe's Blog](https://fenghe.us/yq-honor-wireless-router-tutorial/)。
2. 浙江大学 e 志者协会 ZJUVPN 自建教程 | Xero Essential。