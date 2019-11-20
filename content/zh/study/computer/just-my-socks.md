+++
title = "推荐 Just My Socks 机场服务"
date = "2019-10-03T09:15:00+08:00"
tags = ["GFW","Google","ShadowSocks"]
categories = ["study","computer"]
dropCap = true
displayCopyright = true
gitinfo = true
+++

最近一段时间，我在 Vultr 租用的服务器很不稳定，之前用来建 WordPress 博客的服务器也挂掉了，连续更换几个 IP 都是被封状态。搬瓦工的服务器更不用说，现在新的服务器价格极高，美元汇率也高，而且如果 IP 被封换 IP 也很困难。之前被封第一批的时候我还高兴地说，我用 V2ray 搭建的梯子没被封，我还有个域名解析到这个 IP 上，谁知道第二天就凉了。

本来想等这段时间过去再说。但是最近我还在进行一项小的科研训练项目，还是需要查文献资料什么的，另外我在 Telegram 上有几个群聊，一直耗着也不是个办法。之前就听说搬瓦工推出了自家的机场服务 Just My Socks，看了几个性能测试，个人感觉还不错，于是就趁此机会尝试了一下。

我之前写的购买 VPS 服务器搭建 ShadowSocks 和 V2ray 的教程：「[脚著谢公屐，身登青云梯](/study/computer/surf-the-internet/)」。

## Just My Socks 优势

官方网站：<https://justmysocks.net/members/>（可能需要梯子才能访问）。

选择 Just My Socks 有下列几点优势：

+ 免去个人搭建代理流程，降低科学上网门槛，更适用于小白用户。
+ 全部采用 CN2 GIA/CN2 国际精品线路，线路优先级更高，连接速度更快。
+ 价格相对直接租用 VPS 服务器而言，更为便宜，按照美元汇率是每个月 20 元 100G 流量。
+ 购买后提供 5 个 IP 地址，可随意切换避免被墙，可随意切换 ShadowSocks 端口，ShadowSocks 密码及加密协议。
+ 搬瓦工特有 IP 被墙检测功能，官方可快速更新正常 IP，永不被墙。
+ 支持 Paypal 和支付宝付款，方便快捷。

## 使用方法

首先进入[官网](https://justmysocks.net/members/)，官网的域名应该是被墙了，但正常情况下会跳转到一个你能够访问的备用域名上。我第一次访问的时候跳转到的是 <https://justmysocks1.net/members/>。

![just-my-socks-0.jpg](/images/just-my-socks-0.jpg "官网主页")

然后就是一系列的注册，注册完成后进入「Services」→「Order New Services」，就可以看到你能购买的机场服务列表。

![just-my-socks-1.jpg](/images/just-my-socks-1.jpg "购买新的服务")

我认为选第一个就好了，比较便宜，100G 流量足够了，买太贵的其实并没有什么用。

![just-my-socks-2.jpg](/images/just-my-socks-2.jpg "选取服务")

选好服务后，就会进入购物车的页面，你可以在这个页面中选取月结、季结还是年结。我觉得月结就可以了，毕竟有汇率和墙这两不稳定因素在。选好结算方法后，直接「Continue」，付款就可以了。

![just-my-socks-3.jpg](/images/just-my-socks-3.jpg "服务结算")

然后你就可以在「My Services」中看到你购买的服务了。

![just-my-socks-4.jpg](/images/just-my-socks-4.jpg "已购买的服务")

点击该项服务，可查询到该服务的详细信息。服务的 IP 地址，端口号，密码，加密方式等等都在这里显示。你也可以在这里更换端口号和密码。通过这些信息，结合 [ShadowSocks 客户端](https://www.guanqr.com/2019/07/02/surf-the-internet/#前期准备)，就能愉快地上网了。这里附上客户端的[使用方法](https://www.guanqr.com/2019/07/02/surf-the-internet/#ShadowSocks-客户端使用方法)。

![just-my-socks-5.jpg](/images/just-my-socks-5.jpg "服务的详细信息")

## 性能测试

网络环境为浙江大学校园网 10M 基础网络 + 电信提速套餐。测试时间为北京时间上午 10:30 。

Youtube 观看 1440p 的视频基本没有卡顿。

![just-my-socks-6.jpg](/images/just-my-socks-6.jpg "Youtube 测试")

用 [ping.pe](http://ping.pe) 进行测试，全国所有地区连接情况良好。

![just-my-socks-7.jpg](/images/just-my-socks-7.jpg "ping.pe 测试")

## 参考

1. [搬瓦工附属飞机场Just My Socks测评 | Fenghe's Blog](https://fenghe.us/benchmark-just-my-host/)。
2. [紧急测评 Just My Socks | Fenghe's Blog](https://fenghe.us/190917-review-just-my-socks/)。