+++
title = "网络数据监测与分析"
date = "2019-07-10T00:23:42+08:00"
tags = ["network","security"]
series = ["major-courses"]
aliases = ["/2019/07/10/wireshark/","/study/computer/wireshark/"]
dropCap = false
toc = true
displayExpiredTip = true
+++

## Wireshark 简介

[Wireshark](https://www.wireshark.org/) 是一个免费开源的网络数据包分析软件。网络数据包分析软件的功能是截取网络数据包，并尽可能显示出最为详细的网络数据包数据。

### 使用目的

+ 网络管理员使用 Wireshark 来检测网络问题
+ 网络安全工程师使用 Wireshark 来检查信息安全相关问题
+ 开发者使用 Wireshark 来为新的通信协议调试
+ 普通用户使用 Wireshark 来学习网络协议的相关知识

### 软件界面

建立计算机与网络的连接后，可以看到下图所示界面，主要分为四部分内容：显示过滤器、封包列表、封包详细信息、16 进制数据。

![wireshark-main-interface.jpg](/images/wireshark-main-interface.jpg "Wireshark 主界面")

封包列表中各栏所显示的内容含义如下图所示。

![wireshark-packet-list.jpg](/images/wireshark-packet-list.jpg "封包列表")

可以发现，一些行文字的底色不同。不同报文采用不同的颜色来区分。

![wireshark-color-of-message.jpg](/images/wireshark-color-of-message.jpg "报文颜色")

在封包相详细信息中，我们可以看到：

+ Frame：「物理层」数据帧情况。
+ Ethernet：「数据链路层」以太网头部信息。
+ Internet Protocol Version 4：「网络层」数据包头部信息。
+ Transmission Control Protocol：「传输层」数据段头部信息。
+ Hypertext Transfer Protocol：「应用层」信息。

![wireshark-packet-data.jpg](/images/wireshark-packet-data.jpg "封包详细信息")

下面主要讲解使用 Wireshark 对网络层以及传输层的数据分析方法。

## 数据分析

### 网络层

#### 地址解析协议 ARP

不管网络层使用的是什么协议，在实际网络的链路上传送数据帧时，最终还是必须使用硬件地址。每一个主机都设有一个 ARP 高速缓存，里面有所在的局域网上的各主机和路由器的 IP 地址到硬件地址的映射表。当主机 A 欲向本局域网上的某个主机 B 发送 IP 数据报时，就先在其 ARP 高速缓存中查看有无主机 B 的 IP 地址。如有，就可查出其对应的硬件地址，再将此硬件地址写入 MAC 帧，然后通过局域网将该 MAC 帧发往此硬件地址。

其简易原理如下图所示。

![wireshark-arp-diagram.jpg](/images/wireshark-arp-diagram.jpg "ARP 原理示意图")

输入ARP进行筛选，得到一组数据包：

```
Who has 10.171.32.1? Tell 10.171.34.11
10.171.32.1 is at 28:6e:d4:44:20:4f
```

![wireshark-arp-screen.jpg](/images/wireshark-arp-screen.jpg "ARP 筛选")

##### ARP 请求

![wireshark-arp-request.jpg](/images/wireshark-arp-request.jpg "ARP 请求内容")

##### ARP 响应

![wireshark-arp-respond.jpg](/images/wireshark-arp-respond.jpg "ARP 响应内容")

#### 互联网协议 IPv4

以 www.baidu.com 为例，打开命令行 Ping 百度。

![wireshark-ping.jpg](/images/wireshark-ping.jpg "Ping")

在 Wireshark 中，我们可以看到一共抓取了 8 个数据包，与命令行显示的数量一致，分别为双方的请求与应答。

![wireshark-ipv4-data-packet.jpg](/images/wireshark-ipv4-data-packet.jpg "IPv4 数据包")

其详细内容如下图所示。

![wireshark-ipv4-request.jpg](/images/wireshark-ipv4-request.jpg "IPv4 请求")

![wireshark-ipv4-respond.jpg](/images/wireshark-ipv4-respond.jpg "IPv4 应答")

### 传输层

以浙大校论坛 CC98为例。打开浏览器，输入网址：www.cc98.org。

![wireshark-transport-analysis.jpg](/images/wireshark-transport-analysis.jpg "传输层数据分析")

#### TCP 包的具体内容

![wireshark-tcp-data.jpg](/images/wireshark-tcp-data.jpg "TCP 包内容")

#### TCP 的三次握手

![wireshark-tcp-three-way-handshake.jpg](/images/wireshark-tcp-three-way-handshake.jpg "TCP 三次握手")

![wireshark-ping-cc98.jpg](/images/wireshark-ping-cc98.jpg "Ping CC98")

10.10.98.98 为 CC98 的 IP 地址，222.205.87.180 为本地 IP 地址。

##### 第一次握手

![wireshark-tcp-first-handshake.jpg](/images/wireshark-tcp-first-handshake.jpg "第一次握手")

客户端发送一个 TCP，标志位为 SYN，序列号为 0，客户端请求建立连接。

##### 第二次握手

![wireshark-tcp-second-handshake.jpg](/images/wireshark-tcp-second-handshake.jpg "第二次握手")

服务器发回确认包，标志位为 SYN，ACK，将确认序号设置为客户的 ISN 加 1。

##### 第三次握手

![wireshark-tcp-third-handshake.jpg](/images/wireshark-tcp-third-handshake.jpg "第三次握手")

客户端再次发送确认包，SYN 标志位为 0，ACK 标志位为 1，将服务器发来的 ACK 序号字段加 1，放在确定字段中发送给对方。

##### 报文分析

设置过滤条件：

```
http and ip.addr==10.10.98.98 and tcp.port==80
```

得到两个数据包，分别为 HTTP 请求和 HTTP 响应。

![wireshark-http.jpg](/images/wireshark-http.jpg "HTTP 请求与响应")

打开追踪 TCP 流的详细信息界面。

![wireshark-track-tcp.jpg](/images/wireshark-track-tcp.jpg "追踪 TCP 流")

请求报文分析：

![wireshark-http-request.jpg](/images/wireshark-http-request.jpg "请求报文")

响应报文分析：

![wireshark-http-respond.jpg](/images/wireshark-http-respond.jpg "响应报文")

#### TCP 链接释放

![wireshark-tcp-link-release.jpg](/images/wireshark-tcp-link-release.jpg "TCP 链接释放")

## 总结

Wireshark 作为一款网络分析工具，功能很强大，当然也有一些不法分子利用这一类的网络分析工具获取接入同一网络的用户的个人信息，入侵你的通信设备。我接触到这个工具是源于本学期上的一门专业选修课程「数据通信与计算机网络」的实验。通过 Wireshark，我对网络通信的知识有了深入的理解，因此我认为 Wireshark 是一个学习计算机网络通信原理的利器。