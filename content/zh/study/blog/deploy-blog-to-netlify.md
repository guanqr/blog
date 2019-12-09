+++
title = "博客通过 Netlify 实现持续集成"
date = "2019-10-05T00:04:30+08:00"
tags = ["netlify","hexo"]
series = ["Build-Up-Blog"]
dropCap = true
displayCopyright = true
gitinfo = true
+++

![deploy-blog-to-netlify-0.jpg](/images/deploy-blog-to-netlify-0.jpg)

一般在部署 Hexo 或 Hugo 博客的时候，需要将写好的 Markdown 文件通过命令转化为 HTML 文件，然后将生成的 `/public/` 文件夹部署到 GitHub Pages 上。这样的方法是比较简单的方法，我之前也是用的这种方法。但这样的部署方式有一个弊端：直接将生成的可以运行的实际代码（生产版）发布到 GitHub 上，而不是源码（开发版）。没有利用 GitHub 来对源码进行版本控制，这就不利于博客未来的维护、更新、开发，以及可能的开源开发。也就是说，如果你想要退回之前的某一版本是很困难的。有些博主似乎注意到了这样的问题，直接在 GitHub 上新建一个分支或者新建一个仓库来存放原始文件。这种方法需要你在每次部署的时候提交两次代码，很繁琐。

直到后来，我在浏览 Next 主题的官方文档网站的时候，发现他们并没有将网站部署在 Github Pages 上，而是部署到了 Netlify 上面，他们只将源码存放在了一个仓库中。当你需要修改某些文章内容的时候，直接在仓库中编辑 Markdown 文件，随后网站会自动更新修改的内容。显而易见，这是再好不过的办法，实现博客的持续集成（Continuous Integration，CI）和自动部署，节省了自己操作的时间。

## Netlify 简介

[Netlify](https://www.netlify.com/) 具有静态网站托管的功能，能够托管 GitHub，GitLab 等网站上的 Jekyll，Hexo，Hugo 等静态网站。 自带 CI、支持自定义页面重定向、自定义插入代码、打包和压缩 JS 和 CSS、压缩图片、处理图片、CMS 等等功能。Netlify 也支持自定义域名免费 HTTPS，且是通配符证书 + TLS 1.3，提供了完整的 DNS 服务，有自动的 [www](https://www.netlify.com/docs/custom-domains/#domain-redirects) 跳转，以及超简单的子域名配置界面。此外，Netlify 每月也有 [100GB](https://www.netlify.com/pricing/) 的流量，也自带了全球的 [CDN](https://www.netlify.com/blog/2016/04/15/make-your-site-faster-with-netlifys-intelligent-cdn/) 服务，还支持了 GitHub Pages 官方不支持的 [HTTP/2](https://www.netlify.com/blog/2015/10/20/netlify-news-no.-6/)、[IPv6](https://www.netlify.com/blog/2018/11/26/announcing-ipv6-support-on-the-netlify-application-delivery-network/) 。

![deploy-blog-to-netlify-1.jpg](/images/deploy-blog-to-netlify-1.jpg "通配符证书 + TLS 1.3")

对于访问速度这一问题，和在 Github Pages 部署相比，我感觉并没有什么太大的差异，毕竟二者的服务器都不在国内。不过我使用校园网，再加上 Service Worker 缓存，感觉访问的时候并没有什么卡顿。

## 部署方法

首先，需要在 GitHub 上新建一个仓库，仓库名任意，用来存放博客的源码，我使用的仓库名是 `guanqr.com`。

回到本地，可以看到在你的博客源码存放的文件夹根目录下，有一个 `.gitignore` 文件。这是你在安装 Hexo 的时候就已经存在的文件，作用是在你上传博客源码至仓库的时候，忽略上传某些特定的文件。在这个文件中，默认忽略上传的应该有：

```
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
```

这里面比较重要的就是 `/node_modules/` 和 `/public/` 这两个文件夹。前者存放的是你在执行 `hexo g` 的时候所需的全部工具插件，后者即是需要部署的文件夹。那么为什么不需要上传这两个文件夹内的文件呢？

对于 `/public/` 文件夹，由于 Netlify 会在线执行 `hexo g` 的命令，实现在线部署，所以不再需要它。对于 `/node_modules/` 文件夹，在你的博客源码存放的文件夹根目录下，还有一个 `package.json` 文件，每当你安装插件的时候，会执行一个命令：`npm install xxx --save`，这样就将该插件的信息存放在了 `package.json` 文件中。上传的时候就不需要将全部插件一同上传，节省了仓库的空间。而 Netlify 的持续集成服务会自动检查 `package.json` 的改动并在它的容器上安装或移除相应模块。

当然这里还需要说明一点，如果你在存放于 `/node_modules/` 的任何插件中修改了代码，由于 Netlify 读取的是 `package.json` 的信息，只会安装原插件的内容，并不知道你的修改内容，所以你需要将修改后的插件自行上传，然后再修改 `package.json` 中该插件的路径到你的仓库。由于我并没有遇到这种问题，这里便不再赘述，如有任何问题还请自行谷歌。

然后，进入你的主题文件夹中，这里面还有一个 `.gitignore` 文件，打开后，修改其内容为：

```
.DS_Store
.idea/
*.log
*.iml
yarn.lock
package-lock.json
node_modules/

# Ignore optional external libraries
!source/lib/*

# Track internal libraries & Ignore unused verdors files
!source/lib/font-awesome/less/
!source/lib/font-awesome/scss/
!source/lib/font-awesome/

!source/lib/anime.min.js

!source/lib/velocity/
```

这里原内容是禁止 `/lib/` 中你额外安装的库的上传以及 `/font-awesome/scss/` 和 `/font-awesome/less/` 的上传。因为我安装了 PJAX 和 pace 两个额外的库，需要跟随主题一起上传，所以在此修改了内容。在这里还需要注意的是，除了根目录，任何文件夹内都不能出现 `/.git/` 文件夹，这个文件夹是默认隐藏的，如果你将该文件夹上传，那么 GitHub 就会认为这个文件夹内的文件已经存在于其他的仓库中，你的这个文件夹就无法打开了。

修改完成后，就可以将博客的源码全部上传至刚才新建的仓库之中。

我还了解到其实主题文件夹也可不必上传，可以直接设定跟随原主题仓库的更新，即在根目录下添加 `.gitmodules` 文件，设定 `/themes/` 文件夹下的内容为子仓库，子仓库设定为 NexT 主题的仓库。即：

```
[submodule "themes/next"]
	path = themes/next
	url = https://github.com/theme-next/hexo-theme-next
```

但因为我在原主题的代码中作了部分修改，不便于这种操作，就没有使用这种方法。

现在 Github 仓库已经设置完成，接下来就是在 Netlify 上的操作。

首先是在 Netlify 上注册账号，推荐直接使用 GitHub 账号注册。

![deploy-blog-to-netlify-2.jpg](/images/deploy-blog-to-netlify-2.jpg "注册界面")

然后选择创建新的网站，选择要和 Netlify 相连的 GitHub 仓库，这里我要连的是我的博客仓库 `guanqr/guanqr.com`。

![deploy-blog-to-netlify-3.jpg](/images/deploy-blog-to-netlify-3.jpg "创建新网站")

![deploy-blog-to-netlify-4.jpg](/images/deploy-blog-to-netlify-4.jpg "选择仓库")

这里会让你设定部署的一些详细信息，Netlify 会识别到你使用的是 Hexo，一般默认即可。但这里需要注意一点，「Build command」中默认的命令是：

```
hexo generate
```

而我设定的命令是：

```
hexo clean && hexo generate && gulp build && gulp
```

因为我使用了 Gulp 进行了[静态资源的压缩](/posts/use-gulp-to-compress-source-code/)以及[实现 PWA 功能](/posts/realize-pwa/)，需要额外的命令。所以具体的命令内容需要根据自己的情况进行设定。

![deploy-blog-to-netlify-5.jpg](/images/deploy-blog-to-netlify-5.jpg "设定详细信息")

设定完成后，Netlify 就会对你的仓库进行第一次部署，如果出现部署错误，请根据提示内容进行修改。一般来说，如果本地浏览正常就不会出现错误。我第一次出现错误的原因就是，主题文件中的 `/lib/` 没有上传。

部署好之后，Netlify 会自动给你的网站分配一个域名。这个域名是随机生成的，可以进行更改，比如我的网站域名就改成了：<https://guanqr.netlify.com/>，当然最开始的时候没有 HTTPS。这时候，你就可以选择自己设定个性域名。在「Deploy setting」中的「Domain managment」添加你要设定的域名。然后根据自己域名的解析服务商那里将该域名解析到 Netlify 上。这里我设定的域名即：`www.guanqr.com`，需要将 `guanqr.com` A 记录解析到 `104.198.14.52`，再将 `www.guanqr.com` CNAME 记录解析到那个原有的域名 `guanqr.netlify.com` 中。具体的操作在你设定的时候会有提示。另外，Netlify 也提供了域名解析的服务，如果感兴趣的话可以自己进行尝试。

![deploy-blog-to-netlify-6.jpg](/images/deploy-blog-to-netlify-6.jpg "设定域名")

域名设定完成后，在该页面的末尾即为设定 HTTPS，Netlify 会免费为你的网站提供 HTTPS 证书。如果你自己已经购买过证书，也可设定添加。

![deploy-blog-to-netlify-7.jpg](/images/deploy-blog-to-netlify-7.jpg "设定 HTTPS")

这样，一个部署在 Netlify 上的具有持续集成功能的博客网站就完成了。

## 其他的一些操作

### 实时编辑

NexT 主题已经在主题配置文件中提供了在线编辑的功能。即：

```
post_edit:
  enable: true
  url: https://github.com/guanqr/guanqr.com/edit/master/source/
```

这是我的设定，`url` 后面填写的是你的仓库中存放文章的文件夹。设定完成后，可以看到在每一篇文章的右上角有一个「笔」的图标，点击后就可以跳转到你的仓库，进行实时编辑。

### 页面重定向

Netlify 提供了自定义页面重定向的功能。如果你的域名或者文章结构发生了变化，可以借助重定向功能，将原来的文章 URL 重定向到现在的地址。这时候就需要 Netlify 网站中所说的 `netlify.toml` 文件。

新建一个 `netlify.toml` 文件，存放在博客的根目录下。在里面添加以下内容：

```toml
[[redirects]]
  from = "https://原始域名/*"
  to = "https://自定义域名/:splat"
  force = true

# A redirect rule with all the supported properties
[[redirects]]
  from = "/old-path"
  to = "/new-path"
```

![deploy-blog-to-netlify-8.jpg](/images/deploy-blog-to-netlify-8.jpg "页面重定向")

## 参考

1. [File-based configuration | netlify docs](https://www.netlify.com/docs/netlify-toml-reference/)。
2. [Hexo + GitHub + Netlify 一站式搭建属于自己的博客网站 | 我在马路边](https://www.cnblogs.com/kerbside/p/10130606.html)。