+++
title = "网站字体优化方案"
date = "2019-06-11T23:58:24+08:00"
tags = ["hexo","next","typography"]
series = ["create-a-blog"]
+++

就网页常用的一些字体而言，最常用的三类字形为：serif（衬线）、sans-serif（无衬线）、monospace（等宽）。这三个分类是 `font-family` 的三个可用字体系列取值。也就是说，上述三个名字，代表的并非某个特定字体，而是一系列字体，这些通用的名称允许用户代理从相应集合中选择一款字体[^1]。

对于使用 Hexo 博客框架 NexT 主题的读者来说，我们可以在博客主题文件夹下的 `~/source/css/_variables/base.styl` 文件中找到 NexT 主题的字体设定：

```css
/* 文件位置：~/themes/next/source/css/_variables/base.styl */

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

目前，电子显示屏上使用的字体普遍是无衬线体，比如黑体。在过去，因为屏幕技术的限制，想要在屏幕上展现出好看的衬线字角非常困难。如今高清显示屏的普及，在同质化的屏幕界面上使用衬线体为读者提供了另一种阅读选择。合适的衬线字体被引入到屏幕中，为单调的无衬线字体世界带来了新鲜的阅读体验。[^2]对于中文来说，宋体就是一种标准的衬线字体，衬线的特征非常明显。我们可以考虑将博客的中文默认字体更换为宋体，这样可以增强读者的阅读体验。

![hexo-theme-next-fonts-serif.jpg](/images/hexo-theme-next-fonts-serif.jpg "石碑与屏幕上的字体")

## 直接使用本地字体

直接在上文提到的 `base.styl` 文件中修改默认字体即可，比如你想使用楷体，就在 `font-family-chinese` 的开头添加 `'STKaiti'`。最好不要删除主题默认的字体，而是直接在最前端添加字体，因为如果你的计算机中并没有这个字体，也能优先显示第二种字体，而不是显示最后的  `sans-serif`。不过这种设定方法的缺陷正是在这里，你设定的字体或许在你的计算机中安装了，但并不能保证在别人的计算机中安装了，所以就会出现你设定的字体在别人浏览你的博客的时候无法显示出来。目前 NexT 主题的代码默认字体（font-family-monospace）就存在这样的问题，你在 PC 端浏览博客，看到的代码区域字体为等宽字体，但在手机端浏览，却只能显示无衬线字体。

## 上传字体至博客目录

因为直接使用本地字体存在很大的缺陷，所以我们可以考虑上传自己想要的字体至博客中，这样，在别人浏览博客的时候，浏览器会优先加载并显示你上传的字体，而不是使用本地字体。这种方法最大的缺点就是中文字体的使用，因为中文字体不像英文那样只有 26 个字母，我们平时经常使用到的汉字有数千个，如果把这些汉字字体全部上传至博客中，占用的空间很大，加载速度也是一个问题。不过我们可以考虑使用这种方法来显示英文字体。

举个例子，比如你想使用 Linux Biolinum 字体。

[^3]![hexo-theme-next-fonts-linux-biolinum.png](/images/hexo-theme-next-fonts-linux-biolinum.png "Linux Biolinum 字体")

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
# 文件位置：~/themes/next/source/css/_variables/base.styl

// Font families.
-$font-family-chinese      = "PingFang SC", "Microsoft YaHei"
+$font-family-chinese      = "Linux Biolinum", "PingFang SC", "Microsoft YaHei"
```

这样优先显示的就是该英文字体了。

## 使用 Google Fonts

我的博客字体就是使用了这一种方法进行加载的。[Google Fonts](https://fonts.google.com/) 提供了数百种高质量英文字体的 API，你可以通过调用 Google Fonts 免费使用其提供的字体服务。目前 Google Fonts 提供了几种中文简体字体，其中就有思源宋体。

![hexo-theme-next-google-fonts-chinese-simplified.png](/images/hexo-theme-next-google-fonts-chinese-simplified.png "Google Fonts 提供的中文简体字体")

面对电子显示屏上千篇一律的黑体字，当读者看到一个显示宋体字的网页自然会眼前一亮。再加上合理的排版，你的博客必然会脱颖而出。宋体的衬线更适合长时间阅读，这也是目前各类阅读器或者浏览器上的阅读模式都会使用衬线字的原因。使用 Google Fonts 字体的方法很简单，NexT 主题配置文件中已经提供了设置：

```yaml
# 文件位置：~/themes/next/_config.yml

font:
  # Use custom fonts families or not.
  # Depended options: `external` and `family`.
  enable: false

  # Uri of fonts host, e.g. //fonts.googleapis.com (Default).
  host:

  # Font options:
  # `external: true` will load this font family from `host` above.
  # `family: Times New Roman`. Without any quotes.
  # `size: x.x`. Use `em` as unit. Default: 1 (16px)

  # Global font settings used for all elements inside <body>.
  global:
    external: true
    family: Lato
    size:

  # Font settings for site title (.site-title).
  title:
    external: true
    family:
    size:

  # Font settings for headlines (<h1> to <h6>).
  headings:
    external: true
    family:
    size:

  # Font settings for posts (.post-body).
  posts:
    external: true
    family:

  # Font settings for <code> and code blocks.
  codes:
    external: true
    family:
```

首先将 `enable:` 的 `false` 改为 `true`，然后在 `host:` 后添加 Google Fonts API 地址：`fonts.googleapis.com`。如果觉得 Google 相关网址的载入速度不太理想，可以考虑将 `googleapis.com` 修改为烧饼博客提供的镜像 `loli.net`，不过我觉得载入速度还算可以。

然后，设置中下面的一些选项，就是设定博客各区域的字体，比如网站标题 `title`，文章内容 `posts`……这些都可以进行修改，你要做的只是到 Google Fonts 上找到适合的字体，然后将字体的名字填写到 `family:` 中。最关键的是 `global` 字体的设定，这里的字体将会是你网站的基本（全局）字体。个人建议不要在这里填思源宋体的名字 `Noto Serif SC`，而是选取一款英文字体进行填写。因为中文字体往往携带同样的英文字体，如果将中文字体优先级设置为第一位，那么英文字体必将也会是中文字体的样式。如果你在这里设置的是 `Noto Serif SC`，那么英文字体也会是 `Noto Serif SC`。那么，中文字体到哪里去设置呢？当然还是要到 `base.styl` 文件中，直接这样修改：

```diff
# 文件位置：~/themes/next/source/css/_variables/base.styl

// Font families.
-$font-family-chinese      = "PingFang SC", "Microsoft YaHei"
+$font-family-chinese      = "Noto Serif SC"
```

然后进入 [Google Fonts](https://fonts.google.com/)，搜索 Noto Serif SC，点 `+` 号选择，选择好后底部会弹出一个提示框，里面有使用说明。还可以点击提示框中的 `CUSTOMIZE` 定制要加载的字重与语言。之后，点击 `EMBED`，复制生成的 `<link>` 代码，添加到博客的 `<head>` 标签内，NexT 主题可直接添加到 `~/source/_data/head.swig` 文件中。如果你想使用上文中提到的烧饼博客镜像，就将代码中的将 `googleapis.com` 修改为 `loli.net`。

![hexo-theme-next-google-fonts-select.png](/images/hexo-theme-next-google-fonts-select.png "定制字体")

为了方便，我在这里直接给出代码：

```html
<!-- 文件位置：~/source/_data/head.swig -->

<link href="https://fonts.googleapis.com/css?family=Noto+Serif+SC:400,500,700&display=swap&subset=chinese-simplified" rel="stylesheet">
```

{{< notice notice-note >}}
注意：Google Fonts 为庆祝十周年对网站进行了改版，支持了可变字体（Variable Fonts）的加载。目前从网站上进行配置得到的代码与我在上文中所给的代码有一些差异，为了体验到最好的字体载入效果，建议亲自到 Google Fonts 网站进行配置。

![hexo-theme-next-google-fonts-ten-years.png](/images/hexo-theme-next-google-fonts-ten-years.png "Google Fonts 在其 twitter 上的说明")
{{< /notice >}}

考虑到宋体的笔画要比黑体细，因此建议通过自定义 CSS 将字体的颜色加深，比如修改为 `#333`，以达到较好的阅读效果。

```css
/* 文件位置：~/source/_data/styles.styl */

.post-body {
    color: #333;
}
```

这种先在 `<head>` 中引入字体，再通过 CSS 设定字体显示部位的方式适用于各种网页的设计，不局限于 NexT 主题。另外，我在这里给出我认为比较好的博客字体设定：

+ 中文字体：Noto Serif SC
+ 英文字体：EB Garamond
+ 标题字体：Cinzel Decorative
+ 代码字体：Source Code Pro

## 我的博客字体

我的博客字体设定有些奇葩，如果不想太折腾，直接使用我在上文推荐的 Google Fonts 字体就可以了。我的博客字体设定如下：

+ 中文字体：Noto Serif SC
+ 英文字体：Amstelvar
+ 代码字体：JetBrains Mono

中文字体使用的是 Google Fonts 的思源宋体 Noto Serif SC，因为对于中文衬线字体而言，这是最佳的选择。英文字体使用的是 [Amstelvar](https://github.com/TypeNetwork/Amstelvar)，这个字体是开源的可变字体，需要自行通过 CSS 设定字重和字宽，我直接将 `woff2` 格式的字体上传到博客中进行本地加载。代码字体使用的是 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)，这是 2020 年 JetBrains 开源的一款等宽字体，风格独特，感觉很酷。

[^1]: 参考：[前端开发你该知道的字体 font-family | fly63 前端网](http://www.fly63.com/article/detial/1114)
[^2]: 参考：[衬线体的进化：从纸面到屏幕 | 方正字库](https://zhuanlan.zhihu.com/p/49470735)
[^3]: 图源：[Linux Biolinum | Fontke](https://www.fontke.com/family/290108/)