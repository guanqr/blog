+++
title = "Hexo-NexT 主题个性优化"
date = "2019-05-04T00:00:39+08:00"
tags = ["Hexo","NexT"]
categories = ["study","blog"]
dropCap = false
displayCopyright = true
gitinfo = true
toc = true
+++

[^1]![hexo-theme-next.png](/images/hexo-theme-next.png)

## 写在前面

从最初建立该博客到现在，我参考了许多使用 NexT 主题的博主们的文章，对 NexT.Muse 主题进行了一次又一次的优化与深层次的魔改。在此感谢这些分享自己建站教程的博主们。秉承着开源共享精神，我也将我在优化博客主题时使用到的方法分享出来。这些内容大都是我从互联网搜集汇总的优化方法，也有一小部分是我个人的修改。文中所讲的一些东西，可能随着 NexT 主题的更新，成为主题自带的一部分，或被主题抛弃；也可能自身就存在一定的错误。望各位读者能及时指出问题，让这篇文章能够更加完善，紧跟主题更新的步伐。

在本文中，我将会全面讲解 Hexo 博客的搭建，NexT 主题的安装和配置，以及个性优化的内容。本文文章篇幅较长，为了方便阅读，在开头添加了文章目录，目录与各段落标题之间相互链接，可双向跳转。

<p id="div-success">
[2019/11/09] 更新：目前我的博客已经从 Hexo 迁移到了 Hugo，但是出于对 NexT 主题的喜爱，我决定继续维持更新这篇文章。在此前我共分为两篇文章讲解主题的个性优化：《Hexo-NexT 主题：文章内容美化》与《Hexo-NexT 主题：网站页面优化》，但内容分散不利于阅读，所以在本次更新中我决定将这两篇文章合二为一，并精简规范了文章内容和操作步骤。
</p>

## 搭建 Hexo 博客

### 在本地安装 Hexo

### 博客的部署方式

### 博客的更新

## 基本功能配置

### 安装 NexT 主题

### 站点配置文件

### 主题配置文件

## 网页样式布局

在对 NexT 主题的个性优化中，如果想要添加一些个性化的内容，就需要对内部代码进行修改。主题提供了许多注入点，可以通过注入点插入自己想要的东西，而不会对原有的主题内部文件进行大量的修改。这样便于以后主题的升级，避免一系列的错误发生。NexT 主题更新到 v7.2.0 后，简化了自定义内容的添加方法，删除了以前版本中所用的 `css/_custom.styl` 自定义 CSS 样式文件。如果想要修改样式或者在 HTML 中的 `<head>`、`<body>` 等部位插入代码。即直接在博客 `sourse` 资源文件夹下新建自定义文件 `_data/xxx` 实现该功能。

在主题配置文件 `_config.yml` 中，写道：

```yaml
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

如果需要自定义 CSS 样式，需要将上述代码中 `custom_file_path:` 下的 `#style: source/_data/styles.styl` 注释取消，然后根据该自定义文件存放路径创建相应文件 `styles.styl`，在该文件中添加自定义内容。同样，如果需要在 `<head>` 中添加内容，比如修改字体时引入 Google Fonts 以及分析博客数据时引入 Google Analytics，则需要新建 `head.swig` 文件，在其中添加自定义内容即可。在 `post.swig` 中添加的文章结尾样式，可以直接添加在 `post-body-end.swig` 文件中。如果你在这里还没有明白到底该如何设定，没关系，下面的具体教程中我会详细地说明。

目前网络中的大部分优化教程都是依据旧版主题进行设定的，因此，一些使用最新版本主题的读者根据旧版设定进行操作的话，可能会报错。为了体现本文的与时俱进，本文中采用的即为..最新版本的设定方式..，旧版的设定方式在这里不再提及，请采用旧版主题的读者参考过去版本的官方说明文档。

### 基本修改方法

NexT 主题最大的特点就是主题基础颜色简单，白加黑的简单组合为我们提供了能够随心所欲进行自定义的空间。修改颜色、修改图形、修改动画……这些都能够实现。控制这些自定义样式布局的文件即为 `styles.styl`。该文件在主题安装后并不存在，需要你自己建立。首先，你需要在主题配置文件 `_config.yml` 中，将下面一栏的注释删除：

```diff
custom_file_path:
- #style: source/_data/styles.styl
+ style: source/_data/styles.styl
```

然后在你的在博客根目录下的 `source` 文件夹下新建 `_data` 文件夹，在该文件夹下创建名为 `styles.styl` 的文件。这里需要注意，不要将 `source` 文件夹创建在主题文件夹中。

该文件有什么作用呢？你可以将自定义的 CSS 样式写入该文件中，这些自定义样式会覆盖主题原有的样式设定。那么该如何自定义样式呢？你只需要一个工具，那就是浏览器。这里我推荐使用 Google 的 Chrome 浏览器，通过浏览器打开你的网站，右键，点击「检查」或者按键盘上的「F12」键，进入调试模式。

## 文章内容美化

## 结尾

[^1]: 图源：<https://github.com/theme-next/hexo-theme-next>。