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

该文件有什么作用呢？你可以将自定义的 CSS 样式写入该文件中，这些自定义样式会覆盖主题原有的样式设定。那么该如何自定义样式呢？你只需要一个工具——浏览器。这里我推荐使用 Google 的 Chrome 浏览器，通过浏览器打开你的网站，右键，点击「检查」或者按键盘上的「F12」键，进入[调试模式](https://developers.google.com/web/tools/chrome-devtools/)。然后点击窗口右上角的小箭头定位元素，定位到你需要修改的元素区域，调试台就会显示这一元素的 CSS 代码，在这里修改你想要的样式，再将其 Copy 到 `styles.styl` 中就可以了。

![hexo-theme-next-f12.png](/images/hexo-theme-next-f12.png "进行调试")

如果你此前并未接触过 CSS，为了避免一些错误的发生，建议你先去[这里](https://www.w3school.com.cn/index.html)学习一下 HTML 和 CSS 的基本语法。这里举一个例子，比如主题的目录元素：

```css
.menu {
  margin-top: 0;
  margin-bottom: 0;
  padding: 5px;
  box-shadow: 0 10px 10px 0 rgba(0,0,0,.15);
}
```

`{}` 前面的是 HTML 的元素名，`{}` 里面的是这个元素的 CSS 样式。`margin` 以及 `padding` 控制着该元素的区域大小，`box-shadow` 控制着放置该元素的区域阴影大小。

所以如果你在一个网站中看到了自己喜欢的元素样式，直接「F12」，选中该元素，Copy 代码到自己博客，再进行一些样式的微调以适应自己的博客即可。如果你不熟悉 HTML 和 CSS 的语法定义，就可能会找不准元素，而找不准元素不仅可能达不到预期效果，还可能会产生一些新的 Bugs，所以这里还是建议你先阅读一下上文推荐的教程。

### 我的 styles.styl

在这里附上我的 `styles.styl` 文件：[styles.zip](/uploads/styles.zip)。虽然目前我的博客是用 Hugo 搭建的，但我依然会根据 NexT 的主题维持 `styles.styl` 的内容更新。建议你不要完全复制我的样式，因为有可能我的博客主题版本与你的不同，不同版本的主题之间有些元素的名称不同，直接使用我的代码可能会出现错误。一步一步耐心地边调试边修改才能达到最佳效果。

### 修改字体

就 Web 常用的一些字体而言，经常听说的字体类型大致可以分为这几种：

+ serif（衬线）
+ sans-serif（无衬线）
+ monospace（等宽）
+ fantasy（梦幻）
+ cuisive（草体）

这 5 个分类是 `font-family` 的 5 个可用字体系列取值。也就是说，上述 5 个名字，代表的并非某个特定字体，而是一系列字体，这些通用的名称允许用户代理从相应集合中选择一款字体[^2]。

我们可以在博客主题文件夹下的 `~/source/css/_variables/base.styl` 文件中找到 NexT 主题的字体设定：

```css
/* Font families. */
$font-family-chinese      = "PingFang SC", "Microsoft YaHei";

$font-family-base         = $font-family-chinese, sans-serif;
$font-family-base         = get_font_family('global'), $font-family-chinese, sans-serif if get_font_family('global');

$font-family-logo         = $font-family-base;
$font-family-logo         = get_font_family('title'), $font-family-base if get_font_family('title');

$font-family-headings     = $font-family-base;
$font-family-headings     = get_font_family('headings'), $font-family-base if get_font_family('headings');

$font-family-posts        = $font-family-base;
$font-family-posts        = get_font_family('posts'), $font-family-base if get_font_family('posts');

$font-family-monospace    = consolas, Menlo, monospace, $font-family-chinese;
$font-family-monospace    = get_font_family('codes'), consolas, Menlo, monospace, $font-family-chinese if get_font_family('codes');

$font-family-icons        = 'FontAwesome';
```

从这一部分的代码可以看出，NexT 默认的中文字体（font-family-chinese）是 `PingFang SC` 和 `Microsoft YaHei`，同时设定两个字体，在浏览网站的时候，浏览器会优先选取放在第一位的字体 `PingFang SC`，这是苹果系统的苹方字体。而如果你使用的是 Windows 系统，计算机中并未安装 `PingFang SC`，那么浏览器就会选择排在其后的 `Microsoft YaHei`，也就是微软雅黑字体。而博客中的基础字体（font-family-base）设定中，先是选用中文字体，在中文字体后添加了一个 `sans-serif`，也就是无衬线字作为最后的设定。也就是说，如果你的计算机系统中，苹方字体和微软雅黑都没有安装，那么浏览器就会选择你计算机系统中带有的基本无衬线字体。除此之外，这一部分代码也包含博客中的标题、文章主体、以及代码区域的字体设定。

目前，电子显示屏上使用的字体普遍是无衬线体，比如黑体。在过去，因为屏幕技术的限制，想要在屏幕上展现出好看的衬线字角非常困难。如今高清显示屏的普及，在同质化的屏幕界面上使用衬线体为读者提供了另一种阅读选择。合适的衬线字体被引入到屏幕中，为单调的无衬线字体世界带来了新鲜的阅读体验。[^3]对于中文来说，宋体就是一种标准的衬线字体，衬线的特征非常明显。我们可以考虑将博客的中文默认字体更换为宋体，这样可以增强读者的阅读体验。

![hexo-theme-next-fonts-serif.jpg](/images/hexo-theme-next-fonts-serif.jpg "石碑与屏幕上的字体")

#### 方法一：直接使用本地字体

直接在上文提到的 `base.styl` 文件中修改默认字体即可，比如你想使用楷体，就在 `font-family-chinese` 的开头添加 `'STKaiti'`。最好不要删除主题默认的字体，而是直接在最前端添加字体，因为如果你的计算机中并没有这个字体，也能优先显示第二种字体，而不是显示最后的  `sans-serif`。不过这种设定方法的缺陷正是在这里，你设定的字体或许在你的计算机中安装了，但并不能保证在别人的计算机中安装了，所以就会出现你设定的字体在别人浏览你的博客的时候无法显示出来。目前 NexT 主题的代码默认字体（font-family-monospace）就存在这样的问题，你在 PC 端浏览博客，看到的代码区域字体为等宽字体，但在手机端浏览，却只能显示无衬线字体。

#### 方法二：上传字体至博客目录

因为直接使用本地字体存在很大的缺陷，所以我们可以考虑上传自己想要的字体至博客中，这样，在别人浏览博客的时候，浏览器会优先加载并显示你上传的字体，而不是使用本地字体。这种方法最大的缺点就是中文字体的使用，因为中文字体不像英文那样只有 26 个字母，我们平时经常使用到的汉字有数千个，如果把这些汉字字体全部上传至博客中，占用的空间很大，加载速度也是一个问题。不过我们可以考虑使用这种方法来显示英文字体。

举个例子，比如你想使用 Linux Biolinum 字体。

[^4]![hexo-theme-next-fonts-linux-biolinum.png](/images/hexo-theme-next-fonts-linux-biolinum.png "Linux Biolinum 字体")

首先，下载 Linux Biolinum 字体，这里我提供一个下载地址：[linux-biolinum.zip](/uploads/linux-biolinum.zip)。下载该压缩文件后，将里面的文件解压至博客根目录下的 `~/source/fonts/` 文件夹中，若无 `fonts` 文件夹请自建。

然后在 `styles.styl` 文件中添加以下内容：

```css
/* 文件位置：~/source/_data/styles.styl */
@font-face {
  font-family: 'Linux Biolinum';
  src: url("/fonts/LinBiolinum_Rah.eot");
  font-display: swap;
  src: url("/fonts/LinBiolinum_Rah.eot") format('embedded-opentype'), url("/fonts/LinBiolinum_Rah.woff2") format('woff2'), url("/fonts/LinBiolinum_Rah.woff") format('woff'), url("/fonts/LinBiolinum_Rah.ttf") format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Linux Biolinum';
  src: url("/fonts/LinBiolinum_RBah.eot");
  font-display: swap;
  src: url("/fonts/LinBiolinum_RBah.eot") format('embedded-opentype'), url("/fonts/LinBiolinum_RBah.woff2") format('woff2'), url("/fonts/LinBiolinum_RBah.woff") format('woff'), url("/fonts/LinBiolinum_RBah.ttf") format('truetype');
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'Linux Biolinum';
  src: url("/fonts/LinBiolinum_RIah.eot");
  font-display: swap;
  src: url("/fonts/LinBiolinum_RIah.eot") format('embedded-opentype'), url("/fonts/LinBiolinum_RIah.woff2") format('woff2'), url("/fonts/LinBiolinum_RIah.woff") format('woff'), url("/fonts/LinBiolinum_RIah.ttf") format('truetype');
  font-weight: normal;
  font-style: italic;
}
```

最后，在 `base.styl` 文件中修改：

```diff
-$font-family-chinese      = "PingFang SC", "Microsoft YaHei"
+$font-family-chinese      = "Linux Biolinum", "PingFang SC", "Microsoft YaHei"
```

这样优先显示的就是该英文字体了。

#### 方法三：使用 Google Fonts

我的博客字体就是使用了这一种方法进行加载的。[Google Fonts](https://fonts.google.com/) 提供了数百种高质量英文字体的 API，你可以通过调用 Google Fonts 免费使用其提供的字体服务。目前 Google Fonts 提供了几种中文简体字体，其中就有思源宋体。

![hexo-theme-next-google-fonts-chinese-simplified.png](/images/hexo-theme-next-google-fonts-chinese-simplified.png "Google Fonts 提供的中文简体字体")

面对电子显示屏上千篇一律的黑体字，当读者看到一个显示宋体字的网页自然会眼前一亮。再加上合理的排版，你的博客必然会脱颖而出。宋体的衬线更适合长时间阅读，这也是目前各类阅读器或者浏览器上的阅读模式都会使用衬线字的原因。



## 文章内容美化

## 结尾

[^1]: 图源：<https://github.com/theme-next/hexo-theme-next>。
[^2]: 参考：[前端开发你该知道的字体 font-family | fly63 前端网](http://www.fly63.com/article/detial/1114)。
[^3]: 参考：[衬线体的进化：从纸面到屏幕 | 方正字库](https://zhuanlan.zhihu.com/p/49470735)。
[^4]: 图源：<https://www.fontke.com/family/290108/>。