+++
title = "解决 EasyConnect 造成的浏览器数据丢失问题"
date = "2020-02-29T14:29:48+08:00"
tags = ["chrome","network","zju"]
+++

由于特殊时期需要在家学习，如果需要访问校内网络资源（如图书馆资源、校内论坛、学院网站等等）则需要使用反向代理 RVPN 服务，学校官方提供的反向代理软件是深信服的 EasyConnect。如果你在搜索引擎中搜索关键词 RVPN，搜索到的结果大部分都和浙大的网络服务有关。虽然 EasyConnect 软件提供的服务有些不稳定，经常会断开网络连接。不过有总比没有好，~~至少又可以愉快地水 CC98 了~~。

最近一段时间，我发现 Chrome 浏览器账号总是暂停服务，需要重新登录。我们都知道想要登陆 Google 账户需要科学上网，但是只要账户登录成功后，就基本不会掉线，除非你改动了 Chrome 的默认设置，清除了 Cookie。如果你的账户掉线了，那么存储到浏览器中的一些账户和密码，自动登录设置都会丢失——每一次访问 GitHub，我都要重新输入密码，时不时还要给我的邮箱发验证码验证账户，很麻烦。

![chrome-data-loss-caused-by-using-easyconnect-0.png](/images/chrome-data-loss-caused-by-using-easyconnect-0.png "Chorme 账户暂停服务")

对于账户暂停服务的问题，我花了很长时间找原因，现在才发现，原来造成该问题的罪魁祸首，就是 EasyConnect。也就是说，如果你使用了 EasyConnect，在退出该程序后，该程序会自动清除浏览器的 cookie，你的账户会掉线，你的浏览历史记录也不复存在。目前该问题只发生在 Chrome 浏览器中，Edge 和 Firefox 并未出现。

有些同学在退出 EasyConnect 的时候，该软件会提示正在清除浏览历史记录，这应该是最近软件自动更新后出现的提示框。

[^1]![chrome-data-loss-caused-by-using-easyconnect-1.jpg](/images/chrome-data-loss-caused-by-using-easyconnect-1.jpg "软件提示删除历史数据")

解决方法其实很简单，在 EasyConnect 的软件系统设置中勾选「登录后不弹出资源列表」即可。想必是因为不通过浏览器弹出资源列表，自然不会清理浏览器。

![chrome-data-loss-caused-by-using-easyconnect-2.png](/images/chrome-data-loss-caused-by-using-easyconnect-2.png "EasyConnect 系统设置")

还有一种解决方法，就是把计算机默认浏览器改成你不经常用的浏览器。让 EasyConnect 去清理你不用的那个浏览器的 Cookie。如果你在某个浏览器输入 <https://rvpn.zju.edu.cn> 直接通过网站进行网络连接，则 EasyConnect 一定会清理该浏览器的 Cookie——因此使用某个不经常用的浏览器进行在线连接即可。

有个同学在网上看到一个帖子，说管理员可以设置开启了自动清理的功能，学校信息中心的管理员给的回复是：

> 这个东西一直开着的，已经好几年了。之前和 EasyConnect 的深信服沟通过，如果勾选退出清理，会导致统一身份验证的那个接口跳转出错等一系列 Bug……所以没法关掉。

![chrome-data-loss-caused-by-using-easyconnect-3.jpg](/images/chrome-data-loss-caused-by-using-easyconnect-3.jpg "深信服社区讨论帖")

学校信息中心的工作人员说正在筹备一个 Web 端的 RVPN，然后就可以抛弃 EasyConnect 了，不过以信息中心的效率，这种东西什么时候能做出来呢？[^2]

[^1]: 图源：CC98 用户：一番巨大悠
[^2]: 参考①：[EasyConnect 退出时清了我浏览器 Cookie……| 一番巨大悠](https://www.cc98.org/topic/4905710)<br>参考②：[已解决 Chrome 在使用 EasyConnect 后历史数据丢失问题——Chrome 被 EasyConnect 针对了？| 游青松](https://www.cc98.org/topic/4905792)