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

博客的建立最关键的就是选择主题，NexT 主题是目前使用人数最多的 Hexo 博客主题。如果你想要尝试其他主题，可以去 Hexo Themes 慢慢找。对于在 GitHub 上 Star 较多的几个主题，我都有尝试过，对于这些主题的简要分析可以参考我的这一篇[文章](/study/blog/blog-theme/)。最终我选择 NexT 的原因正是它简洁、功能齐全、更新维护速度快。

### 安装 NexT 主题

目前在 GitHub 上面有两个 NexT 主题的仓库，一个是 v6.0.0 之前版本的[个人仓库](https://github.com/iissnan/hexo-theme-next)，因为主题原作者停止维护该主题，所以有高人另起炉灶，单独创立了一个 NexT 的 Organization，目前最新版本的主题在这个[仓库](https://github.com/theme-next/hexo-theme-next)中。我发现到目前为止，还有很多人选择从旧仓库下载只有 v5 版本的主题，无视仓库停止维护的公告，依旧在旧仓库中发起很多早已解决的 issues，真是令人哭笑不得。所以为了避免一些不必要的麻烦，在这里我还是要提醒各位读者，请从[这里](https://github.com/theme-next/hexo-theme-next)下载最新版本的主题，以防主题版本太旧，从而与 Hexo 版本或是环境之间发生冲突。

你可以选择直接 `clone` 主分支（master）的最新版本主题文件到 Hexo 的主题文件夹（`themes`）中：

```bash
$ cd hexo
$ git clone https://github.com/theme-next/hexo-theme-next themes/next
```

或者到 Releases 中下载每月月初发布的[发行版](https://github.com/theme-next/hexo-theme-next/releases)主题，将压缩文件中的内容解压至主题文件夹下的 `next` 文件夹中。

然后在站点配置文件 `_config.yml` 中修改主题名称：

```yml
# 文件位置：~/_config.yml

## Themes: https://hexo.io/themes/
theme: next
```

我比较喜欢下载和更新发行版的主题，因为版本明确，便于管理。不过对于 NexT 主题来说，发行版和主分支的版本并没有什么区别，发行版只是一个每月月初的「总结」罢了。虽然发行版是稳定的版本，不过主分支的版本一定会解决一些在当前发行版中可能出现的 BUG，或许也会添加一些新的功能，当然也不可避免一些新 BUG 的出现。所以这两种版本到底选择哪一个，只能看你自己的想法了。

### 站点配置文件

首先，请认真查看 [Hexo 官方文档](https://hexo.io/zh-cn/docs/configuration.html)的说明，基本上每一处的设置都有较为详细的解释。我在这里也给出我的设定，这里 Hexo 版本为 v4.0.0，其他版本的配置基本相同。这里还需要提醒一下，各项参数名称的 `:` 为半角字符，且其后需要一个空格再写内容。另外，不要随意添加任何内容，除非是安装一些特定的插件，需要在这里进行一些参数的设定，因为这类操作可能会影响到博客的生成。

```yml
# 文件位置：~/_config.yml
# Hexo version: v4.0.0

# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
## 网站标题、副标题、网站描述、关键词、作者、语言等基本信息的配置
title: 荷戟独彷徨
subtitle: The Sound of Silence
description: 啼鸟怨年华
keywords: 
author: Guanqr
language: zh-CN
timezone: Asia/Shanghai

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
## 博客的网址及文章 URL 结构，默认在根目录
## 如果你想要将博客设定在一个子目录，如 'http://yoursite.com/blog'，则将 root 设定为该子目录的名称 '/child/'
## 建议博客的 URL 结构在博客建立初期就规划好，因为当你写的文章被搜索引擎收录以及被读者收藏后，再更改结构，会对你的网站访问造成一定影响
url: https://blog.guanqr.com/
root: /
## 详细参数请查看：https://hexo.io/docs/permalinks.html
## 这里默认的路径太不利于 SEO，建议修改成较短的链接。比如 'year:month:day/:title/'
## 或者你也可以考虑使用一些插件，直接生成永久链接，如 hexo-abbrlink 插件：https://github.com/rozbo/hexo-abbrlink
permalink: :year/:month/:day/:title/
permalink_defaults:

# Directory
## 这里是设定一些基本文件夹的名称，如资源文件夹等。
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
## skip_render 是为了避免在执行 'hexo generate' 命令后将一些你不想转义的文件转成 HTML 格式。
## 比如 README.md，你可以将这些文件名填写在括号内，格式为 [README.md, Post1.md, Post2.md]
skip_render: [README.md]

# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
## post_asset_folder 设置为 true 后，当你新建一个 post 的时候，会在同级目录生成一个相同名字的文件夹
post_asset_folder: false
relative_link: false
future: true
## 代码高亮设置
highlight:
  enable: true
  line_number: true
## 代码自动高亮
  auto_detect: false
  tab_replace:
  
# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: ''
  per_page: 10
  order_by: -date
  
# Category & Tag
default_category: uncategorized
## URL 中的分类和标签「翻译」成英文
## 参见：https://github.com/hexojs/hexo/issues/1162
category_map:
tag_map:

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next

# 以下为我额外添加的参数设定

# Deployment
## Docs: https://hexo.io/docs/deployment.html
## Dependency: https://github.com/hexojs/hexo-deployer-git
## 设定执行 'hexo deploy' 命令后提交的代码仓库地址
deploy:
  type: git
  repo: https://github.com/guanqr/guanqr.github.io.git
  branch: master
  
# 推荐文章功能插件，需要同主题配置文件一起设定
## Dependency: https://github.com/huiwang/hexo-recommended-posts
recommended_posts:
  server: https://api.truelaurel.com #后端推荐服务器地址
  timeoutInMillis: 10000 #服务时长，超过此时长，则使用离线推荐模式
  internalLinks: 5 #内部文章数量
  externalLinks: 0 #外部文章数量
  fixedNumber: true
  autoDisplay: false

# Aplayer 音乐播放器插件
## Dependency: https://github.com/MoePlayer/hexo-tag-aplayer
aplayer:
  script_dir: js # Public 目录下脚本目录路径，默认: 'assets/js'
  style_dir: css # Public 目录下样式目录路径，默认: 'assets/css'
  #cdn: http://xxx/aplayer.min.js # 引用 APlayer.js 外部 CDN 地址 (默认不开启)
  #style_cdn: http://xxx/aplayer.min.css # 引用 APlayer.css 外部 CDN 地址 (默认不开启)
  meting: true # MetingJS 支持
  #meting_api: http://xxx/api.php # 自定义 Meting API 地址
  #meting_cdn: http://xxx/Meing.min.js # 引用 Meting.js 外部 CDN 地址 (默认不开启)
  asset_inject: true # 自动插入 Aplayer.js 与 Meting.js 资源脚本, 默认开启
  #externalLink: http://xxx/aplayer.min.js # 老版本参数，功能与参数 cdn 相同

# NexT 主题统计文章字数与阅读时长功能，需要同主题配置文件一起设定
symbols_count_time:
  symbols: true
  time: true
  total_symbols: true
  total_time: true
  exclude_codeblock: false
```

### 主题配置文件

NexT 主题的配置文件内容有很多，因为该主题有很多扩展功能。在配置主题各项功能之前，我建议先阅读 [NexT 官方网站](https://theme-next.org/)[^2]的相关文档说明。主题配置文件内容过长，为了排版美观以及阅读方便，这里我将分功能对主题的设定进行较为详细的说明，一些我认为不太重要的配置就不再说明。这里我的 NexT 版本为 v7.4.2，不同版本之间的配置文件可能有微小变化，这里仅供参考。我的完整的主题配置文件可在这里下载：[hexo-theme-next-config.zip](/uploads/hexo-theme-next-config.zip)。

#### 自定义配置

对应配置文件中的 `custom_file_path` 内容，如果你需要在网站的 `<head>`、`<body>` 等部位添加自己的代码，无需直接修改主题文件，NexT 主题拥有多样自由的注入功能，这一部分的说明参见下一章节「[网页样式布局](#网页样式布局)」

#### 基本信息配置

##### 站点图标

主题自带的站点图标是 NexT 主题的 LOGO，图片存放位置位于..主题文件夹..下的 `/source/images/` 文件夹。如果你想要自定义图标，可以不用修改该文件夹的内容，直接在..博客根目录..下的 `source` 文件夹下创建一个名为 `images` 的文件夹，将对应的图片存放于该文件夹下即可。注意，图片的大小及文件格式最好与原主题保持一致。

```yml
favicon:
  small: /images/favicon-16x16-next.png
  medium: /images/favicon-32x32-next.png
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml
```

##### RSS 订阅

开启博客的订阅功能，需要安装 hexo-generator-feed 插件，然后在 `rss: ` 后添加 `/atom.xml`，如下所示：

```diff
# hexo-generator-feed required for rss support. Leave rss as blank to use site's feed link.
# Set rss to false to disable feed link. Set rss to specific value if you have burned your feed already.
+ rss: /atom.xml
```

##### 页脚信息

在网页的底部显示版权信息，包括年份、图标、作者信息，是否显示 Hexo 及其版本、NexT 及其版本，还有备案信息。这里的图标我设置成了心形，颜色为红色（`#ff0000`），并且添加了动画效果：`animated: true`。这里的图标名称需要填写 [Font Awesome](https://fontawesome.com/) 中提供的图标名称。如果你想要添加任何自定义内容，比如添加一句话，可以考虑在 `~/source/_data/` 路径下建立 `footer.swig` 文件，在该文件下添加内容。

```yml
footer:
  # Specify the date when the site was setup. If not defined, current year will be used.
  since: 2019

  # Icon between year and copyright info.
  icon:
    # Icon name in Font Awesome. See: https://fontawesome.com/v4.7.0/icons/
    # `heart` is recommended with animation in red (#ff0000).
    name: heart
    # If you want to animate the icon, set it to true.
    animated: true
    # Change the color of icon, using Hex Code.
    color: "#ff0000"

  # If not defined, `author` from Hexo `_config.yml` will be used.
  copyright: Guanqr

  powered:
    # Hexo link (Powered by Hexo).
    enable: true
    # Version info of Hexo after Hexo link (vX.X.X).
    version: true

  theme:
    # Theme & scheme info link (Theme - NexT.scheme).
    enable: true
    # Version info of NexT after scheme info (vX.X.X).
    version: true

  # Beian ICP and gongan information for Chinese users. See: http://www.beian.miit.gov.cn, http://www.beian.gov.cn
  beian:
    enable: false
    icp:
    # The digit in the num of gongan beian.
    gongan_id:
    # The full num of gongan beian.
    gongan_num:
    # The icon for gongan beian. See: http://www.beian.gov.cn/portal/download
    gongan_icon_url:
```

##### 版权声明

此处的版权声明可以选择在侧栏和文章的末尾两处显示。在侧栏显示版权声明我觉得有些突兀，所以我选择在文章末尾显示。

```yml
creative_commons:
  # 版权协议
  license: by-nc-sa
  # 侧栏显示
  sidebar: false
  # 文章末尾显示
  post: true
  # 语言
  language:
```

#### 主题风格配置

NexT 主题最大的特点就是提供了四套风格的主题，其中 Muse 和 Mist 两款风格相近，Pisces 和 Gemini 两款风格相近。我的博客主题是基于 Muse 主题进行修改的，对于这四款主题的选择，仁者见仁，智者见智。我在这篇[文章](/study/blog/blog-theme/)中分析了我对这四种风格的看法，可供参考。

```yml
# Schemes
scheme: Muse
#scheme: Mist
#scheme: Pisces
#scheme: Gemini
```

#### 导航目录配置

##### 一级目录

你可以在此处设置目录选项的名称和所在文件夹的位置，以及对应的图标，这里的图标同样需要对应 Font Awesome 中图标的名称。

```yml
menu:
  home: / || home
  #about: /about/ || user
  #tags: /tags/ || tags
  #categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat
```

以 `home: / || home` 为例，第一个 `home` 为该目录选项的名称，此处可以先设置成英文，然后在 `~/themes/next/languages/zh-CN.yml` 下对应的 `menu:` 下添加对应的中文，格式为 `home: 首页`。`home: `后填写的是该页面的文件夹位置，`/` 即为网站的根目录。`||` 后的 `home` 即为图标名称。

如果你要建立标签页面和分类页面，首先需要去掉 `tags` 和 `categories` 前的注释，然后在 `~/source/` 文件夹下建立该页面，对应名称为 `tags` 和 `categories`。可以执行以下命令生成：

```bash
hexo new page tags
hexo new page categories
```

然后可以发现在 `~/source/` 文件夹中生成了对应名称的文件夹，在该文件夹下会有一个 `index.md` 文件，打开该文件，在如下所示位置添加内容：

```diff
---
title: 
date: 
+ type: "name"
---
```

其中，在 `name` 处，标签页面就替换为 `tags`，分类页面替换为 `categories`。填写对应类型后，主题会根据类型对页面进行渲染，前提是 NexT 主题支持你设定的这种类型。不同类型格式的模板存放在 `~/themes/next/layout/` 文件夹下，你也可以自己写一个类型模板存放在此处。

如果你想要在目录中建立其他页面的链接入口，比如友情链接，可以添加：

```diff
menu:
+ links: /links/ || user-plus
```

对应在 `~/source/` 文件夹下建立名为 `links` 的页面，此时你会发现该链接的名称为英文名 `links`，如果你想要就改成中文，可以直接在此处直接将 `links` 修改为中文 `友链`，不过另一种通用的方法就是在主题的语言包文件中添加对应的翻译。在 `zh-CN.yml` 文件中的如下位置添加对应翻译：

```diff
# 文件位置：~/themes/next/languages/zh-CN.yml

menu:
+ links: 友链
```

##### 多级目录

NexT 主题支持多级目录，但是官网并没有直接给出配置的方法，因此很少见到有人使用，具体的样式可以参考官方网站的 [Docs](https://theme-next.org/docs/) 页面，其上方的样式即为二级目录和三级目录。

![hexo-theme-next-title.png](/images/hexo-theme-next-title.png "多级目录样式")

就以官方网站的 Docs 页面为例，其配置文件的目录设定内容为：

```yml
menu:
    News: / || bullhorn

    Docs:
      default: /docs/ || book

      Getting Started:
        default: /getting-started/ || flag
        Installation: /installation.html || download
        Deployment: /deployment.html || upload
        Data Files: /data-files.html || wrench
        Update from 5.x: /update-from-v5.html || retweet

      Theme Settings:
        default: /theme-settings/ || star
        Footer: /footer.html || sun-o
        Sidebar: /sidebar.html || bars
        Posts: /posts.html || pencil-square-o
        Custom Pages: /custom-pages.html || file-o
        SEO: /seo.html || external-link-square
        Front Matter: /front-matter.html || header

      Third Party Services:
        default: /third-party-services/ || plug
        Math Equations: /math-equations.html || superscript
        Comment Systems: /comments.html || comments-o
        Statistics and Analytics: /statistics-and-analytics.html || bar-chart
        Post Widgets: /post-widgets.html || share-square
        Search Services: /search-services.html || search-plus
        Chat Services: /chat-services.html || comment
        External Libraries: /external-libraries.html || puzzle-piece

      Tag Plugins:
        default: /tag-plugins/ || rocket
        Note: /note.html || comment
        Tabs: /tabs.html || columns
        PDF: /pdf.html || file-pdf-o
        Mermaid: /mermaid.html || tasks
        Label: /label.html || font
        Video: /video.html || video-camera
        Button: /button.html || square
        Caniuse: /caniuse.html || signal
        Group Pictures: /group-pictures.html || file-image-o

      Advanced Settings: /advanced-settings.html || cogs
      FAQ's: /faqs.html || life-ring
      Troubleshooting: /troubleshooting.html || bug
    archives: /archives/ || archive
```

也就是说，在一级目录 `Docs` 下，我们想要创建 `Getting Started`、`Theme Settings` 等二级目录页面，那么需要作出如下修改：

```diff
menu:
-   Docs: /docs/ || book
+   Docs:
+         default: /docs/ || book
```

即将当前目录默认页面的名称改为 `default`。然后再在 `default` 同级下添加：

```diff
Docs:
      default: /docs/ || book
+     Getting Started: /getting-started/ || flag
+     Theme Settings: /theme-settings/ || star
```

我们需要在 `~/source/docs/` 文件夹下创建对应的文件夹 `Getting Started` 和 `Theme Settings`，文件夹中创建对应的 `index.md` 文件，该文件即为其二级目录对应页面内容的存放文件。

同样，创建三级目录的时候，需要将对应的二级目录默认页面改为 `default`，然后在同级下添加同样格式的内容，在此不再赘述。如果你还没有明白是怎么设定的，可以研究一下 NexT 官方网站的源码[仓库](https://github.com/theme-next/theme-next.org)文件的存放位置。

#### 侧栏配置

##### 侧栏样式

目前侧栏四个主题风格..都支持..选择在左侧还是右侧显示。旧版本中这一功能仅有 Pisces 和 Gemini 支持，Muse 和 Mist 只能显示在右侧，因此网上出现了一些教程教你如何修改 Muse 和 Mist 的侧边栏到左侧，不过这些教程中的方法并不完美，会在动画显示等方面出现 BUG。你也可以在该项配置中配置在移动端显示侧边栏，这是我很喜欢的一个功能，毕竟侧边栏中含有很多博客的基本信息，比如你的头像、联系方式等等，如果在移动端不能显示这些内容，总觉得缺少某些东西……不过这项功能目前..仅支持.. Muse 和 Mist。

```yml
sidebar:
  # Sidebar Position.
  #position: left
  position: right

  # Manual define the sidebar width. If commented, will be default for:
  # Muse | Mist: 320
  # Pisces | Gemini: 240
  #width: 300

  # Sidebar Display (only for Muse | Mist), available values:
  #  - post    expand on posts automatically. Default.
  #  - always  expand for all pages automatically.
  #  - hide    expand only when click on the sidebar toggle icon.
  #  - remove  totally remove sidebar including sidebar toggle.
  display: hide

  # Sidebar offset from top menubar in pixels (only for Pisces | Gemini).
  offset: 12
  # Enable sidebar on narrow view (only for Muse | Mist).
  onmobile: true
```

##### 个人头像

这里的设定不是博客标识，而是显示在侧栏的个人标识，即作者头像。你可以设定头像的边框为正方向还是圆形，设定鼠标停靠在头像上时是否旋转。

```yml
# Sidebar Avatar
avatar:
  # In theme directory (source/images): /images/avatar.gif
  # In site directory (source/uploads): /uploads/avatar.gif
  # You can also use other linking images.
  url: /images/guanqr-avatar.jpg
  # If true, the avatar would be dispalyed in circle.
  rounded: true
  # If true, the avatar would be rotated with the cursor.
  rotated: true
```

##### 社交链接

在侧栏中添加你的社交链接，格式与[上文](#导航目录)中目录的设定相同，即：`名称: 链接 || 图标`。你也可以在这里设定是图标和名称一起显示还是只显示图标。

```yml
social:
  GitHub: https://github.com/guanqr || github
  Telegram: https://t.me/guanqr || telegram
  CC98: https://www.cc98.org/user/id/583696 || graduation-cap
  E-Mail: mailto:guanqirui@zju.edu.cn || envelope

social_icons:
  enable: true
  icons_only: false
  transition: true
```

#### 文章页面配置

##### 首页文章摘要

如果这一部分内容选择默认配置的话，你会发现你的主页所有的文章都是默认全部展开的，这对于网页的阅读效率影响很大，最佳的阅读体验应该是，在首页只能看到这篇文章的摘要，只有点击该篇文章才可阅读全文。这一部分的配置就是实现该功能的。

```yml
# Automatically scroll page to section which is under <!-- more --> mark.
scroll_to_more: true

# Automatically excerpt description in homepage as preamble text.
excerpt_description: true

# Automatically excerpt (Not recommend).
# Use <!-- more --> in the post to control excerpt accurately.
auto_excerpt:
  enable: true
  length: 150
```

我们不妨把这三部分的配置都设定为 `true`，下面我对这三项配置逐一解释。

1. 第一项配置需要我们在文章中..手动..添加 `<!-- more -->` 标记，在网页生成的时候，如果文中有该标记，那么 Hexo 就可以自动截取该标记前的内容作为文章摘要。
2. 第二项配置即为添加 `description` 描述。如果你的文章中有添加对该文章的描述内容，如 `description: This is a test.`，那么在生成网页的时候，Hexo 会自动截取描述的内容作为文章的摘要，其优先级大于 `<!-- more -->` 标记。
3. 第三项配置即为自动截取文章前段内容作为摘要，这一项需要自己配置自动截取的字数。这一项的优先级最低。

##### 文章元数据

即每一篇文章标题下的写作时间、更新时间等信息。

```yml
# Post meta display settings
post_meta:
  item_text: true
  created_at: true
  updated_at:
    enable: true
    another_day: true
  categories: true

# Post wordcount display settings
# Dependencies: https://github.com/theme-next/hexo-symbols-count-time
symbols_count_time:
  separated_meta: true
  item_text_post: true
  item_text_total: false
  awl: 2
  wpm: 275
```

对于 `symbols_count_time`，即文章字数与阅读时长统计的信息，需要依赖 hexo-symbols-count-time 插件。具体的配置方法可参考该插件的[说明文档](https://github.com/theme-next/hexo-symbols-count-time)。这里提醒一下，该项功能的设定还需要在..站点配置文件..中添加以下内容：

```yml
symbols_count_time:
  symbols: true
  time: true
  total_symbols: true
  total_time: true
  exclude_codeblock: false
```

如果没有添加上述内容，则无法显示统计信息。

##### 标签图标

主题默认的标签图标是一个 `#` ，这里可以将其修改为标签对应的 Font Awesome 图标。目前网络上有很多关于此的教程，不过那都是针对旧版本主题的，新版本主题直接在这里修改即可。

```yml
# Use icon instead of the symbol # to indicate the tag at the bottom of the post
tag_icon: true
```

##### 微信订阅

开启微信订阅功能的时候不要忘记填写二维码所在路径。这里的微信订阅功能开启后，会在文章的末尾显示二维码，个人认为这个设计有些丑陋，你也可以选择像我一样在页脚放置一个二维码链接。只有鼠标停靠在图标上时才会弹出二维码。关于该项功能的实现请看下文。

```yml
# Wechat Subscriber
wechat_subscriber:
  enable: false
  qcode: #/uploads/wechat-qcode.jpg
  #description: Subscribe to my blog by scanning my public wechat account.
```

##### 赞赏功能

在文章的末尾开启赞赏，不要忘记填写二维码所在路径。该功能实现后会有一个红色按钮，点击按钮则会弹出赞赏二维码。个人不太建议使用此处的动画效果，因为这里的「晃动」效果有些突兀。

```yml
# Reward (Donate)
reward_settings:
  # If true, reward would be displayed in every article by default.
  # You can show or hide reward in a specific article throuth `reward: true | false` in Front-matter.
  enable: false
  animation: false
  #comment: Donate comment here.

reward:
  #wechatpay: /images/wechatpay.png
  #alipay: /images/alipay.png
  #bitcoin: /images/bitcoin.png
```

##### 相关文章

在文章的末尾添加相关（推荐）文章。因为我使用的并不是这一款插件，而是 [hexo-recommended-posts](https://github.com/huiwang/hexo-recommended-posts)，关于该项功能的设置我并没有研究过，所以此处的具体设置请看[官方说明](https://github.com/tea3/hexo-related-popular-posts)。如果想要使用 hexo-recommended-posts 插件请看下文。

```yml
# Related popular posts
# Dependencies: https://github.com/tea3/hexo-related-popular-posts
related_posts:
  enable: false
  title: # Custom header, leave empty to use the default one
  display_in_home: false
  params:
    maxCount: 5
    #PPMixingRate: 0.0
    #isDate: false
    #isImage: false
    #isExcerpt: false
```

##### 在线编辑

因为 Hexo 博客并没有数据库，正常情况下无法在线编辑，这里的在线编辑功能需要借助 GitHub 与提供自动部署博客服务以实现持续集成的平台。这里我推荐使用 GitHub 与 Netlify 的组合。这里需要注意，如果你此前部署博客的时候，只是通过使用 `hexo deploy` 将生成的 `public` 文件夹中的内容上传到仓库，借助 GitHub Pages 实现博客生成的话，那么你就需要更改你的部署方式了。这里需要新建一个仓库，上传本地的博客文件夹，因为只有将你的原始 Markdown 文件上传至仓库，才可以在线编辑，生成的 HTML 文件编辑起来很困难。有关使用 Netlify 实现博客持续集成的方法请看我的这一篇[文章](/study/blog/deploy-blog-to-netlify/)。

```yml
# Post edit
# Dependencies: https://github.com/hexojs/hexo-deployer-git
post_edit:
  enable: true
  #url: https://github.com/user-name/repo-name/tree/branch-name/subdirectory-name # Link for view source
  url: https://github.com/guanqr/guanqr.com/edit/master/source/ # Link for fork & edit
```

该项功能的具体效果可以参考 [NexT 官方网站](https://theme-next.org/)，每一篇文章的右上角都有一个「笔头」图标，点击就会跳转到你的 GitHub 仓库的该篇文章的位置，实现在线编辑。

#### 个性页面配置

#### 第三方功能配置

## 网页样式布局

在对 NexT 主题的个性优化中，如果想要添加一些个性化的内容，就需要对内部代码进行修改。主题提供了许多注入点，可以通过注入点插入自己想要的东西，而不会对原有的主题内部文件进行大量的修改。这样便于以后主题的升级，避免一系列的错误发生。NexT 主题更新到 v7.2.0 后，简化了自定义内容的添加方法，删除了以前版本中所用的 `css/_custom.styl` 自定义 CSS 样式文件。如果想要修改样式或者在 HTML 中的 `<head>`、`<body>` 等部位插入代码。即直接在博客 `sourse` 资源文件夹下新建自定义文件 `_data/xxx` 实现该功能。

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

这 5 个分类是 `font-family` 的 5 个可用字体系列取值。也就是说，上述 5 个名字，代表的并非某个特定字体，而是一系列字体，这些通用的名称允许用户代理从相应集合中选择一款字体[^3]。

我们可以在博客主题文件夹下的 `~/source/css/_variables/base.styl` 文件中找到 NexT 主题的字体设定：

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

目前，电子显示屏上使用的字体普遍是无衬线体，比如黑体。在过去，因为屏幕技术的限制，想要在屏幕上展现出好看的衬线字角非常困难。如今高清显示屏的普及，在同质化的屏幕界面上使用衬线体为读者提供了另一种阅读选择。合适的衬线字体被引入到屏幕中，为单调的无衬线字体世界带来了新鲜的阅读体验。[^4]对于中文来说，宋体就是一种标准的衬线字体，衬线的特征非常明显。我们可以考虑将博客的中文默认字体更换为宋体，这样可以增强读者的阅读体验。

![hexo-theme-next-fonts-serif.jpg](/images/hexo-theme-next-fonts-serif.jpg "石碑与屏幕上的字体")

#### 方法一：直接使用本地字体

直接在上文提到的 `base.styl` 文件中修改默认字体即可，比如你想使用楷体，就在 `font-family-chinese` 的开头添加 `'STKaiti'`。最好不要删除主题默认的字体，而是直接在最前端添加字体，因为如果你的计算机中并没有这个字体，也能优先显示第二种字体，而不是显示最后的  `sans-serif`。不过这种设定方法的缺陷正是在这里，你设定的字体或许在你的计算机中安装了，但并不能保证在别人的计算机中安装了，所以就会出现你设定的字体在别人浏览你的博客的时候无法显示出来。目前 NexT 主题的代码默认字体（font-family-monospace）就存在这样的问题，你在 PC 端浏览博客，看到的代码区域字体为等宽字体，但在手机端浏览，却只能显示无衬线字体。

#### 方法二：上传字体至博客目录

因为直接使用本地字体存在很大的缺陷，所以我们可以考虑上传自己想要的字体至博客中，这样，在别人浏览博客的时候，浏览器会优先加载并显示你上传的字体，而不是使用本地字体。这种方法最大的缺点就是中文字体的使用，因为中文字体不像英文那样只有 26 个字母，我们平时经常使用到的汉字有数千个，如果把这些汉字字体全部上传至博客中，占用的空间很大，加载速度也是一个问题。不过我们可以考虑使用这种方法来显示英文字体。

举个例子，比如你想使用 Linux Biolinum 字体。

[^5]![hexo-theme-next-fonts-linux-biolinum.png](/images/hexo-theme-next-fonts-linux-biolinum.png "Linux Biolinum 字体")

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

#### 方法三：使用 Google Fonts

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

首先将 `enable:` 的 `false` 改为 `true`，然后在 `host:` 后添加 Google Fonts API 地址：`fonts.googleapis.com`。考虑到国内的网络对 Google 的域名并不友好，建议将 `googleapis.com` 修改为烧饼博客提供的镜像 `loli.net`。

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

考虑到宋体的笔画要比黑体细，因此建议通过自定义 CSS 将字体的颜色加深，比如修改为 `#333`，以达到较好的阅读效果。

```css
/* 文件位置：~/source/_data/styles.styl */

.post-body {
    color: #333;
}
```

这种先在 `<head>` 中引入字体，再通过 CSS 设定字体显示部位的方式适用于各种网页的设计，不局限于 NexT 主题。另外，我在这里给出我的博客字体设定：

+ 中文字体：Noto Serif SC
+ 英文字体：EB Garamond
+ 标题字体：Cinzel Decorative
+ 代码字体：Source Code Pro


## 文章内容美化

## 结尾

[^1]: 图源：<https://github.com/theme-next/hexo-theme-next>。
[^2]: 官方网站的 News 中会对每一个发行版相对上一版本的修改进行说明，Docs 中有主题配置的详细说明。
[^3]: 参考：[前端开发你该知道的字体 font-family | fly63 前端网](http://www.fly63.com/article/detial/1114)。
[^4]: 参考：[衬线体的进化：从纸面到屏幕 | 方正字库](https://zhuanlan.zhihu.com/p/49470735)。
[^5]: 图源：<https://www.fontke.com/family/290108/>。