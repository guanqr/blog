+++
title = "学在浙大（TronClass）平台课件下载方法"
date = "2020-03-16T17:08:58+08:00"
tags = ["tronclass","zju"]
displayExpiredTip = true
+++

学在浙大 2.0 平台其实是一个套壳 TronClass 平台的网站，所以说在手机端，不一定非要使用钉钉进入学在浙大，下载 TronClass APP 也可。一般来说，授课教师会在学在浙大平台上上传课件或者布置习题。有的教师会将上传的课件开启「允许下载」的权限，但有些老师很可能就会忘记开启该项权限，或者根本就不想让学生下载（担心自己的课件流传到外网）。如果说每次复习课程的时候都要进入学在浙大平台点开课件观看，一是过程比较繁琐费时，二是在线课件无法做笔记，很不方便。

这学期刚开始的时候，学在浙大的平台刚刚建成没多久，还不够完善。因此虽然有些课件设置成无法下载，但在课件加载完成后，直接使用 `Ctrl + S` 即可保存至本地，这一方法迅速流传开来。然而就在上一周，程序员修复了这个 BUG。真的没办法下载课件了吗？事实并非如此。

首先我们进入学在浙大，打开你想要下载的课件页面。进入开发者调试页面（按 `F12` 键，或者右键点击「检查」）。进入「NetWork」页面，然后刷新网页，我们就可以在如下图所示的红框区域内看到当前网页加载的内容有哪些。理论上来说，加载的这些资源中必然有一个是当前的课件，否则课件是从哪里来的呢？

![tronclass-file-download-0.png](/images/tronclass-file-download-0.png)

接下来我们就需要找到加载课件资源的是哪一个。虽然说当前的页面加载了很多东西，但其实课件资源的位置很好找到，因为课件的文件体积肯定要比其他的一些代码体积大得多，其他文件可能就几个 B 的大小，课件大小基本上是以 KB 为单位的，而且由于文件体积较大，加载的时长也比其他资源要长。我们直接寻找加载的最大文件。

看起来这一个比较像，文件大小为 11 KB，文件类型为 document，文件名前缀为 pdf-viewer。

![tronclass-file-download-1.png](/images/tronclass-file-download-1.png)

点击这一条资源，左侧显示了它的基本信息。在「Headers」中的最底部，我们可以看到文件的链接，链接以 `pdf` 结尾，准没错。复制该链接，在新的页面打开它，即可下载该文件。

![tronclass-file-download-2.png](/images/tronclass-file-download-2.png)

如果对于一些不熟悉浏览器操作的小白，寻找加载的资源有些困难的话，还有一个相对简单的方法。在开发者调试页面的控制台「Console」中输入如下命令[^1]，即可下载。

```javascript
window.open(decodeURIComponent(document.getElementById('pdf-viewer').src.split("?file=")[1]));
```

除此之外，如果你使用 IDM（Internet Download Manager）下载器的话，只要在线浏览课件，就直接能够下载了。

[^1]: 参考：[fish-can/TronClass-PDF-Downloader | Github](https://github.com/fish-can/TronClass-PDF-Downloader)