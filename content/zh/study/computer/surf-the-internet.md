+++
title = "脚著谢公屐，身登青云梯"
date = "2019-07-02T15:13:22+08:00"
tags = ["ShadowSocks","V2Ray","GFW","Google"]
categories = ["study","computer"]
dropCap = true
displayCopyright = true
gitinfo = true
toc = true
+++

![shadowsocks-logo.png](/images/shadowsocks-logo.png)

## 前言

这篇文章主要写的是我曾经使用过的进行科学上网的方式，需要自己购买服务器进行梯子的搭建，采用的搭建方式偏向小白，按照下面的方式比葫芦画瓢就能够搭建成功。可能有的内容已经过时，仅供参考。

在这里先推荐一些可以参考的资料：

+ https://www.v2ray.com/
+ https://233blog.com/
+ https://233v2.com/
+ https://fenghe.us/category/fuck-gfw/

六月和十月查封了很多 IP，如果是个人使用的话购买 VPS 服务器很不划算，目前我使用的是搬瓦工推出的 Just My Socks 机场服务，具体内容可以参考我的另一篇文章：「[推荐 Just My Socks 机场服务](/blog/computer/just-my-socks/)」。

## 搭建 ShadowSocks

### 简介

ShadowSocks（简称 SS）是一种基于 Socks5 代理方式的加密传输协议，也可以指实现这个协议的各种开发包。当前包使用 Python、C、C++、C#、Go 语言等编程语言开发，大部分主要实现（iOS 平台的除外）采用 Apache 许可证、GPL、MIT 许可证等多种自由软件许可协议开放源代码。ShadowSocks 分为服务器端和客户端，在使用之前，需要先将服务器端程序部署到服务器上面，然后通过客户端连接并创建本地代理。

ShadowSocksR（简称 SSR）是网名为 breakwa11 的用户发起的 ShadowSocks 分支，在 ShadowSocks 的基础上增加了一些数据混淆方式，称修复了部分安全问题并可以提高 QoS 优先级。后来贡献者 Librehat 也为 ShadowSocks 补上了一些此类特性，甚至增加了类似Tor的可插拔传输层功能。

### 前期准备

+ 所需工具：VPS 服务器、Xshell、ShadowSocks 客户端。
+ VPS 服务器推荐：[Vultr](https://www.vultr.com/)、[搬瓦工](https://bandwagonhost.com/)，推荐使用洛杉矶机房。
+ Xshell：[官方下载](https://www.netsarang.com/zh/xshell/)，另推荐使用同一家公司的产品 Xftp，这两款使用免费版即可。
+ ShadowSocks 客户端：[Windows系统](https://github.com/shadowsocks/shadowsocks-windows)、[安卓系统](https://github.com/shadowsocks/shadowsocks-android)、[iOS系统](https://github.com/shadowsocks/shadowsocks-iOS/wiki/Help)、[OSX系统](https://github.com/shadowsocks/shadowsocks-iOS/wiki/Shadowsocks-for-OSX-Help)。

### 具体操作

#### 安装脚本

脚本一：

这里用到的是 ShadowSocksR 服务。

```bash
yum -y install wget
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/ssr.sh && chmod +x ssr.sh && bash ssr.sh
```

脚本二（备用）：

如果上面的脚本暂时用不了，可以用下面的备用脚本，备用脚本与脚本一的设置方法基本类似，在此不再详细讲解。备用脚本卸载命令：`./shadowsocksR.sh uninstall`。

```bash
yum -y install wget
wget --no-check-certificate https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocksR.sh
chmod +x shadowsocksR.sh
./shadowsocksR.sh 2>&1 | tee shadowsocksR.log
```

使用 Xshell 登录你的 VPS 服务器，复制上面的脚本一代码到服务器里，按回车键，脚本会自动安装，以后只需要运行这个快捷命令就可以出现下图的界面进行设置，快捷管理命令为：`bash ssr.sh`。

![surf-the-internet-0.jpg](/images/surf-the-internet-0.jpg)

如上图出现管理界面后，输入数字 `1` 来安装 ShadowSocksR 服务端。如果输入 `1` 后不能进入下一步，那么请退出 Xshell，重新连接 VPS 服务器，然后输入快捷管理命令 `bash ssr.sh` 再尝试。

![surf-the-internet-1.jpg](/images/surf-the-internet-1.jpg)

根据上图提示，依次输入自己想设置的端口和密码（密码建议用复杂点的字母组合，端口号为 40~65535 之间的数字），回车键用于确认[^1]。

![surf-the-internet-2.jpg](/images/surf-the-internet-2.jpg)

如上图，选择想设置的加密方式，这里我选用的是 `10`，按回车键确认。

接下来是选择协议插件，如下图：

![surf-the-internet-3.jpg](/images/surf-the-internet-3.jpg)

![surf-the-internet-4.jpg](/images/surf-the-internet-4.jpg)

选择并确认后，会出现上图的界面，提示你是否选择兼容原版，这里的原版指的是 ShadowSocks 客户端（ShadowSocks 客户端没有协议和混淆的选项），可以根据需求进行选择，这里我选择 `y`，因为我所用的是原版 ShadowSocks 客户端[^2]。

之后进行混淆插件的设置。如果协议是 origin，那么混淆也必须是 plain；如果协议不是 origin，那么混淆可以是任意的。有的地区需要把混淆设置成 plain 才好用。因为混淆不总是有效果，要看各地区的策略，有时候不混淆（plain）或（origin 和 plain 一起使用），让其看起来像随机数据更好[^3]。

![surf-the-internet-5.jpg](/images/surf-the-internet-5.jpg)

进行混淆插件的设置后，会依次提示你对设备数、单线程限速和端口总限速进行设置，默认值是不进行限制，个人使用的话，选择默认即可，即直接敲回车键。关于限制设备数，这个协议必须是非原版且不兼容原版才有效，也就是必须使用 ShadowSocksR 协议的情况下，才有效。

![surf-the-internet-6.jpg](/images/surf-the-internet-6.jpg)

之后代码就正式自动部署了，到下图所示的位置，提示你下载文件，输入 `y` 。

![surf-the-internet-7.jpg](/images/surf-the-internet-7.jpg)

耐心等待一会，出现下面的界面即部署完成。

![surf-the-internet-8.jpg](/images/surf-the-internet-8.jpg)

![surf-the-internet-9.jpg](/images/surf-the-internet-9.jpg)

根据上图就可以看到自己设置的 ShadowSocksR 账号信息，包括 IP、端口、密码、加密方式、协议插件、混淆插件，这些信息需要填入你的 ShadowSocks 客户端。如果之后想修改账号信息，直接输入快捷管理命令 `bash ssr.sh` 进入管理界面，选择相应的数字来进行一键修改。

![surf-the-internet-10.jpg](/images/surf-the-internet-10.jpg)

![surf-the-internet-11.jpg](/images/surf-the-internet-11.jpg)

此脚本是开机自动启动，部署一次即可。最后可以重启服务器确保部署生效（一般情况不重启也可以）。重启需要在命令栏里输入 `reboot`，输入命令后稍微等待一会服务器就会自动重启，一般重启过程需要 2~5 分钟，重启过程中 Xshell 会自动断开连接，等 VPS 重启好后才可以用 Xshell 软件进行连接。如果部署过程中卡在某个位置超过 10 分钟，可以用 Xshell 软件断开，然后重新连接你的 IP，再复制代码进行部署。

#### 加速 VPS 服务器

此加速教程为破解版锐速加速，推荐部署加速脚本。该加速方法是开机自动启动，部署一次就可以了。

##### 更换服务器内核

```bash
yum -y install wget
wget --no-check-certificate https://blog.asuhu.com/sh/ruisu.sh && bash ruisu.sh
```

![surf-the-internet-12.jpg](/images/surf-the-internet-12.jpg)

不动的时候敲回车键，在上图时需要多等一会儿。

![surf-the-internet-13.jpg](/images/surf-the-internet-13.jpg)

出现上图时表示已成功替换内核并服务器自动重启。

完成后会重启，2 分钟后重新连接服务器，连上后开始下一步的操作。

##### 一键安装锐速

```bash
wget -N --no-check-certificate https://raw.githubusercontent.com/91yun/serverspeeder/master/serverspeeder-all.sh && bash serverspeeder-all.sh
```

卸载加速代码命令为：

```bash
chattr -i /serverspeeder/etc/apx* && /serverspeeder/bin/serverSpeeder.sh uninstall -f
```

但有些内核是不适合的，部署过程中需要手动选择推荐的，当部署时出现以下字样：

![surf-the-internet-14.jpg](/images/surf-the-internet-14.jpg)

提示没有完全匹配的内核,随便选一个内核就行,按照提示来输入数字,按回车键即可。

锐速安装成功标志如下，出现 `running` 字样即可：

![surf-the-internet-15.jpg](/images/surf-the-internet-15.jpg)

#### ShadowSocks 客户端使用方法

以 Windows 客户端为例。启动 ShadowSocks 的 Windows 客户端，在任务栏中可以看到一个小飞机的图标，设置界面如下图所示。

![surf-the-internet-16.jpg](/images/surf-the-internet-16.jpg)

将你的 IP 地址，设置好的端口号和密码以及加密方式输入到对应的地方，点击确认。

右键点击任务栏中的小飞机图标，按照下图所示的内容进行设置即可。

![surf-the-internet-17.jpg](/images/surf-the-internet-17.jpg)

![surf-the-internet-18.jpg](/images/surf-the-internet-18.jpg)

其中，PAC 模式和全局模式的区别是，PAC 模式下，只有被墙的网站走代理，全局模式下，所有的网站都默认走代理。

## 搭建 V2Ray

我最初使用的是 ShadowSocks，并没有使用 V2Ray，因为相关教程太少，且之前搭建了很多次都没有成功。在 2019 年 6 月，相关部门在全国范围内加强了网络防护，因此使用 ShadowSocks 的大部分用户的 IP 都进入了黑名单，而且更换新的 IP 后也会立刻被封。相比之下，V2Ray 安全很多。

### 简介

[V2Ray 官方网站](https://www.v2ray.com/)。相对于 Shadowsocks，V2Ray 更像全能选手，拥有更多可选择的协议/传输载体（Socks、HTTP、TLS、TCP、mKCP、WebSocket），还有强大的路由功能，不仅仅于此，它亦包含 ShadowSocks 组件，你只需要安装 V2Ray，你就可以使用所有的 V2Ray 相关的特性包括使用 ShadowSocks，由于 V2Ray 是使用 GO 语言所撰写的，天生的平台部署优势，下载即可使用，但 V2Ray 的配置相对来说很繁琐。

### 前期准备

参见本文[第 2.2 节](#前期准备)内容。

V2Ray客户端：[Windows系统](https://github.com/2dust/v2rayN/releases/)、[安卓系统](https://github.com/2dust/v2rayNG/releases)。

### 具体操作

#### 安装脚本

这里我使用的是 233boy 的 V2Ray 一键安装脚本，可以省去很多复杂的操作，该脚本支持 V2Ray 绝大多数传输协议，内含 ShadowSocks 组件，动态端口，并且集成 BBR 和锐速优化。

在 Xshell 中登录你的 VPS 服务器，输入以下命令：

```bash
bash <(curl -s -L https://git.io/v2ray.sh)
```

如果提示 `curl: command not found`，那是因为你的 VPS 没装Curl。Ubuntu/Debian 系统安装 Curl 方法：`apt-get update -y && apt-get install curl -y`；CentOS 系统安装 Curl 方法：`yum update -y && yum install curl -y`。安装好 Curl 之后就能安装脚本了。

如下图所示，选择安装，即输入 `1` 回车；选择传输协议，如果没有特别的需求，使用默认的 TCP 传输协议即可，直接回车；选择端口，如果没有特别的需求，使用默认的端口即可，直接回车；是否屏蔽广告，除非你真的需要，一般来说，直接回车即可。

![surf-the-internet-19.jpg](/images/surf-the-internet-19.jpg)

如下图所示，选择是否配置 ShadowSocks ，如果不需要就直接回车，否则就输入 `Y` 回车。既然选择了使用 V2Ray ，就抛弃  ShadowSocks 吧。

![surf-the-internet-20.jpg](/images/surf-the-internet-20.jpg)

安装完成后，会显示你的配置信息，如下图所示。

![surf-the-internet-21.jpg](/images/surf-the-internet-21.jpg)

#### 加速 VPS 服务器

参照本文[第 2.3.2 节](#加速-vps-服务器)执行即可。

#### V2Ray 客户端使用方法

以 Windows 客户端为例。

客户端设置界面如下图所示。

![surf-the-internet-22.jpg](/images/surf-the-internet-22.jpg)

在 Xshell 中输入：

```
v2ray url
```

则会显示 vmess 链接，复制这个链接。启动 V2RayN 客户端，如下图所示，在该程序窗口左上角的「服务器」菜单下点击「添加 [VMess] 服务器」 , 在「导入配置文件」界面选择从「剪贴板导入URL」，你在服务器中配置的信息就会导入进来。

![surf-the-internet-23.jpg](/images/surf-the-internet-23.jpg)

接着，在程序窗口上的「参数设置」中，设置本地监听端口，设置任意数值即可。

![surf-the-internet-24.jpg](/images/surf-the-internet-24.jpg)

以上内容全部设置完成后，在任务栏托盘找到 V2RayN 图标并鼠标右键，然后选择「启动系统代理」并且设置「系统代理模式」为 PAC 模式。之后在该程序主界面，找到「检查更新」中的「检查更新PAC」，等待更新完成即可。

![surf-the-internet-25.jpg](/images/surf-the-internet-25.jpg)

## 其它方式

如果你是完完全全的计算机小白，对上述的两种方法依然感到很迷茫，那么可以参考以下方式。

### FreeVPN

- 优点：免费、使用非常简单
- 缺点：速度一般
- 系统：Windows、MacOS、Android、iOS、Chrome
- 中文：支持中文
- 下载：[FreeVPN 官网](https://www.freevpn.pw/)

### 蓝灯

- 优点：有免费版，并且抗封能力较强
- 缺点：有流量限制：每月 500MB，不支持 iOS
- 系统：Linux、Windows、MacOS、Android
- 中文：支持中文
- 下载：[蓝灯官网](https://getlantern.org/)（需翻墙），[GitHub 地址](https://github.com/getlantern/download/wiki)（不需要翻墙）

### Windscribe

- 优点：有免费版，并且抗封能力较强
- 缺点：有流量限制：每月 2GB，验证邮箱后每月 10GB
- 系统：Linux、Windows、MacOS、Android、iOS
- 中文：支持中文
- 下载：[Windscribe 官网](https://windscribe.com/?affid=6axgjrcs)（需翻墙），[GitHub 地址](https://github.com/sphard/software/issues/1)（不需要翻墙）

### 萤火虫

- 优点：免费、无流量限制
- 缺点：速度一般
- 系统：Linux、Windows、MacOS、Android、iOS
- 中文：支持中文
- 下载：[GitHub 地址](https://github.com/yinghuocho/firefly-proxy)（不需要翻墙）

### 赛风

- 优点：免费、无流量限制
- 缺点：速度一般
- 系统：Windows、Android、iOS
- 中文：支持中文
- 下载：[赛风官网](https://psiphon.ca/zh/download.html)（需翻墙）， [镜像](https://s3.amazonaws.com/0ozb-6kaj-r0p8/zh/download.html)（不需要翻墙）

### Tor

- 优点：免费、无流量限制
- 缺点：速度较慢，翻墙时需使用专门的浏览器 Tor Browser
- 系统：Linux、Windows、MacOS、Android
- 中文：网站无中文版，但软件有中文版
- 下载：[Tor 官网](https://www.torproject.org/)（需翻墙），[GitHub 地址](https://github.com/sphard/software/issues/4)（不需要翻墙）

## 参考

1. [Shadowsocks | 维基百科](https://zh.wikipedia.org/wiki/Shadowsocks)
2. [233boy/v2ray | GitHub](https://github.com/233boy/v2ray/wiki)
3. [梯子分享 | HeannyBlog](http://www.heanny.cn/post-377.html)

[^1]: 关于端口的设置，总的网络总端口有 6 万多个，理论上可以任意设置。但是有的地区需要设置特殊的端口才有效，一些特殊的端口比如 80、143、443、1433、3306、3389、8080。
[^2]: 我个人觉得原版客户端比较好，现在依然在维持更新，而 ShadowSocksR 客户端似乎很长时间没有更新过了。
[^3]: `tls 1.2_ticket_auth` 容易受到干扰，请选择除 `tls` 开头以外的其它混淆！