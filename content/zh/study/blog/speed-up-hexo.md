+++
title = "加速 Hexo 博客的方法及遇到的问题"
date = "2019-08-20T12:33:10"
tags = ["hexo","next","pwa"]
series = ["create-a-blog"]
dropCap = true
displayCopyright = true
gitinfo = true
+++

![speed-up-hexo.png](/images/speed-up-hexo.png)

由于我的博客部署在 GitHub Pages 上面，在国内访问的话部分地区的加载速度比较慢。因此我在 6 月份的时候尝试使用 hexo-service-worker 与 hexo-filter-optimize 插件加速网站的访问速度。这两款插件确实对博客的加载速度有所帮助，但在当时我并没有留意是否出现了问题。直到最近，我在使用 Aplayer 音乐播放器的时候，一个很严重的 BUG 暴露了出来。通过对插件的逐个排查，终于找到了问题所在之处。

## 加速 Hexo 博客

我在网上找到的方法是使用 [InstantClick](https://github.com/dieulot/instantclick/) 和使用 Hexo 的两个插件 [hexo-service-worker](https://github.com/zoumiaojiang/hexo-service-worker)、[hexo-filter-optimize](https://github.com/theme-next/hexo-filter-optimize)。InstantClick 对网站的提速很明显，但它最大的问题就是会与 FancyBox、Google Analytics 等等不兼容，这些问题如果想解决的话肯定能解决的，网上应该可以找得到解决方法，但我目前没有太多精力去折腾。

<p id="div-warning">
InstantClick 使用的正是 pushState + Ajax 的技术，即 PJAX。最新版本的 NexT 主题已经支持 PJAX，因此你可以不再考虑使用 InstantClick。
</p>

下面主要说明如何配置 hexo-service-worker 和 hexo-filter-optimize 这两款插件。

### 插件的安装与配置

先在站点文件夹根目录安装：

```bash
npm install hexo-service-worker hexo-filter-optimize --save
```

然后在站点配置文件中配置：

```yml
# offline config passed to sw-precache.
service_worker:
  maximumFileSizeToCacheInBytes: 5242880
  staticFileGlobs:
  - public/about/index.html
  - public/favicon.ico
  - public/manifest.json
  stripPrefix: public
  verbose: false
  runtimeCaching:
    - urlPattern: /**/*
      handler: cacheFirst
      options:
        origin: www.guanqr.com

filter_optimize:
  enable: true
  # remove static resource query string
  #   - like `?v=1.0.0`
  remove_query_string: true
  # remove the surrounding comments in each of the bundled files
  remove_comments: true
  css:
    enable: true
    # bundle loaded css file into the one
    bundle: true
    # use a script block to load css elements dynamically
    delivery: true
    # make specific css content inline into the html page
    #   - only support the full path
    #   - default is ['css/main.css']
    inlines:
    excludes:
  js:
    # bundle loaded js file into the one
    bundle: true
    excludes:
  # set the priority of this plugin,
  # lower means it will be executed first, default is 10
  priority: 12
```

### 配置说明

1. `staticFileGlobs` 是首次加载时主动缓存的文件，我给出的仅仅是个示例，请自行修改。怎么修改呢？ `hexo g` 之后去 `/public/` 目录下查看生成的文件，需要主动缓存则加上。当然，建议不要将博客的首页 `/public/index.html` 加上去，这样如果以后想去除或想更新为 [Workbox](https://developers.google.com/web/tools/workbox/) 才有可能，否则已访问过你的网站的用户可能永远都无法更新，除非他手动清除浏览器的缓存。需注意的是，如果不加上首页，可能会导致无法离线访问。

2. `origin` 修改为你的博客域名，更多说明请查看 GitHub 上的 README。

3. 要使用 Service Worker 博客必须 HTTPS。

## 将博客添加至桌面

既然已经使用了 Service Worker，具备了离线缓存功能，那么结合 `manifest.json` 文件即可让你的博客启用 PWA，将博客添加至手机主屏或计算机桌面。`manifest.json` 文件的结构很简单，可以通过[这个](https://app-manifest.firebaseapp.com/)网站在线生成。你也可以参考我的 `manifest.json` <a href="/manifest.json" target="_blank">内容</a>。

将 `manifest.json` 文件放到 `~/source/` 目录下，然后在你的博客 `<head>` 中引入该文件，如果你使用的是 NexT 主题 v7.2.0+ 版本，可以在主题配置文件 `_config.yml` 中引入自定义 `head.swig` 文件，在 `head.swig` 中添加：

```html
<link rel="manifest" href="/manifest.json">
```

如果不知道如何引入自定义文件的话，可以参考我的文章《[Hexo-NexT 主题个性优化](/study/blog/hexo-theme-next-customization/)》的「网页样式布局」部分。

部署完成后，在 Chrome 浏览器中按 `F12` 进入元素审查界面，选择进入 `Application` 一栏，即可看到你的 App Manifest 设定以及缓存文件的大小。

![speed-up-hexo-application.jpg](/images/speed-up-hexo-application.jpg)

然后，就可以将你的博客添加至桌面了。

![speed-up-hexo-add-to-desktop.jpg](/images/speed-up-hexo-add-to-desktop.jpg)

## 遇到的问题

在这两款插件中，hexo-service-worker 并没有什么问题，但是 hexo-filter-optimize 却能引起部分文件的引用路径错乱。

### Font Awesome 图标

这是最明显的问题，在你使用该插件后，就可以发现，你网站中所有使用 Font Awesome 图标的地方，图标都无法显示。目前该插件的 [Issues](https://github.com/theme-next/hexo-filter-optimize/issues/2) 中有很多人提出该问题，似乎作者也并没有给出一个完美的解决方案。我的解决方法是，选择使用 CDN 载入 Font Awesome 图标而不是使用本地的图标。

即在主题配置文件 `_config.yml` 中：

```diff
  # Internal version: 4.7.0
  # Example:
  # fontawesome: //cdn.jsdelivr.net/npm/font-awesome@4/css/font-awesome.min.css
  #fontawesome: //cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
- fontawesome:
+ fontawesome: //cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
```

### 文本居中引用标签

我在《[Hexo-NexT 主题个性优化](/study/blog/hexo-theme-next-customization/)》一文中所列举的「文本居中引用」中的样式：

<blockquote class="blockquote-center"><p>
人生乃是一面镜子，<br>
从镜子里认识自己，<br>
我要称之为头等大事，<br>
也只是我们追求的目的！
</p></blockquote>

上下边框的双引号，引用的是存放在 `~/themes/next/sourse/images/` 当中的 `quote-l.svg` 与 `quote-r.svg` 两个矢量图片，即在部署网页后，引用的是根目录的 `/sourse/images/` 中的图片。但在使用该插件后，图片引用的路径发生改变，引用的是你当前页面所在目录下的 `/sourse/images/` 中的图片，而不是根目录的。

我的解决方案是，在自定义 CSS 样式中添加：

```stylus
// 修复文字居中图片显示 BUG
.blockquote-center::before, .page-home .post-type-quote blockquote::before, .page-post-detail .post-type-quote blockquote::before {
    background-image: url(../../../../images/quote-l.svg);
}
.blockquote-center::after, .page-home .post-type-quote blockquote::after, .page-post-detail .post-type-quote blockquote::after {
    background-image: url(../../../../images/quote-r.svg);
}
```

改变图片引用路径即可。

![speed-up-hexo-change-url.jpg](/images/speed-up-hexo-change-url.jpg)

### Aplayer 音乐播放器

在这款音乐播放器的配置中：

```yml
aplayer:
  script_dir: js # Public 目录下脚本目录路径，默认: 'assets/js'
  style_dir: css # Public 目录下样式目录路径，默认: 'assets/css'
```

可以自行设定生成文件的存放目录。

如果你使用了该插件后，无论你如何配置存放目录，音乐播放器的样式都无法加载出来，因为 `Aplayer.min.css` 这一文件的引用路径是错误的。理论上来讲， 应该引用的是你在上述配置中设定目录下的文件，但实际上引用的依然是你在使用播放器时，当前页面目录下的文件。

目前我的解决方案有些繁琐，举个例子。

1. 首先 Aplayer 音乐播放器按照上述配置进行配置。

2. 比如你打算在 `about` 页面插入音乐播放器，那么除了在内容中按照 Aplayer 官方给定的格式插入音乐播放器后，还需要在当前文件夹，即 `~/sourse/about/` 下，创建 `css` 文件夹，在该文件夹中放置需要引用的 `Aplayer.min.css` 这一文件。这一文件在你第一次执行 `hexo g` 命令后，生成在 `~/public/css/` 下。

3. 此时还需要在博客配置文件 `_config.yml` 中设置，排除对 `aplayer.min.css` 文件的渲染。

```diff
-  skip_render: [README.md]
+  skip_render: [README.md,about/css/APlayer.min.css]
```

如果你觉得这样设置繁琐的话，也可以采用 CDN。不过，由于这个 BUG 引发了太多的问题，我目前已经放弃使用这款插件了。

## 参考

1. [加速 Hexo 博客 | reuixiy](https://io-oi.me/tech/speed-up-hexo/)。
2. [Hexo 博客简单支持 PWA | 木子星兮](https://juejin.im/post/5b8ff410e51d450e7b16d7ba)。
3. [Hexo 博客支持 PWA 和压缩博文 | Ryan Miao](https://blog.rmiao.top/hexo-grup-pwa/)。