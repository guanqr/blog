+++
title = "Hexo-NexT 主题个性优化"
date = "2019-05-04T00:00:39+08:00"
tags = ["git","hexo","next","typography"]
series = ["create-a-blog"]
aliases = ["/2019/05/04/hexo-next-1/","/2019/05/08/hexo-next-2/","/study/blog/hexo-theme-next-customization/"]
dropCap = false
toc = true
+++

[^1]![hexo-theme-next.png](/images/hexo-theme-next.png)

## 写在前面

从最初建立该博客到现在，我参考了许多使用 NexT 主题的博主们的文章，对 NexT.Muse 主题进行了一次又一次的优化与深层次的魔改。在此感谢这些分享自己建站教程的博主们。秉承着开源共享精神，我也将我在优化博客主题时使用到的方法分享出来。这些内容大都是我从互联网搜集汇总的优化方法，也有一小部分是我个人的修改。

在本文中，我将会全面讲解 Hexo 博客的搭建，NexT 主题的安装和配置，以及个性优化的内容。本文文章篇幅较长，为了方便阅读，在开头添加了文章目录，目录与各段落标题之间相互链接，可双向跳转。

<p class="note-warning">
注意：目前我的博客已经从 Hexo 迁移到了 Hugo，因此我并没有过多地关注 NexT 主题在 2019 年 11 月后的更新内容。文中所讲的一些东西，可能随着 NexT 主题的更新，成为主题自带的一部分，或被主题抛弃；也可能自身就存在一定的错误，因此本文的内容仅供参考。如果在搭建博客的过程中遇到问题，请参考<a href="https://theme-next.org/" target="_blank">官方文档</a>的相关说明或者在<a href="https://github.com/theme-next/hexo-theme-next" target="_blank">主题仓库</a>提交 Issues。另外，我也希望各位读者能及时指出本文出现的问题，让文章能够更加完善，紧跟主题更新的步伐。
</p>

## 搭建 Hexo 博客

目前网上已经有很多关于如何搭建 Hexo 博客的教程了，所以此处我只进行概述，诸如博客和主题的更新方法等问题请自行谷歌搜索。

### 在本地安装 Hexo

请直接参考 [Hexo 官方文档](https://hexo.io/zh-cn/docs/)。安装好 Hexo 后，先任意目录新建个文件夹，然后进入这个文件夹，输入命令初始化博客文件夹：

```
hexo init
```
等待构建完毕，如果出现橙色的 WARN 没关系，只要不出现红色的 ERROR 就行。然后输入命令：

```
hexo g && hexo s
```

点开 <http://localhost:4000/>，如果显示出一个简陋的博客页面，恭喜你！已经在本地搭建好博客了，下面要做的就是部署博客还有挑选一个好看的主题。

### 博客的部署方式

#### GitHub Pages

GitHub Pages 是开源协作社区 GitHub 的一个服务，免费，方便，可以自定义域名，支持 HTTPS，但仓库大小限制为 1GB，一个月 100GB 流量。

首先在 GitHub 上创建一个仓库，仓库名为 `username.github.io`。`username` 为你的 GitHub 账号用户名。这里要注意，仓库名必须按照这样的格式进行填写。

将 Hexo 部署到 GitHub Pages 需要借助一个插件：hexo-deployer-git，进入博客文件夹根目录下，进行插件的安装：

```
npm install hexo-deployer-git --save
```

然后，在站点配置文件 `_config.yml` 中编辑：

```yaml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
-  type:
+  type: git
+  repository: https://github.com/username/username.github.io.git
+  branch: master
```
`repository` 即为你之前创建的仓库地址。将其中的 `username` 改成你的 GitHub 用户名即可，然后执行下面的命令：

```
hexo clean && hexo g && hexo d
```

之后可能需要输入你的 GitHub 的用户名和密码，按照提示进行操作，完成后打开浏览器，输入你的博客网站：`username.github.io`，即可访问博客。如果想要开启 HTTPS，则进入仓库的设置页面的 GitHub Pages 设定项，开启「Enforce HTTPS」。

![github-pages-enforce-https.png](/images/github-pages-enforce-https.png)

如果你想要自定义域名，那么首先需要在域名商中购买一个域名，再设置域名的，添加 A 记录到 GitHub 的 IP；再将你想要使用的（二级）域名添加 CNAME 记录到你的博客原地址 `username.github.io`；最后在博客文件夹下的 `source` 文件夹下新建一个 CNAME 文件，用记事本打开，在其中添加你要使用的域名，执行 `hexo clean && hexo g && hexo d` 将博客部署一次即可。

#### Netlify

除此之外，你也可以考虑通过 Netlify 实现博客的自动部署和持续集成，具体的做法请参考我的文章《[博客通过 Netlify 实现持续集成](/tech/website/deploy-blog-to-netlify/)》。

## 基本功能配置

博客的建立最关键的就是选择主题，NexT 主题是目前使用人数最多的 Hexo 博客主题。如果你想要尝试其他主题，可以去 Hexo Themes 慢慢找。对于在 GitHub 上 Star 较多的几个主题，我都有尝试过，对于这些主题的简要分析可以参考我的这一篇[文章](/tech/website/hexo-theme/)。最终我选择 NexT 的原因正是它简洁、功能齐全、更新维护速度快。

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
url: https://guanqr.com/
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

# Deployment
## Docs: https://hexo.io/docs/deployment.html
## Dependency: https://github.com/hexojs/hexo-deployer-git
## 设定执行 'hexo deploy' 命令后提交的代码仓库地址
deploy:
  type: git
  repo: https://github.com/guanqr/guanqr.github.io.git
  branch: master
```

### 主题配置文件

NexT 主题的配置文件内容有很多，因为该主题有很多扩展功能。在配置主题各项功能之前，我建议先阅读 [NexT 官方网站](https://theme-next.org/)[^2]的相关文档说明。主题配置文件内容过长，为了排版美观以及阅读方便，这里我只对一些关键配置和容易出现问题地方进行说明，一些我认为不太重要的配置就不再提及。不同版本之间的配置文件可能有微小变化，这里仅供参考。

#### 自定义配置

对应配置文件中的 `custom_file_path` 内容，如果你需要在网站的 `<head>`、`<body>` 等部位添加自己的代码，无需直接修改主题文件，NexT 主题拥有多样自由的注入功能，这一部分的说明参见下一章节「[网页样式布局](#网页样式布局)」

#### 页脚信息

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

以 `home: / || home` 为例，第一个 `home` 为该目录选项的名称，此处可以先设置成英文，然后在 `~/themes/next/languages/zh-CN.yml` 下对应的 `menu:` 下添加对应的中文，格式为 `home: 首页`。`home:` 后填写的是该页面的文件夹位置，`/` 即为网站的根目录。`||` 后的 `home` 即为图标名称。

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

#### 文章元数据

文章元数据即每一篇文章标题下的写作时间、更新时间等信息。

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

#### 相关文章

在文章的末尾添加相关（推荐）文章。因为我使用的并非是 [hexo-related-popular-posts](https://github.com/tea3/hexo-related-popular-posts) 这一款插件，而是 [hexo-recommended-posts](https://github.com/huiwang/hexo-recommended-posts)，关于该项功能的设置我并没有研究过，所以此处的具体设置请看官方说明。如果想要使用 hexo-recommended-posts 插件请看[下文](#文末添加相关文章)。

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

#### 在线编辑

因为 Hexo 博客并没有后端数据库，正常情况下无法在线编辑，这里的在线编辑功能需要借助 GitHub 与提供自动部署博客服务以实现持续集成的平台，这里我推荐使用 GitHub 与 Netlify 的组合。即你只需要将你的博客文件夹上传至代码仓库（因为在线编辑功能编辑的是你的原始 Markdown 文件），不用自己执行 `hexo generate && hexo deploy` 命令，而是让 Netlify 帮助你进行自动部署。有关使用 Netlify 实现博客持续集成的方法请看我的这一篇[文章](/tech/website/deploy-blog-to-netlify/)。

```yml
# Post edit
# Dependencies: https://github.com/hexojs/hexo-deployer-git
post_edit:
  enable: true
  #url: https://github.com/user-name/repo-name/tree/branch-name/subdirectory-name # Link for view source
  url: https://github.com/guanqr/guanqr.com/edit/master/source/ # Link for fork & edit
```

该项功能的具体效果可以参考 [NexT 官方网站](https://theme-next.org/)，每一篇文章的右上角都有一个「笔头」图标，点击就会跳转到你的 GitHub 仓库的该篇文章的位置，实现在线编辑。

#### 标签页面

标签页面的标签云可以自己设定最大和最小的字号，以及颜色的过渡。这里我给出适合我的主题的配色方案：

```yml
# TagCloud settings for tags page.
tagcloud:
  # All values below are same as default, change them by yourself
  min: 12 # Minimun font size in px
  max: 30 # Maxium font size in px
  start: "#FF69B4" # Start color (hex, rgba, hsla or color keywords)
  end: "#8A2BE2" # End color (hex, rgba, hsla or color keywords)
  amount: 200 # Amount of tags, change it if you have more than 200 tags
```

#### 代码框主题

大部分人写博客文章的时候都会插入代码。选用一个适合自己风格的代码框主题必不可少。NexT 主题提供了多种风格的代码框供你选择。我个人推荐的是最简洁的 `normal` 亮色主题和 `night` 暗色主题。另外，你也可以设置是否启用「复制」按钮，「复制」按钮也可选择不同的风格。我推荐使用默认的 `default` 和 Mac 主题风格 `mac`。不过貌似 `mac` 风格对于一些 NexT 主题代码框特有样式支持地并不太完美，需要自己添加 CSS 样式。

```yml
codeblock:
  # Code Highlight theme
  # Available values: normal | night | night eighties | night blue | night bright | solarized | solarized dark | galactic
  # See: https://github.com/chriskempson/tomorrow-theme
  highlight_theme: normal
  # Add copy button on codeblock
  copy_button:
    enable: true
    # Show text copy result.
    show_result: true
    # Available values: default | flat | mac
    style: default
```

#### 数学公式

支持 MathJax 和 KaTeX 两种加载数学公式的方法，使用语法都是 LaTeX 语法。不过 MathJax 的功能比较全面，KaTeX 的加载速度比较快。不过有一点要注意，不论是用哪一个方式，我都推荐替换默认渲染器。

MathJax 使用 hexo-renderer-pandoc 或者 hexo-renderer-kramed；KaTeX 使用 hexo-renderer-markdown-it-plus 或者 hexo-renderer-markdown-it。

默认的 `per_page: true` 的意思是，只用当你在文章设定中添加 `mathjax: ture`，才会在当前页面中加载公式渲染。如果你使用的是 KaTeX，还要注意，过长的公式会超出页面边框，可能需要自行添加 CSS 样式对长公式进行滚动浏览。

```yml
# Math Formulas Render Support
math:
  enable: true

  # Default (true) will load mathjax / katex script on demand.
  # That is it only render those page which has `mathjax: true` in Front-matter.
  # If you set it to false, it will load mathjax / katex srcipt EVERY PAGE.
  per_page: true

  # hexo-renderer-pandoc (or hexo-renderer-kramed) required for full MathJax support.
  mathjax:
    enable: true
    # See: https://mhchem.github.io/MathJax-mhchem/
    mhchem: false

  # hexo-renderer-markdown-it-plus (or hexo-renderer-markdown-it with markdown-it-katex plugin) required for full Katex support.
  katex:
    enable: false
    # See: https://github.com/KaTeX/KaTeX/tree/master/contrib/copy-tex
    copy_tex: false
```

#### PJAX

该项功能的作用是：跳转到同网站另一个页面的时候，前后两个页面相同的元素不再重复加载，进而节省了加载的时间，加快访问速度。该项功能依赖官方提供的 [PJAX 插件](https://github.com/theme-next/theme-next-pjax)。开启 PJAX 后或多或少会出现出现浏览上的 BUG，特别是一些使用 JavaScript 的地方。我没有深入研究过该项功能的原理，所以也无法修复一些出现的 BUG。

```yml
# Easily enable fast Ajax navigation on your website.
# Dependencies: https://github.com/theme-next/theme-next-pjax
# For moreinformation: https://github.com/MoOx/pjax
pjax: true
```

#### 图片浏览

实现该功能的基础是在文章中[插入图片](#图片)。该项功能的效果是：点击文中插图，图片能够放大，有幻灯片的效果。目前 NexT 提供了两款插件 fancybox 和 mediumzoom，两款插件开启一个即可。两款插件的效果不同，各有各的特点，我推荐使用 mediumzoom。

```yml
# FancyBox is a tool that offers a nice and elegant way to add zooming functionality for images.
# For more information: https://fancyapps.com/fancybox
fancybox: false

# A JavaScript library for zooming images like Medium.
# Do not enable both `fancybox` and `mediumzoom`.
# For more information: https://github.com/francoischalifour/medium-zoom
mediumzoom: false
```

#### 评论系统

参见文章《[Hexo-NexT 主题添加评论系统](/tech/website/hexo-theme-next-comments/)》。

#### 访客统计

##### Leancloud

访客统计功能使用的也是 Leancloud。创建应用的过程与[上文](#valine) Valine 评论系统相同，只不过创建的 Class 名称要改为 Counter。这里有一个 [hexo-leancloud-counter-security](https://github.com/theme-next/hexo-leancloud-counter-security) 插件用来修复访客统计的一个漏洞，使访客统计更安全准确，因为我并没有使用该项功能，所以在此不再做详细说明。

```yml
# Show number of visitors to each article.
# You can visit https://leancloud.cn to get AppID and AppKey.
leancloud_visitors:
  enable: true
  app_id: # <app_id>
  app_key: # <app_key>
  # Dependencies: https://github.com/theme-next/hexo-leancloud-counter-security
  # If you don't care about security in leancloud counter and just want to use it directly
  # (without hexo-leancloud-counter-security plugin), set `security` to `false`.
  security: true
  betterPerformance: false
```

##### 不蒜子

![hexo-theme-next-busuanzi.png](/images/hexo-theme-next-busuanzi.png)

不蒜子的统计准确程度不如 Leancloud，不过它能够统计网站总访客量与访问量，显示在页脚。如果你使用了 Leancloud 统计文章访问量，那么 `post_views` 可以设定为 `false`。

```yml
# Show Views / Visitors of the website / page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi
busuanzi_count:
  enable: true
  total_visitors: true
  total_visitors_icon: user
  total_views: true
  total_views_icon: eye
  post_views: true
  post_views_icon: eye
```

## 网页样式布局

在对 NexT 主题的个性优化中，如果想要添加一些个性化的内容，就需要对内部代码进行修改。主题提供了许多注入点，可以通过注入点插入自己想要的东西，而不会对原有的主题内部文件进行大量的修改。这样便于以后主题的升级，避免一系列的错误发生。NexT 主题更新到 v7.2.0 后，[PR #868](https://github.com/theme-next/hexo-theme-next/pull/868) 简化了自定义内容的添加方法，删除了以前版本中所用的 `css/_custom.styl` 自定义 CSS 样式文件。如果想要修改样式或者在 HTML 中的 `<head>`、`<body>` 等部位插入代码。即直接在博客 `sourse` 资源文件夹下新建自定义文件 `_data/xxx` 实现该功能。

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

除了 `custom_file_path`，NexT 主题还提供了更加灵活的自定义方式（`theme_inject`），更多可以阅读[文档](https://theme-next.org/docs/advanced-settings#Injects)。如果你需要在主题目录下自定义文件，可以尝试下载 [hexo-theme-plus](https://github.com/jiangtj/hexo-theme-plus) 插件，该插件会将你的自定义文件替换主题文件夹内的同目录同名文件。具体使用方法可以参考这篇[文章](https://www.dnocm.com/articles/beechnut/hexo-git-submodule/)。

目前网络中的大部分优化教程都是依据旧版主题进行设定的，因此，一些使用最新版本主题的读者根据旧版设定进行操作的话，可能会报错。为了体现本文的与时俱进，本文中采用的即为..新版的设定方式..，旧版的设定方式在这里不再提及，请采用旧版主题的读者参考过去版本的官方说明文档。

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

在这里附上我的 `styles.styl` 文件：[styles.zip](/uploads/styles.zip)。建议你不要完全复制我的样式，因为我已经从 Hexo 迁移到了 Hugo，对 NexT 主题的样式修改仅停留在了 `v7.4.1` 版本前后。有可能我的博客主题版本与你的不同，不同版本的主题之间有些元素的名称不同，直接使用我的代码可能会出现错误。一步一步耐心地边调试边修改才能达到最佳效果。

### 修改字体

参见文章《[网站字体优化方案](/tech/website/web-font-guide/)》

### 归档页面添加十二生肖

![add-chinese-zodiac-to-next-title.jpg](/images/add-chinese-zodiac-to-next-title.jpg)

在归档页面的年份后添加十二生肖的图案，具体样式可以参考我的[归档](/archives/)页面。

由于 NexT 主题的模板文件内容更新地很快，所以不同版本之间的配置可能不太一样，这里我提供最直接的修改方法，如果你对于主题的代码结构有深入研究的话，可以尝试自己优化一下这部分内容， 比如单独建立一个 `chinese-zodiac.swig` 的文件，再在主题文件中引入配置。

首先是在[这里](/uploads/chinese-zodiac.zip)下载十二生肖字体。下载后将解压的三个字体文件全部放在根目录 `~/source/fonts/` 下（若无 `fonts` 文件夹请自建）。

然后编辑主题中的 `post-collapse.swig` 文件，做如下修改：

```diff
# 文件位置~/themes/next/layout/_macro/post-collapse.swig

{%- if year !== current_year %}
  {%- set current_year = year %}
  <div class="collection-year">
-   <{%- if theme.seo %}h2{% else %}h1{%- endif %} class="collection-header">{{ current_year }}</{%- if theme.seo %}h2{% else %}h1{%- endif %}>
+   <{%- if theme.seo %}h2{% else %}h1{%- endif %} class="collection-header">{{ current_year }}
+     <div class="chinese-zodiac">
+       {%- if current_year % 12 == 0 %}
+         <i class="symbolic-animals icon-monkey"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 1 %}
+         <i class="symbolic-animals icon-rooster"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 2 %}
+         <i class="symbolic-animals icon-dog"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 3 %}
+         <i class="symbolic-animals icon-pig"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 4 %}
+         <i class="symbolic-animals icon-rat"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 5 %}
+         <i class="symbolic-animals icon-ox"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 6 %}
+         <i class="symbolic-animals icon-tiger"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 7 %}
+         <i class="symbolic-animals icon-rabbit"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 8 %}
+         <i class="symbolic-animals icon-dragon"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 9 %}
+         <i class="symbolic-animals icon-snake"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 10 %}
+         <i class="symbolic-animals icon-horse"></i>
+       {%- endif %}
+       {%- if current_year % 12 == 11 %}
+         <i class="symbolic-animals icon-goat"></i>
+       {%- endif %}
+     </div>
+   </{%- if theme.seo %}h2{% else %}h1{%- endif %}>
  </div>
{%- endif %}
```
最后再添加自定义样式到 `~/source/_data/styles.styl` 中：

```css
/* 文件位置：~/source/_data/styles.styl */

.chinese-zodiac {
    float: right;
}
@font-face {
  font-family: 'chinese-zodiac';
  font-display: swap;
  src: url('/fonts/chinese-zodiac.eot');
  src: url('/fonts/chinese-zodiac.eot') format('embedded-opentype'),
       url('/fonts/chinese-zodiac.woff2') format('woff2'),
       url('/fonts/chinese-zodiac.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}
.symbolic-animals {
  display: inline-block;
  font: normal normal normal 14px/1 chinese-zodiac;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-dragon:before { content: '\e806'; }
.icon-tiger:before { content: '\e809'; }
.icon-pig:before { content: '\e810'; }
.icon-horse:before { content: '\e813'; }
.icon-rat:before { content: '\e816'; }
.icon-goat:before { content: '\e818'; }
.icon-snake:before { content: '\e820'; }
.icon-ox:before { content: '\e822'; }
.icon-dog:before { content: '\e825'; }
.icon-rabbit:before { content: '\e826'; }
.icon-monkey:before { content: '\e829'; }
.icon-rooster:before { content: '\e82f'; }
```

### 添加球形标签云样式

![tag-cloud.gif](/images/tag-cloud.gif "标签云样式")

首先要确保你已经开启标签功能。目前有一个标签云插件可以提供这样的效果：[hexo-tag-cloud](<https://github.com/MikeCoder/hexo-tag-cloud>)。执行 `npm install hexo-tag-cloud --save` 进行安装。插件安装完成后，你可以自定义标签云的位置，比如显示在侧栏，或者显示在标签页面。比如选择显示在标签页面，则在 `~/themes/next/layout/page.swig` 中，添加如下所示代码：

```html
<!-- 文件位置：~/themes/next/layout/page.swig -->

{% if site.tags.length > 1 %}
<script type="text/javascript" charset="utf-8" src="{{ url_for('/js/tagcloud.js') }}"></script>
<script type="text/javascript" charset="utf-8" src="{{ url_for('/js/tagcanvas.js') }}"></script>
<div class="widget-wrap">
    <h3 class="widget-title">Tag Cloud</h3>
    <div id="myCanvasContainer" class="widget tagcloud">
        <canvas width="250" height="250" id="resCanvas" style="width=100%">
            {{ list_tags() }}
        </canvas>
    </div>
</div>
{% endif %}
```

最后，你可以选择在博客根目录配置文件 `_config.yml` 中添加如下的配置项进行更细致的设定:

```yaml
# hexo-tag-cloud
tag_cloud:
    textFont: Trebuchet MS, Helvetica
    textColor: '#333'
    textHeight: 25
    outlineColor: '#E2E1D1'
    maxSpeed: 0.5
```

### 添加线状动态背景

![dynamic-bg.gif](/images/dynamic-bg.gif "动画示例")

如果你对主题自带的动画效果不满意，也可以考虑这一种动画。

首先在 `~/themes/next/layout/_layout.swig` 文件中的 `<body>` 里添加：

```html
<!-- 文件位置：~/themes/next/layout/_layout.swig -->

<div class="bg_content">
  <canvas id="canvas"></canvas>
</div>
```

然后在该文件末尾添加：

```html
<!-- 文件位置：~/themes/next/layout/_layout.swig -->

<script type="text/javascript" src="/js/dynamic_bg.js"></script>
```

然后在[这里](/uploads/dynamic-bg.zip)下载 `dynamic_bg.js` 文件，将其解压到 `~/themes/next/source/js/` 中，该文件是背景动画脚本。最后再添加自定义样式：

```css
/* 文件位置：~/source/_data/styles.styl */

copy.bg_content {
  position: fixed;
  top: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
}
```

### 添加网站崩溃欺骗

访问别人博客的时候，发现有些博客的标题名称会发生变化，当你离开该博客访问其他网页的时候，标题会变成「页面崩溃」的警告，从而「迫使」你返回博客查看情况，实际上当然无事发生。

目前 NexT 主题提供了一个插件可以达到这种效果：[hexo-next-title](https://github.com/theme-next/hexo-next-title)。首先通过 `npm install theme-next/hexo-next-title --save` 安装该插件，然后在主题配置文件 `_config.yml` 中添加以下配置：

```yaml
# Change title and favicon when window is hidden and visible.
title_change:
  enable: false

  # Enabling this feature on non-desktop devices may not be a good choice, but it depends on you.
  onmobile: false

  # Enable random title or not.
  # Basically `random: true` means you have several titles to display and `random: false` means you have only one title to display.
  # When `random: true`, YOU MUST FOLLOW the format which has been commented in two title options below.
  # When `random: false`, please fill in the same line of the title option, like `title: one title`.
  random: false

  # Restore the original title after the specified time in milliseconds.
  timeout: 2019

  # Options when window is hidden.
  hidden:
    favicon: /images/favicon-32x32-next.png
    title:
      #- 404
      #- φ(*￣0￣)
      #- Waiting for you.

  # Options when window is visible.
  visible:
    favicon: /images/favicon-32x32-next.png
    title:
      #- 200
      #- (✿◡‿◡)
      #- Welcome back!
```

具体样式根据自己的喜好进行设定即可。

<p class="note-danger">
旧方法
</p>

首先在 `~/theme/next/source/js/` 文件夹下创建 `crash_cheat.js`，添加代码：

```javascript
/* 所在目录：~/theme/next/source/js/ */

/* 崩溃欺骗 */
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="icon"]').attr('href', "/img/TEP.ico");
        document.title = '╭(°A°`)╮ 页面崩溃啦 ~';
        clearTimeout(titleTime);
    }
    else {
        $('[rel="icon"]').attr('href', "/favicon.ico");
        document.title = '(ฅ>ω<*ฅ) 噫又好了~' + OriginTitle;
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});
```

然后在 `~/theme/next/layout/_layout.swig` 文件的末尾添加引用：

```html
<!-- 文件位置：~/theme/next/layout/_layout.swig -->

<script type="text/javascript" src="/js/crash_cheat.js"></script>
```

### 添加点击爱心特效

首先在 `~/themes/next/source/js/` 下新建文件 `clicklove.js`，接着把以下的代码拷贝粘贴到该文件中：

```javascript
/* 所在目录：~/themes/next/source/js/ */

!function(e,t,a){function n(){c(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"),o(),r()}function r(){for(var e=0;e<d.length;e++)d[e].alpha<=0?(t.body.removeChild(d[e].el),d.splice(e,1)):(d[e].y--,d[e].scale+=.004,d[e].alpha-=.013,d[e].el.style.cssText="left:"+d[e].x+"px;top:"+d[e].y+"px;opacity:"+d[e].alpha+";transform:scale("+d[e].scale+","+d[e].scale+") rotate(45deg);background:"+d[e].color+";z-index:99999");requestAnimationFrame(r)}function o(){var t="function"==typeof e.onclick&&e.onclick;e.onclick=function(e){t&&t(),i(e)}}function i(e){var a=t.createElement("div");a.className="heart",d.push({el:a,x:e.clientX-5,y:e.clientY-5,scale:1,alpha:1,color:s()}),t.body.appendChild(a)}function c(e){var a=t.createElement("style");a.type="text/css";try{a.appendChild(t.createTextNode(e))}catch(t){a.styleSheet.cssText=e}t.getElementsByTagName("head")[0].appendChild(a)}function s(){return"rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"}var d=[];e.requestAnimationFrame=function(){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)}}(),n()}(window,document);
```

然后在 `~/theme/next/layout/_layout.swig` 文件的末尾添加引用：

```html
<!-- 文件位置：~/theme/next/layout/_layout.swig -->

<script type="text/javascript" src="/js/clicklove.js"></script>
```

### 添加评论输入特效

首先在[这里](/uploads/activate-power-mode.zip)脚本，解压文件至 `~/themes/next/source/js/` 文件夹中。然后在 `~/themes/next/layout/_layout.swig` 的末尾添加：

```html
<!-- 文件位置：~/themes/next/layout/_layout.swig -->

<script src="/js/activate-power-mode.js"></script>
<script>
  POWERMODE.colorful = true;
  POWERMODE.shake = false; 
  document.body.addEventListener('input', POWERMODE);
</script>
```
其中：

```
POWERMODE.colorful = true;  // 控制开启 / 开启礼花特效  
POWERMODE.shake = false;  // 控制开启 / 关闭屏幕震动特效
```

### 添加页脚微信订阅

主题默认的微信订阅功能显示在文章的末尾，个人感觉有些难看，所以我并没有使用主题提供的微信订阅功能，而是将微信订阅的二维码放在了页脚。因为看到很多网站都是在页脚有个微信的 LOGO，鼠标移动到上面便会显示二维码，这样感觉很棒。

首先需要在 `~/sourse/_data/footer.swig` 中添加以下代码：

```html
<!-- 文件位置：~/sourse/_data/footer.swig -->

<div class="weixin-box">
  <div class="weixin-menu">
    <div class="weixin-hover">
      <div class="weixin-description">微信扫一扫，订阅本博客</div>
    </div>
  </div>
</div>
```

然后添加自定义样式：

```css
/* 文件位置：~/sourse/_data/styles.styl */

/* 自定义的页脚微信订阅号样式 */
.weixin-box {
    position: absolute;
    bottom: 43px;
    left: 10px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
}
.weixin-menu {
    position: relative;
    height: 24px;
    width: 24px;
    cursor: pointer;
    background: url(https://微信的 logo.svg);
    background-size: 24px 24px;
}
.weixin-hover {
    position: absolute;
    bottom: 0px;
    left: 0px;
    height: 0px;
    width: 0px;
    border-radius: 3px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
    background: url(https://二维码.svg);
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: 150px 150px;
    transition: all 0.35s ease-in-out;
    z-index: 1024;
    opacity: 0;
}
.weixin-menu:hover .weixin-hover {
    bottom: 24px;
    left: 24px;
    height: 170px;
    width: 150px;
    opacity: 1;
}
.weixin-description {
    opacity: 0;
    position: absolute;
    bottom: 3%;
    left: 5%;
    right: 5%;
    font-size: 12px;
    transition: all 0.35s cubic-bezier(1, 0, 0, 1);
}
.weixin-menu:hover .weixin-description {
    opacity: 1;
}
```

替换其中的链接为图片存放地址。图片务必用矢量图 SVG 格式，否则手机上显示效果很差，其它内容请根据自己的情况更改。微信 LOGO 图片（SVG 格式）代码如下：

```html
<svg xmlns="http://www.w3.org/2000/svg" width="2500" height="2500" viewBox="0 0 300 300"><path fill="#2DC100" d="M300 255c0 24.854-20.147 45-45 45H45c-24.854 0-45-20.146-45-45V45C0 20.147 20.147 0 45 0h210c24.853 0 45 20.147 45 45v210z"/><g fill="#FFF"><path d="M200.803 111.88c-24.213 1.265-45.268 8.605-62.362 25.188-17.271 16.754-25.155 37.284-23 62.734-9.464-1.172-18.084-2.462-26.753-3.192-2.994-.252-6.547.106-9.083 1.537-8.418 4.75-16.488 10.113-26.053 16.092 1.755-7.938 2.891-14.889 4.902-21.575 1.479-4.914.794-7.649-3.733-10.849-29.066-20.521-41.318-51.232-32.149-82.85 8.483-29.25 29.315-46.989 57.621-56.236 38.635-12.62 82.054.253 105.547 30.927 8.485 11.08 13.688 23.516 15.063 38.224zm-111.437-9.852c.223-5.783-4.788-10.993-10.74-11.167-6.094-.179-11.106 4.478-11.284 10.483-.18 6.086 4.475 10.963 10.613 11.119 6.085.154 11.186-4.509 11.411-10.435zm58.141-11.171c-5.974.11-11.022 5.198-10.916 11.004.109 6.018 5.061 10.726 11.204 10.652 6.159-.074 10.83-4.832 10.772-10.977-.051-6.032-4.981-10.79-11.06-10.679z"/><path d="M255.201 262.83c-7.667-3.414-14.7-8.536-22.188-9.318-7.459-.779-15.3 3.524-23.104 4.322-23.771 2.432-45.067-4.193-62.627-20.432-33.397-30.89-28.625-78.254 10.014-103.568 34.341-22.498 84.704-14.998 108.916 16.219 21.129 27.24 18.646 63.4-7.148 86.284-7.464 6.623-10.15 12.073-5.361 20.804.884 1.612.985 3.653 1.498 5.689zm-87.274-84.499c4.881.005 8.9-3.815 9.085-8.636.195-5.104-3.91-9.385-9.021-9.406-5.06-.023-9.299 4.318-9.123 9.346.166 4.804 4.213 8.69 9.059 8.696zm56.261-18.022c-4.736-.033-8.76 3.844-8.953 8.629-.205 5.117 3.772 9.319 8.836 9.332 4.898.016 8.768-3.688 8.946-8.562.19-5.129-3.789-9.364-8.829-9.399z"/></g></svg>
```

微信订阅号的二维码可以通过这个[网站](https://cli.im/weixin)进行转换，下载 SVG 格式的就可以了。

### 添加阿里图标支持

因为 NexT 主题是采用了 Font Awesome 图标，且版本较为落后，并未包含如知乎、豆瓣这类中国大陆的社交网站图标。所以需要加入另一种图标的支持，使得博客可以显示出自定义的图标。当然你也可以在 Font Awesome 的 GitHub 项目中提交你想要的图标的请求 Issues，等待官方的更新。

首先，前往[阿里巴巴矢量库](http://www.iconfont.cn/)挑选需要的图标，在图标上点击加入 <i class="fa fa-shopping-cart"></i> 购物车。然后，进入个人购物车，选择你挑选的图标，下方会有一个「下载代码」的选项，将代码下载下来。将下载的文件解压后，找到 `iconfont.css` 文件，打开后将其中的所有内容都复制加入到主题 CSS 自定义文件中的任意位置。这里需要修改部分内容，使得图标样式可以和主题样式保持一致。在这样设置好以后，就可以在博客需要额外图标的地方使用 `<i class="iconfont icon-xxx"></i>` 的进行引用了。但是这里有一个问题，如果想在侧边栏的社交网站列表里加入知乎、豆瓣这类图标，就不是这样引用了。因为主题配置文件中，对侧边栏的社交网站图标的引用省略了 `class` 的部分内容，将其加入到了 `layout` 的模版里，所以现在不能直接填写 `zhihu` 或者 `icon-zhihu` 到主题配置文件中，所以我们需要重新设置一下自定义样式。

因为阿里巴巴矢量库里有多个知乎、豆瓣的图标，大小不一，即使设置了字体大小页可能无法和原始图像大小一致，在主题 CSS 自定义文件中可以直接加入以下内容使图标显示一致：

```css
/* 文件位置：~/source/_data/styles.styl */

/* 知乎豆瓣图标 font-class引用 */
@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1528847148903'); /* IE9*/
  src: url('iconfont.eot?t=1528847148903#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAAYUAAsAAAAACIgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADMAAABCsP6z7U9TLzIAAAE8AAAARAAAAFZW7kimY21hcAAAAYAAAABmAAABnM+nbGdnbHlmAAAB6AAAAigAAAJIGJn6FGhlYWQAAAQQAAAALwAAADYRrDxZaGhlYQAABEAAAAAcAAAAJAfeA4VobXR4AAAEXAAAABAAAAAQD+kAAGxvY2EAAARsAAAACgAAAAoBmgDsbWF4cAAABHgAAAAfAAAAIAETAF1uYW1lAAAEmAAAAUUAAAJtPlT+fXBvc3QAAAXgAAAAMQAAAEIxfhjKeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2Bk/sU4gYGVgYOpk+kMAwNDP4RmfM1gxMjBwMDEwMrMgBUEpLmmMDgwVDzbxdzwv4EhhrmBoQEozAiSAwAx0A0oeJzFkNEJwCAMRC/GFikdpZ+lOE+/OoKzOVDWsEn0xwk8eTE5DiIC2ACwcikRoA8E06suuc843I94dE56gt5FstTWps5EnkjesSVpxzLRutWzTq/3mOy/y0CfKLljvtQOwg+NwxM7AAB4nB3PzWvTcBjA8d/z+zVJX5MmaV6aNk2T2KZbu9Y1bWqna1mVwqas9QVlB6F1Igi+4GkwBu6gIOhh1wq+IMIEbx487aCC4MF/wKO6g568emk03cP38PBcHj6IQujfd3JAVCSiElpEZ9AQIaDLYLFYB9NpVHEZJJOSlBRLHNsxGduqkmVQLDol171GUaEZmgMWcuCadc+pYgeajQ4+CXVZB0hntItCISuQPYiqTu6hv4ZfgWTYWa6z4K9Wuql6XgxvxQUhLQhPwjRFhTEOcSzcVuQIFYnS/muK06QDYw4bEE872rmNRD4jjB817ugFJQKwuwtiJs/ud3mND9rRZFFIM8lEWNUS9rEUbB3GVDGuF3+iYEhg/Uw+kC46hU6jtcDpVqEMXhfcRtExO9AqHmForxXsriIzNguSywITRMuzY5DSgRowXkvkXaXl8sRmHJt3YfQRC3if4NALOuH/ApmnLqQVVcfZWLzNXcEY3oncV0bm5M5lgucXzueSucQbzMZ25gXqd1/ffro63FTTh7BuFVZWxtQSFdqwQsbw0uJSJESRcnt7PZNs4spVo3KtDzGCS+382dIn3K08Nroe3J9uDof42fRtr4ejM2voCLxHZmoRKUhHSDQlE7yW4/Im7zKyYktmE5qmBIGdZh7gv9Mwtmrl5XvTl7eWj1f+kPx0Au/9b7U2XC/1CBpMn/dHc3DC/1LqjwcDyE0m/o+7oxs3g0//AcOlaXN4nGNgZGBgAGI3hpVx8fw2Xxm4WRhA4LpbjQ6C/n+UhYHZHsjlYGACiQIA9CsInAB4nGNgZGBgbvjfwBDDwgACQJKRARWwAABHCgJtBAAAAAPpAAAEAAAABAAAAAAAAAAAdgDsASQAAHicY2BkYGBgYQhkYGUAASYg5gJCBob/YD4DABESAXEAeJxlj01OwzAQhV/6B6QSqqhgh+QFYgEo/RGrblhUavdddN+mTpsqiSPHrdQDcB6OwAk4AtyAO/BIJ5s2lsffvHljTwDc4Acejt8t95E9XDI7cg0XuBeuU38QbpBfhJto41W4Rf1N2MczpsJtdGF5g9e4YvaEd2EPHXwI13CNT+E69S/hBvlbuIk7/Aq30PHqwj7mXle4jUcv9sdWL5xeqeVBxaHJIpM5v4KZXu+Sha3S6pxrW8QmU4OgX0lTnWlb3VPs10PnIhVZk6oJqzpJjMqt2erQBRvn8lGvF4kehCblWGP+tsYCjnEFhSUOjDFCGGSIyujoO1Vm9K+xQ8Jee1Y9zed0WxTU/3OFAQL0z1xTurLSeTpPgT1fG1J1dCtuy56UNJFezUkSskJe1rZUQuoBNmVXjhF6XNGJPyhnSP8ACVpuyAAAAHicY2BigAAuBuyAhZGJkZmRhZGVgbGCtSojM6OUpzgjsShVNyW/NCkxj4EBAF/8B44AAAA=') format('woff'),
  url('iconfont.ttf?t=1528847148903') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('iconfont.svg?t=1528847148903#iconfont') format('svg'); /* iOS 4.1- */
}
/* 以上是下载来自阿里巴巴矢量库的图标数据 */
/* 以下代码相对下载下来的代码做了部分修改 */
.fa-custom {
  font-family:"iconfont" !important;
  font-size:inherit;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.zhihu:before { content: "\e6ba"; }
.douban:before { content: "\e638"; }
```

举个例子，在主题配置文件中，社交账号图标设置好以后，类似是以下这样的格式：

```yaml
social:
  Twitter: https://twitter.com/user_id || twitter
  GitHub: https://github.com/user_id || github
  Zhihu: https://www.zhihu.com/people/user_id || custom zhihu
  Douban: https://www.douban.com/people/user_id/ || custom douban
```

### 添加友情链接页面

![blogroll-old-style.png](/images/blogroll-old-style.png)

NexT 主题自带的友情链接的位置是在侧栏的 Social Link 中，位置不太明显，而且容量比较小，不美观。因此可以自定义一个特定的页面，单独显示友情链接[^3]。

首先，在 `~/themes/next/layout/` 目录下新建一个 `links.swig` 文件，并写入以下内容：

```html
<!-- 所在目录：~/themes/next/layout/ -->

{% block content %}
  {######################}
  {###  LINKS BLOCK   ###}
  {######################}
  
    <div id="links">
        <style>
            .links-content{
                margin-top:1rem;
            }
            
            .link-navigation::after {
                content: " ";
                display: block;
                clear: both;
            }
            
            .card {
                width: 240px;
                font-size: 1rem;
                padding: 10px 20px;
                border-radius: 4px;
                transition-duration: 0.15s;
                margin-bottom: 1rem;
                display:flex;
            }
            @media (max-width: 767px) {
				.card:nth-child(odd) {
                    float: left;
                }
                .card:nth-child(even) {
                    float: left !important;
                }
			}
			
            .card:nth-child(odd) {
                float: left;
            }
            .card:nth-child(even) {
                float: right;
            }
            .card:hover {
                transform: scale(1.1);
                box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
            }
            .card a {
                border:none; 
            }
            .card .ava {
                width: 3rem!important;
                height: 3rem!important;
                margin:0!important;
                margin-right: 1em!important;
                border-radius:4px;
                
            }
            .card .card-header {
                font-style: italic;
                overflow: hidden;
                width: 100%;
            }
            .card .card-header a {
                font-style: normal;
                color: #2bbc8a;
                font-weight: bold;
                text-decoration: none;
            }
            .card .card-header a:hover {
                color: #a166ab;
                text-decoration: none;
            }
            .card .card-header .info {
                font-style:normal;
                color:#a3a3a3;
                font-size:14px;
                min-width: 0;
                overflow: hidden;
                white-space: nowrap;
            }

            span.focus-links {
                font-style: normal;
                margin-left: 10px;
                position: unset;
                left: 0;
                padding: 0 7px 0 5px;
                font-size: 11px;
                border-color: #42c02e;
                border-radius: 40px;
                line-height: 24px;
                height: 22px;
                color: #fff !important;
                background-color: #42c02e;
                display: inline-block;
            }
            span.focus-links:hover{
                background-color: #318024;
            }

            .friends-btn{
                text-align: center;
                color: #555!important;
                background-color: #fff;
                border-radius: 3px;
                font-size: 15px;
                box-shadow: inset 0 0 10px 0 rgba(0,0,0,.35);
                border: none!important;
                transition-property: unset;
                padding: 0 15px;
                margin: inherit;
            }

            .friends-btn:hover{
                color: rgb(255, 255, 255) !important;
                border-radius: 3px;
                font-size: 15px;
                box-shadow: inset 0px 0px 10px 0px rgba(0, 0, 0, 0.35);
                background-image: linear-gradient(90deg, #a166ab 0%, #ef4e7b 25%, #f37055 50%, #ef4e7b 75%, #a166ab 100%);
                margin: inherit;
            }
        </style>
        <div class="links-content">
            <div class="link-navigation">

                {% for link in theme.mylinks %}
                
                    <div class="card">
                        <img class="ava" src="{{ link.avatar }}"/>
                        <div class="card-header">
                        <div><a href="{{ link.site }}" target="_blank"> {{ link.nickname }}</a> <a href="{{ link.site }}"><span class="focus-links">关注</span></a></div>
                        <div class="info">{{ link.info }}</div>
                        </div>
                    </div>
                
                {% endfor %}

            </div>
            {{ page.content }}
            </div>
        </div>
  
  {##########################}
  {###   END LINKS BLOCK  ###}
  {##########################}
{% endblock %}
```
其中的样式可以根据个人喜好进行更改。

然后，修改 `~/themes/next/layout/page.swig` 文件，在如下所示位置处进行添加：

```diff
{% extends '_layout.swig' %}
{% import '_macro/sidebar.swig' as sidebar_template with context %}

  {% block title %}
    {%- set page_title_suffix = ' | ' + title %}

    {%- if page.type === 'categories' and not page.title %}
      {{- __('title.category') + page_title_suffix }}
    {%- elif page.type === 'tags' and not page.title %}
      {{- __('title.tag') + page_title_suffix }}
+   {%- elif page.type === 'links' and not page.title %}
+     {{- __('title.links') + page_title_suffix }}
    {%- elif page.type === 'schedule' and not page.title %}
      {{- __('title.schedule') + page_title_suffix }}
    {%- else %}
      {{- page.title + page_title_suffix }}
    {%- endif %}
  {% endblock %}

{% block content %}

  <div class="posts-expand">
    {##################}
    {### PAGE BLOCK ###}
    {##################}
    <div class="post-block" lang="{{ page.lang or page.language or config.language }}">
      {% include '_partials/page/page-header.swig' %}
      {#################}
      {### PAGE BODY ###}
      {#################}
      <div class="post-body{%- if page.direction and page.direction.toLowerCase() === 'rtl' %} rtl{%- endif %}">
        {%- if page.type === 'tags' %}
          <div class="tag-cloud">
            <div class="tag-cloud-title">
              {{ _p('counter.tag_cloud', site.tags.length) }}
            </div>
            <div class="tag-cloud-tags">
              {{ tagcloud({min_font: theme.tagcloud.min, max_font: theme.tagcloud.max, amount: theme.tagcloud.amount, color: true, start_color: theme.tagcloud.start, end_color: theme.tagcloud.end}) }}
            </div>
          </div>
        {% elif page.type === 'categories' %}
          <div class="category-all-page">
            <div class="category-all-title">
              {{ _p('counter.categories', site.categories.length) }}
            </div>
            <div class="category-all">
              {{ list_categories() }}
            </div>
          </div>
+       {% elif page.type === 'links' %}
+         {% include 'links.swig' %}
        {% elif page.type === 'schedule' %}
          <div class="event-list">
          </div>
          {% include '_scripts/pages/schedule.swig' %}
        {% else %}
          {{ page.content }}
        {%- endif %}
      </div>
      {#####################}
      {### END PAGE BODY ###}
      {#####################}
    </div>
    {% include '_partials/page/breadcrumb.swig' %}
    {######################}
    {### END PAGE BLOCK ###}
    {######################}
  </div>

{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(true) }}
{% endblock %}
```

接着创建一个新页面：

```sh
hexo new page "links"
```

这样在 `~/source/` 目录下会生成一个 `links` 文件夹，打开其中的 `index.md` 文件，在标题头中写入 `type = "links"` 这个属性头，如下：

```diff
title: 友情链接
date: 2019-09-29 13:08:43
+ type: "links"
```

如果要想在菜单栏中显示该页面的中文名称的话，不要忘记在语言配置 `zh-CN.yml` 文件中添加：

```diff
# 文件位置：~/themes/next/languages/zh-CN.yml

menu:
  home: 首页
  archives: 归档
  categories: 分类
  tags: 标签
  about: 关于
  search: 搜索
  schedule: 日程表
  sitemap: 站点地图
  commonweal: 公益404
+  links: 友链
```
最后，在主题配置文件 `~/themes/next/_config.yml` 文件中按照以下格式添加友链：

```yaml
# 友情链接
mylinks:
  - nickname: # 昵称
    avatar: # 头像地址
    site: #友链地址
    info: #相关说明
    
  - nickname: # 昵称
    avatar: # 头像地址
    site: #友链地址
    info: #相关说明
```

## 文章内容美化

### 主题自带样式

主题自带的一些标签功能如 Note、Tabs、Button 等在官方文档的 [Tag Plugins](https://theme-next.org/docs/tag-plugins/) 中有详细的说明。请仔细阅读官方文档进行配置与使用。由于目前本博客从 Hexo 迁移到了 Hugo，主题也不再是 NexT，因此主题部分自带功能的展示效果受到一定限制，这里不再进行详细说明和展示。

请注意，在你使用 Centered Quote 文本居中引用标签功能的时候，如果你使用了插件  [hexo-filter-optimize](https://github.com/theme-next/hexo-filter-optimize) 为博客加速，那么可能会对该功能的效果造成一定的影响，对该问题的具体分析可参见我的文章《[加速 Hexo 博客的方法及遇到的问题](/tech/website/speed-up-hexo/)》。

### 自定义样式

由于是自定义的样式，故要自己将 CSS 代码加到 `styles.styl` 中，下文的自定义样式都是如此。点击[这里](http://www.divcss5.com/rumen/r3.shtml)了解一些 CSS 中 `id` 和 `class` 的知识[^4]。

#### 引用样式

需加入 `styles.styl` 的代码：

```css
/* 文件位置：~/sourse/_data/styles.styl */

/* 自定义的引用样式 */
blockquote.question {
    color: #555;
    border-left: 4px solid rgb(16, 152, 173);
    background-color: rgb(227, 242, 253);
    margin-bottom: 20px;
}
```

- 文字颜色改 `color` 的值
- 背景色改 `background-color` 的值
- 边框颜色和粗细改 `border-left` 的值

效果：

<blockquote class="question">内容</blockquote>

源码：

```html
<blockquote class="question">内容</blockquote>
```

#### 数字块

需加入 `styles.styl` 的代码：

```css
/* 文件位置：~/sourse/_data/styles.styl */

/* 自定义的数字块 */
span#inline-toc {
    display: inline-block;
    border-radius: 80% 100% 90% 20%;
    background-color: rgb(227, 242, 253);
    color: #555;
    padding: 0.05em 0.4em;
    margin: 2px 5px 2px 0px;
    line-height: 1.5;
}
```

<span id="inline-toc">1.</span>左边是效果。

源码：

```html
<span id="inline-toc">1.</span>
```

### 插入图片

图片可以选择通过上传到图床再引入图床链接的方式载入，或者直接将图片存放在博客文件夹中载入。如果想将图片上传到图床，我不推荐使用一些免费的图床，因为这些图床可能不太稳定，图片很可能会挂掉，我推荐使用[阿里云储存对象 OSS 服务](https://www.aliyun.com/product/oss/)。如果选择直接将图片存放至博客文件夹中，我建议你在 `~/source/` 文件夹内新建一个 `images` 文件夹来存放图片，或者在每一篇文章存放的 `~/source/_posts` 文件夹下存放图片。

通过修改博客配置文件 `_config.yml`：

```yaml
post_asset_folder: true
```

将 `_config.yml` 文件中的配置项 `post_asset_folder` 设为 `true` 后，执行命令 `hexo new post_name`，在 `~/source/_posts/` 中会生成文章 `post_name.md` 和同名文件夹 `post_name`。将图片资源放在 `post_name` 中，文章就可以使用相对路径引用图片资源了。

图片载入的方式可直接使用 Markdown 的语法：

```markdown
![images](images.png)
```

在 `()` 内填写图片的路径，注意相对路径与绝对路径的问题。

如果你想要一次载入多个图片，NexT 官方也提供了特有的标签语句，请参考官方文档的[使用方法](https://theme-next.org/docs/tag-plugins/group-pictures)。

另外，有一个图片的插件：[hexo-asset-image](https://github.com/xcodebuild/hexo-asset-image)。很多 Hexo 博客搭建教程中都有推荐使用该插件载入图片，我认为根本没必要使用这个插件，更何况这个插件或多或少存在一些路径的问题。

在该插件的 v.1.0.0 版本中，如果你采用的是 `yourname.github.io` 域名，生成的 HTML 文件中图片引用地址为 `/.io//imagename.jpg/`；如果你设置为 `yourname.github.io/blog/` 这样的地址，生成的 HTML 文件中图片引用地址为 `/blog/blog/imagename.jpg/`。在该插件的 [Issues](https://github.com/xcodebuild/hexo-asset-image/issues/47) 中，有人提出问题的解决方案。打开博客文件夹下的 `node_modules/hexo-asset-image/index.js`，即该插件的安装位置，修改第 24 行代码，如下所示：

```diff
# 文件位置：~/node_modules/hexo-asset-image/index.js

else {
+	var endPos = link.length-1;
-	var endPos = link.lastIndexOf('.');
    }
```

对于图片的说明文字部分，正常情况下，不论你使用下面两种方式中的任何一种，图片下方都不会出现文字说明。

```markdown
![Alt text](/path/to/img.jpg)
![Alt text](/path/to/img.jpg "Optional title")
```

对于 Markdown 图片引用的代码，主要有三个部分：

1. `Alt text`，替代文本，图片无法显示时读者看到的就是它
2. `/path/to/img.jpg`，URL，即图片的链接
3. `Optional title`，图片的标题

添加的 `Optional title` 会变成图片的 title 属性，当你将鼠标停靠在图片上面，就会显示所写的内容，我们需要给图片添加的说明文自就可以利用这个属性。然而，对于这个属性，在电脑上还好，但在手机上就惨了，手机上哪来的鼠标啊？所以自己添加的说明文字在手机上根本不会显示的，而就算在电脑上，也需要另外的交互——鼠标停留——才会显示，不够直观。

如果你使用了 NexT 主题的[图片浏览功能](#图片浏览)中的 fancybox，则会在图片下方渲染出图片的说明文字。不过，如果你不想使用 fancybox，却也想渲染图片的说明文字，就必须对 Hexo 的渲染组件进行修改。

首先在你的博客站点根目录下打开 `node_modules` 文件夹，然后搜索 `marked` 文件夹，，进入该文件夹，编辑 `lib/marked.js` 文件：

```diff
# 文件位置：~/node_modules/marked/lib/marked.js

Renderer.prototype.image = function(href, title, text) {
- href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
- if (href === null) {
-   return text;
-}
+ if (this.options.baseUrl && !originIndependentUrl.test(href)) {
+   href = resolveUrl(this.options.baseUrl, href);
+ }
+ var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
-   out += ' title="' + title + '"';
+   out += '>' + '<i class="img-caption">' + '◎ ' + title + '</i';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};
```

上面将会删除 `title`，如果你不想，可以自行修改。然后，往 `styles.styl` 添加 CSS 样式：

```css
/* 文件位置：~/source/_data/styles.styl */

.img-caption {
    font-style: normal;
    margin: 0 0 .7em;
    font-size: 90%;
    color: #555;
    display: block;
    text-align: center;
    text-indent: 0;
    font-family: STKaiti, serif;
}
```

最终呈现的效果就和我的博客图片说明文字效果一样。

### 插入音乐

首先，你可以直接使用 HTML 的标签，比如：

<audio src="https://guanqr-com.oss-cn-hangzhou.aliyuncs.com/music/Simon%20And%20Garfunkel-The%20Sound%20Of%20Silence.mp3" style="max-height :100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" controls="controls" loop="loop" preload="meta">Your browser does not support the audio tag.</audio>

格式如下，其中 `music-url` 替换为你需要加载的音乐即可：

```html
<audio src="music-url" style="max-height :100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" controls="controls" loop="loop" preload="meta">Your browser does not support the audio tag.</audio>
```

当然，网易云音乐的外链很好用，不仅有可以单曲，还能有歌单。在网易云音乐的播放列表中有生成外链播放器，配置好样式直接复制代码插入文章即可。但是有一些音乐因为版权原因放不了，还有就是不完全支持 https，导致小绿锁不见了。要解决这些缺点，就需要安装插件。

这里推荐 [hexo-tag-aplayer](<https://github.com/MoePlayer/hexo-tag-aplayer>)，[APlayer](https://github.com/MoePlayer/APlayer) 播放器的 Hexo 标签插件。安装：

```
npm install hexo-tag-aplayer --save
```

载入标签格式如下：

```javascript
{% aplayer "歌曲名" "歌手名" "https://什么什么什么.mp3" "https://封面图.jpg" "lrc:https://歌词.lrc" %}
```

还可以支持歌单：

```javascript
{% aplayerlist %}
{
    "autoplay": false,
    "showlrc": 3,
    "mutex": true,
    "music": [
        {
            "title": "歌曲名",
            "author": "歌手名",
            "url": "https://什么什么什么.mp3",
            "pic": "https://封面图.jpg",
            "lrc": "https://歌词.lrc"
        },
        {
            "title": "歌曲名",
            "author": "歌手名",
            "url": "https://什么什么什么.mp3",
            "pic": "https://封面图.jpg",
            "lrc": "https://歌词.lrc"
        }
    ]
}
{% endaplayerlist %}
```

具体的参数设置可以参考该插件的 [README](https://web.archive.org/web/20190226111008/https://github.com/MoePlayer/hexo-tag-aplayer) 和这插件的 Aplayer 的[官方文档](https://web.archive.org/web/20190226111008/https://aplayer.js.org/)。

另外，该插件与 [hexo-filter-optimize](https://github.com/theme-next/hexo-filter-optimize) 插件共同使用会出现 BUG，对该问题的具体分析可参见我的文章《[加速 Hexo 博客的方法及遇到的问题](/tech/website/speed-up-hexo/)》。

### 插入视频

可以直接用 HTML 的标签，写法如下：

```html
<video poster="https://封面图.jpg" src="https://什么什么什么.mp4" style="max-height :100%; max-width: 100%; display: block; margin-left: auto; margin-right: auto;" controls="controls" loop="loop" preload="meta">Your browser does not support the video tag.</video>
```

如果想用插件的话，这里推荐 [hexo-tag-dplayer](<https://github.com/MoePlayer/hexo-tag-dplayer>)，和音乐播放器 Aplayer 属于同一系列插件，是 [Dplayer](<https://github.com/MoePlayer/DPlayer>) 播放器的 Hexo 标签插件，支持弹幕。

安装：

```
npm install hexo-tag-dplayer --save
```

在文章中的写法：

```javascript
{% dplayer "url=https://什么什么什么.mp4" "https://封面图.jpg" "api=https://api.prprpr.me/dplayer/" "id=" "loop=false" %}
```

要使用弹幕，必须有 `api` 和 `id` 两项。

### 插入脚注

Markdown 基本语法中并不包含脚注语法，但是脚注作为一种常见的文本格式，对于文字编辑工作者，特别是喜欢插入引文的人而言，有着很大的使用需求。所以 Multi-Markdown 在其扩充语法集中增添了脚注的语法。大部分的 Markdown 编辑器现在都采用了该语法来渲染脚注。但 Hexo 的默认渲染器是不支持脚注语法的。

为了实现脚注功能，可以通过替换默认渲染器或者安装插件。目前我了解到的有两款插件:

1. [hexo-footnotes](https://github.com/LouisBarranqueiro/hexo-footnotes)
2. [hexo-reference](https://github.com/quentin-chen/hexo-reference)

第一款插件已经停止维护，但亲测第一款还是可以用的。我之前使用的是第二款插件，这一款插件最大的特点是能够在做脚注的原文角标处弹出悬浮窗。但该插件存在一个小 BUG，在移动端或者屏幕较窄的情况下，悬浮窗会超出页面边界。

如果需要替换渲染器，可以替换为 [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it) 或者 [hexo-renderer-markdown-it-plus](https://github.com/CHENXCHEN/hexo-renderer-markdown-it-plus)。由于我一直使用的是默认渲染器，所以这里不再进行详细说明。

对于上述两款插件，根据喜好选择一款插件安装：

```
npm install hexo-footnotes --save
npm install hexo-reference --save
```

如果要添加脚注，使用格式如下：

```
这是我的博客[^1]。

[^1]: 地址：https://blog.guanqr.com。
```

### 插入动态图表

[ECharts](http://echarts.baidu.com/index.html)，一个纯 JavaScript 的图表库，可以流畅的运行在 PC 和移动设备上。ECharts 作为国产工具，在语言上对中文开发者有着天然的优势，官方文档对每一个细节、参数、配置都有详尽的说明，对于新手非常的友好。另外一个重要的方面，就是 ECharts 的图表颜值很高，默认的主题和配色可以呈现出优雅漂亮的图表[^5]。

Hexo 的 [ECharts 插件](https://github.com/kchen0x/hexo-tag-echarts3)是博主 [KChen](https://kchen.cc/) 根据周旅军的原型插件开发的。进入博客根目录安装插件：

```
npm install hexo-tag-echarts3 --save
```

在文章中使用 ECharts 时，格式为：

```javascript
{% echarts 400 '85%' %}
/* TODO option goes here */
{% endecharts %}
```

其中 `echarts` 是标签名，不需要更改，`400` 是图表容器的高度，`85%` 是图表容器的相对宽度。而在 `tag` 之间的部分，则是需要自己填充的图表数据了。

比如：

```javascript
{% echarts 400 '85%' %}
{
    title: {
        text: "某站点用户访问来源",
        subtext: "纯属虚构",
        x: "center"
    },
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: "vertical",
        x: "left",
        data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
    },
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: true
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    series: [
        {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
                {
                    value: 335,
                    name: "直接访问"
                },
                {
                    value: 310,
                    name: "邮件营销"
                },
                {
                    value: 234,
                    name: "联盟广告"
                },
                {
                    value: 135,
                    name: "视频广告"
                },
                {
                    value: 1548,
                    name: "搜索引擎"
                }
            ]
        }
    ]
}
{% endecharts %}
```

效果为：

![echarts-tushuo.gif](/images/echarts-tushuo.gif)

如果按照不能正确绘制图表，请照下面的指导修改一下 ECharts 的模板文件。用编辑器打开博客目录下 `~/node_modules/hexo-tag-echarts/echarts-template.html` 文件。作如下修改：

```html
<div id="<%- id %>" style="width: <%- width %>;height: <%- height %>px;margin: 0 auto"></div>
+ <script src="https://echarts.baidu.com/dist/echarts.common.min.js"></script>
<script type="text/javascript">
...
</script>
```

有一种很便捷的使用 ECharts 图表的方法。[百度·图说](https://tushuo.baidu.com/)是 ECharts 团队开发的另一款非常方便的工具，提供 UI 界面给你快速的绘制和定义图表，然后导出为代码、图片以及其他格式。

### 段落标题添加锚点

上文中提到的 [hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it) 渲染器可以实现标题的锚点功能。如果你使用的是该渲染器，那么，参考官方[说明](https://github.com/hexojs/hexo-renderer-markdown-it/wiki/Advanced-Configuration)可对锚点进行配置。在博客的配置文件 `_config.yml` 里对渲染器进行配置的代码中有：

```yaml
# Markdown-it config
markdown:
  anchors:
    level: 2
    collisionSuffix: 'v'
    permalink: true
    permalinkClass: header-anchor
    permalinkSymbol: ¶
```

这就是对锚点进行配置的内容。不过使用这种方法添加锚点最大的问题就是，在文章目录中每一章节标题前也会显示锚点的图案，这样显得比较难看，即：

```
1. ¶第一章
  1.1 ¶第一节
2. ¶第二章
```

在这里我推荐一个更好的插件，是 NexT 官方制作的一个锚点插件：[hexo-theme-next-anchor](https://github.com/theme-next/hexo-theme-next-anchor)。

如果你使用了 hexo-renderer-markdown-it，为了使插件之间不冲突，可以先设置好 hexo-renderer-markdown-it 的功能：

```diff
  anchors:
    level: 2
    collisionSuffix: 'v'
-   permalink: true
+   permalink: false
    permalinkClass: header-anchor
    permalinkSymbol: ¶
```

然后再安装该插件：

```
npm install hexo-theme-next-anchor
```

如果你使用的是 Hexo 默认渲染器 hexo-renderer-marked，则可忽略上述步骤。

然后在主题的配置文件 `_config.yml` 中添加：

```yml
anchor:
  enable: true
  color: '#0e83cd'
  position: right # If left, anchors will always be visible.
  margin: 7px 
  text: '#'
  icon:
    # If true, the `text` option will be ignored.
    enable: false 
    # By default, NexT has built-in FontAwesome support.
    # This option means `font-family: FontAwesome`, so DO Not change it.
    # Also you can choose ForkAwesome, but that's another story.
    font: FontAwesome
    content: \f0c1 # CSS content for FontAwesome & ForkAwesome.
```

根据自己的喜好进行设定即可。

### 文末添加相关文章

实现该功能的插件有两个：

| 插件                                                         | 说明                                                         | 特点                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [hexo-related-popular-posts](https://github.com/tea3/hexo-related-popular-posts) | 最新版本已集成，可以在主题配置文件`_config.yml`中配置。      | 可以利用 Google Analytics API 将高浏览量（热门）的文章按配置比例加入推荐列表。 |
| [hexo-recommended-posts](https://github.com/huiwang/hexo-recommended-posts) | 主题尚未集成，但插件本身支持自动显示，自定义位置请查看 README。 | 可以与其它博客相关联，不限于自己博客。                       |

我使用的是第二个插件，因此这里主要讲解第二个插件的设定方法。

进入博客根目录安装插件：

```
npm install hexo-recommended-posts --save
```

在编辑完新的文章之后，使用如下命令获取推荐列表

```
hexo recommend
```

如果你对默认显示的位置和样式不满意，可以进行自定义设定。在博客根目录的 `_config.yml` 添加：

```yaml
# 推荐文章
# Dependency: https://github.com/huiwang/hexo-recommended-posts
recommended_posts:
  server: https://api.truelaurel.com #后端推荐服务器地址
  timeoutInMillis: 10000 #服务时长，超过此时长，则使用离线推荐模式
  internalLinks: 5 #内部文章数量
  externalLinks: 0 #外部文章数量
  fixedNumber: true
  autoDisplay: false
  #自动在文章底部显示推荐文章
  #excludePattern: []
  #titleHtml: <div class="note primary"><p>相关文章</p></div> #自定义标题
```

在主题根目录的 `_config.yml` 添加：

```yaml
# Recommended posts
# Dependency: https://github.com/huiwang/hexo-recommended-posts
recommended_posts:
  enabled: true
```

在主题语言包中添加：

```diff 
# 文件位置：~/theme/next/languages/zh-CN.yml
  copyright:
    author: 本文作者
    link: 本文链接
    license_title: 版权声明
    license_content: "本博客所有文章除特别声明外，均采用 %s 许可协议。转载请注明出处！"
+ recommended_posts: 推荐文章
page:
  totally: 共有
  tags: 标签
```

然后在主题配置文件中开启 `post-body` 后的自定义文件，并在 `~/source/_data/` 下新建文件 `post-body-end.swig`：

```diff
custom_file_path:
- #postBodyEnd: source/_data/post-body-end.swig
+ postBodyEnd: source/_data/post-body-end.swig
```

在 `post-body-end.swig` 中添加：

```html
<!-- 文件位置：~/source/_data/post-body-end.swig -->

{% if theme.recommended_posts.enabled and not is_index %}
<div class="post-body">
  <div class="note primary">
    <div class="recommended_posts">
      {% set recommended_posts = recommended_posts(post, site) %}
      {% if recommended_posts.length > 0 %}
        <h4>{{ __('post.recommended_posts') }}</h4>
        <ul>
          {% for link in recommended_posts  %}
            <li><a href="{{ link.permalink }}">{{ link.title }}</a></li>
          {% endfor %}
        </ul>
      {% endif %} 
    </div> 
  </div>
</div>
{% endif %}
```

在该文件中修改自己喜欢的样式即可。

### 文末添加结束标语

同样需要在 `post-body-end.swig` 文件中添加内容，开启自定义文件的功能参考[上文](#文末添加相关文章)。

```html
<!-- 文件位置：~/source/_data/post-body-end.swig -->

<div>
    {% if not is_index %}
        <div class="end-slogan" style="text-align:center;font-size:13px;letter-spacing:10px;user-select:none;color:#bbb;"><br/>本文结束啦<i class="fa fa-star"></i>感谢您阅读<br/><br/></div>
    {% endif %}
</div> 
```

然后打开主题配置文件 `_config.yml`，添加：

```yaml
# 文章末尾添加“本文结束”标记
passage_end_tag:
  enabled: true
```

### 文末添加今日诗词

首先通过主题配置文件启用自定义文件：

```yaml
custom_file_path:
  postBodyEnd: source/_data/post-body-end.swig
  bodyEnd: source/_data/body-end.swig
  style: source/_data/styles.styl
```
最基础的设置参考官方说明文档：[通用简单安装代码](https://www.jinrishici.com/doc/#json-fast-easy)。首先在 `~/source/_data/body-end.swig` 文件内引入今日诗词的 SDK：

```html
<!-- 文件位置：~/source/_data/body-end.swig -->

<script src="https://sdk.jinrishici.com/v2/browser/jinrishici.js"></script>
```

然后在 `~/source/_data/post-body-end.swig` 文件内放入标签：

```html
<!-- 文件位置：~/source/_data/post-body-end.swig -->

<span id="jinrishici-sentence">正在加载今日诗词....</span>
```

简单使用的话不会显示作者、朝代等信息，参考官方说明文档：[通用高级安装代码](https://www.jinrishici.com/doc/#json-fast-custom)以及[接口返回结果格式](https://www.jinrishici.com/doc/#return)，值得注意的地方是这一句话：

> 使用定制加载时，不要将标签的 `id` 或者 `class` 设置为 `jinrishici-sentence`，否则 SDK 会自动加载一次。

也就是说插入的标签不应该使用之前的 `jinrishici-sentence`，需要重新命名。参考上一节配置的两个文件，把内容修改一下即可[^6]：

`body-end.swig`：

```html
<!-- 文件位置：~/source/_data/body-end.swig -->

<script src="//sdk.jinrishici.com/v2/browser/jinrishici.js"></script>
<script>
  console.log('今日诗词 - 开始加载...');
  jinrishici.load((result) => {
    let jrsc = document.getElementById('jrsc');
    if (jrsc) {
      console.log('今日诗词 - 标签获取成功.');
    } else {
      console.log('今日诗词 - 标签获取失败!');
      return;
    }
    const data = result.data;
    let author = data.origin.author;
    let title = '《' + data.origin.title + '》';
    let content = data.content.substr(0, data.content.length - 1);
    let dynasty = data.origin.dynasty.substr(0, data.origin.dynasty.length - 1);
    jrsc.innerText = content + ' @ ' + dynasty + '·' + author + title;
    console.log('今日诗词 - 载入完毕.');
    if (data.origin.author == '李白') {
      let audio = document.createElement("audio");
      audio.src = "/ding.mp3";
      audio.play();
    }
  });
</script>
```

`post-body-end.swig`：

```html
<!-- 文件位置：~/source/_data/post-body-end.swig -->

<div style="text-align: center"><span id="jrsc" >正在加载今日诗词....</span></div>
```

## 结尾

写这篇文章的初衷是为了记录我对博客主题的一些优化，通过对主题的优化我也学习了很多前端的知识。NexT 主题更新的速度实在是太快了，目前网上很多关于 NexT 主题的优化方法都是过时的。所以我就想借助这篇文章汇总一些可以在新版主题中使用的优化方法。另外，我还推荐你阅读我的其他几篇和博客搭建有关的文章，或许能够引发你对博客更深入的探索。如果你喜欢这一篇文章，请多多分享。

[^1]: 图源：[hexo-theme-next | GitHub](https://github.com/theme-next/hexo-theme-next)
[^2]: 官方网站的 News 中会对每一个发行版相对上一版本的修改进行说明，Docs 中有主题配置的详细说明。
[^3]: 参考：[Hexo 博客 NexT 主题自定义友情链接页面 | Sanarous](https://bestzuo.cn/posts/2016690040.html)
[^4]: 参考：[样式汇总 | 千灵](https://qianling.pw/style/)
[^5]: 参考：[在 Hexo 中插入 ECharts 动态图表 | KChen's Blog](https://kchen.cc/2016/11/05/echarts-in-hexo/)
[^6]: 参考：[NexT 添加今日诗词 | 1v9's Blog](https://1v9.io/post/add-today-poetry-for-theme-next.html)