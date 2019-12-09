+++
title = "谈谈博客主题的那些事"
date = "2019-06-08T00:24:26+08:00"
tags = ["hexo","next","typography"]
dropCap = true
displayCopyright = true
gitinfo = true
+++

我最喜欢的 Hexo 博客主题就是 NexT 主题，从建立这个博客之初，我选择的就是该主题。因为其具有简洁友好的界面、强大的功能扩展、自由的自定义样式、四种主题风格的选择。在建站一个月之后，抱着「尝试一下别的主题看看有没有更吸引我的」的心态，我考虑过更换其他主题，但换来换去，总没有 NexT 这么灵活自由。NexT 主题的背后有着一些默默为之付出的团队，这也是该主题能够不断维持更新的原因。我想，有这样一支团队的存在，也是大家喜爱该主题的原因。在这篇文章中，我主要分析一些我曾经尝试过的主题的特色与缺陷，记录本站主题外观的变化，记录一下我眼中的 NexT 主题。

## 博客主题的选择

最初搭建 Hexo 博客的时候，我采用的主题是 NexT.Gemini。在这段时间中，我在主题美化方面花费了很多精力，为我的网站添加了很多功能。然而，尽管 NexT 主题集合了很多扩展插件，但总让我觉得缺少了一些东西。

[NexT](https://github.com/theme-next/hexo-theme-next) 主题是 GitHub 上 Stars 最多的主题，我浏览过的很多博客网站也采用的这个主题。当初我选用这个主题的原因就是它具有简洁美，用的人多，功能齐全，配置简单。NexT.Gemini 正好满足我的需求。但这个主题最大的缺陷就是移动端的显示问题。

NexT.Gemini 在移动端无法显示有个人资料卡片的那部分区域，而 NexT 的前两个主题能够在移动端显示。在我看来，有些重要的信息，如果只有 PC 端能看见而移动端看不见，那么这样的设计就很失败。因为现如今大部分人浏览网页都是通过移动端，如果你的网站在移动端不能给人良好的体验，再怎么做也没用。除了这个问题，该主题风格由于侧边栏的信息过多，导致有的页面（比如  tags 页面）正文部分的长度还没有侧栏长，不太美观。

在这一周的时间里，我前后体验了 [Yilia](https://github.com/litten/hexo-theme-yilia)，[Yelee](https://github.com/MOxFIVE/hexo-theme-yelee)，[Indigo](https://github.com/yscoder/hexo-theme-indigo) 等等在 GitHub 上比较受欢迎的主题，我认为 Yilia 以及在 Yilia 基础上魔改的 Yelee 都很不错，但这两个主题已经有很长时间没有更新过了，对于谷歌浏览器的适配不太好，会出现一定的 BUG，而 Indigo 主题有一种商务风，方块化设计，配色舒适，但是对于我这种学工科的，平时写文章喜欢添加一些数学公式的人来说，并不太满意。这个主题在 MathJax 渲染效果上不太理想，太长的公式会越过文章边界，并且含有数学公式的段落在手机端会缩小字号。

换来换去，最后还是换回了 NexT，这次用的是 NexT.Muse，计划在暑假阶段对博客界面美化一番。NexT 主题扩展性还是很强大的，毕竟有很多人的维护。临近期末考试，我也没有大多精力对我的博客网站进行更改，只能放在暑假了。

## 主题变更记录

到 2019 年 8 月 11 日为止本站已经稳定地运行了三个多月，我对 NexT.Muse 主题的美化、一些细节的优化以及功能的添加基本完善。通过对该主题的美化，我学到了不少东西。

首先来看看我的主题样式的变更历程：

![hexo-theme-in-5-month.jpg](/images/hexo-theme-in-5-month.jpg "5 月")

![hexo-theme-in-6-month.jpg](/images/hexo-theme-in-6-month.jpg "6 月")

![hexo-theme-in-7-month.jpg](/images/hexo-theme-in-7-month.jpg "7 月")

![hexo-theme-in-8-month.jpg](/images/hexo-theme-in-8-month.jpg "8 月")

在经历了 6 月初主题大变更后，我专注于将 NexT.Muse 主题进行美化，特别是在页边距、超链接等细节方面进行了多次调整，达到了目前较为满意的结果。值得一提的是，对主题样式的优化主要用到了 CSS 的一些皮毛，而我并没有专门学习过前端的设计，不过 CSS 的语法比较容易理解，我通过互联网学到了不少这方面的知识。而通过对网页样式的美化，前端设计引发了我的兴趣，我希望下学期能在繁忙之余自学一些，不过，有物理光学和光电子学两座大山压在身上，这个想法实现的概率很小很小。

8 月份 NexT 主题升级到了 v7.3.0 版本，我了解到在该版本中有很多功能的调整与结构上的变化，便迫不及待地进行了更新。在下一阶段，NexT 主题会加入 PJAX 功能，我也会尝试在博客中添加该功能，但很可能由于插件的冲突无法实现。

当然，页面更好的优化是为了增强文章的阅读体验，博客最重要的就是文章的质量，我今后也会认真对待我的每一篇文章，让内容更充实。由于我并非来自计算机专业，文章的内容可能更偏向于光学。今后可能会写一些课程的知识总结，当然也有生活中的点点滴滴。

## 谈谈 NexT 主题

为什么 NexT 主题这么受人喜爱？

我认为，因为它的功能很多、可扩展性很强大，因为有很多人一起维护这个主题项目，你遇到的 BUG 基本都能很快的修复，你想要加入的功能该团队也会尽力加入，所以它更新的速度很快，每一个月都会发布一个新版本，每一年进行一个完全的升级。从目前的趋势来看，NexT 团队正在努力让主题内部代码更为结构化，方便使用者自己开发新的扩展功能。

这几天我很详细地查看了该主题项目的历史记录，惊叹于该项目成员解决问题效率很高，Issues 的分类十分详细，很有条理。

## NexT 主题的更新

在每一个版本更新的时候，NexT 团队会在其[官方文档](https://theme-next.org/)上汇总该版本的一些变化，在这里，我记录的是每一版本的变化中比较吸引我的部分。

关于主题版本号的定义，只要有重大的变化，版本号就会从 `vN.x.y` 变化到 `vN.(x+1).0`，如果没有太大的变化，只是修复一些主题内部的 BUG，版本号就会总 `vN.x.y` 变化到 `vN.x.(y+1)`。而每一年的变化则是从 `vN.x.y` 到 `v(N+1).0.0`。

因此我建议，如果你在哪一天心血来潮想要更新主题的时候，看一看下一个版本的版本号是否是从 `vN.x.y` 变化到 `vN.(x+1).0`，即有重大更新，如果是的话，那就耐心等待下一个版本推出的时候再更新，如果不是的话，那就选择当前版本更新就行了。我个人比较喜欢使用发行版（即在 releases 中）的主题，而不是直接 clone 当前的文件，因为发行版毕竟是标准的版本，虽然当前的实时更新文件可能会修复一定的 BUG，但版本内容并不太稳定。

2019 年 8 月，官方推出了 v7.3.0 版本的更新，我感觉到最近主题更新速度很快，这里的速度不是指版本更新的速度，因为该主题的更新时间固定在每个月的月初，而是主题内功能完善的速度。我上一个版本使用的是 v7.1.2，距离这次更新已经有两个月的时间了，主题变化还是非常大的。有些变化可能是在我使用的这两个版本之间的某一版本发生的，但由于我并没有使用这些版本，便统一将这些变化写入到这一版本中。

之前自定义样式的时候，需要在主题文件下的某一 `custom.styl` 文件中添加即可，但目前主题删除了该文件，可直接在博客 `sourse` 资源文件夹下新建自定义文件 `_data/xxx` 实现该功能。以下为详细说明：

在主题配置文件 `_config.yml` 中，写道：

```yml
# Define custom file paths.
# Create your custom files in site directory `source/_data` and uncomment needed files below.
custom_file_path:
  #head: source/_data/head.swig
  #header: source/_data/header.swig
  #sidebar: source/_data/sidebar.swig
  #postMeta: source/_data/post-meta.swig
  #postBodyEnd: source/_data/post-body-end.swig
  #footer: source/_data/footer.swig
  #bodyEnd: source/_data/body-end.swig
  #variable: source/_data/variables.styl
  #mixin: source/_data/mixins.styl
  #style: source/_data/styles.styl
```

即在 v7.2.0 及以上的版本中，如果需要自定义 CSS 样式，需要将上述代码中 `custom_file_path:` 下的 `#style: source/_data/styles.styl` 注释取消，在博客根目录下的 `/source/` 文件夹下新建 `/_data/` 文件夹，在该文件夹下创建文件 `styles.styl`，在该文件中添加自定义内容。同样，如果需要在 `<head>` 中添加内容，比如修改字体时引入 Google Fonts 以及分析博客数据时引入 Google Analytics，则需要新建 `head.swig` 文件，在其中添加自定义内容即可。在 `post.swig` 中添加的文章结尾样式，可以直接添加在 `post-body-end.swig` 文件中。

在 v7.4.0 版本中，官方加入了 PJAX 技术。通过 PJAX，在切换网页的时候，相同的元素不再刷新，只刷新发生改变的元素，节省了部分时间，加速了访问博客的速度。不过如果你的博客使用了 PJAX，一些 `js` 脚本的运行可能会出现问题，在你第一次访问插入 `js` 脚本页面的时候无法正常显示，需要手动刷新一次页面才能正常显示。如果你在页面中插入了 Aplayer 音乐播放器或者 Echarts 图表就会遇到该问题。

在官方的中文讨论群中，负责引入 PJAX 技术的人对该问题的代码修改思路如下图所示。

![hexo-theme-next-telegram-communication.jpg](/images/hexo-theme-next-telegram-communication.jpg)

由于我目前还未认真研究过 PJAX 的代码，尝试修改无果，等以后有时间再来看看吧。