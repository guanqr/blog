+++
title = "将博客持续集成地部署到 IPFS"
date = "2020-04-03T21:05:01+08:00"
tags = ["decentralization","hugo","meme","netlify"]
series = ["create-a-blog"]
aliases = ["/2019/10/12/host-blog-on-ipfs/"]
+++

[^1]![ipfs-gateway-header.png](/images/ipfs-gateway-header.png)

去年年末的时候，一些我关注的博主已经将博客部署到了 IPFS 上了。虽然目前诸如 IPFS 这样的分布式网路仍然有很长的路要走，HTTP 协议仍然是互联网的主流，但分布式网络是互联网的未来。作为一个爱折腾的人，本着任何新鲜事物都要尝试的心态，我当然也要尝试一下这种新鲜的操作，以实现去中心化信息存储。在本文中，我将简单讲述什么是 IPFS，我是如何借助 Cloudflare，Pinata，GitHub 和 Netlify 四个平台将个人博客持续集成地部署到 IPFS 上的，以及总结我在操作中遇到的一些问题。

## 前言

星际文件系统（ InterPlanetary File System，IPFS）属于分布式互联网（Distributed Web），本质上是一种内容可寻址、版本化、点对点超媒体的分布式存储、传输协议，目标是补充甚至取代目前普遍使用的超文本媒体传输协议（HTTP），希望构建更快、更安全、更自由的互联网时代。

在 IPFS 系统中，内容会分区块存放，并分散存储在 IPFS 网络中的节点上。系统会给内容的每一个块计算哈希值，然后把所有块的哈希值拼凑起来，再计算一次哈希值，从而得到最终的哈希值。同时每个节点会维护一张 DHT（分布式哈希表），包含数据块与目标节点的映射关系。IPFS 是通过哈希去请求文件的，它会使用这个分布式哈希表找到文件所在的节点，验证并取回文件，根据哈希重新组合文件。

本文中主要介绍的部署方式是借助于 Netlify 实现的持续集成部署，无需在你的计算机上安装 IPFS。对于原生的部署方式，我自己并没有全面地研究操作过，因此这里不再进行介绍。关于如何使用 Netlify 实现持续集成和自动部署，我在《[博客通过 Netlify 实现持续集成](/tech/website/deploy-blog-to-netlify/)》这篇文章中进行了详细的介绍，如有问题，可以直接参考这一篇文章，本文仅简单描述。这里需要注意的是，本文的内容适用于 Hugo 博客，你的计算机必须已经安装了 [Git](https://git-scm.com/downloads) 和 [Node.js](https://nodejs.org/zh-cn/download/)。如果你使用的是其他的博客框架，部分内容可能需要自行修改，请查阅其他相关文章。

## 准备环境

Netlify 可以通过加载指定的 GitHub 仓库文件，通过指定命令自动部署博客网站，因此你需要将你的博客文件夹初始化成一个 Git 仓库。输入以下命令即可： 

```sh
git init
```

接下来需要在博客文件夹根目录下创建 `.gitignore` 文件，告诉 Git 忽略上传一些无关的文件。具体内容如下，这里给出的文件内容仅供参考，因为不同的系统和不同的博客框架有不同的文件结构，请结合自己的情况进行修改。这里要重点关注一下 `.env` 文件，这是必须要添加进去的，原因在后文中会讲到。

```sh
# SSG 生成的文件所在目录
public

# Node.js
node_modules

# Hugo
resources

# Hexo
db.json
.deploy*
*.log

# macOS 系统
.DS_Store

# 老版本的 Windows 系统
Thumbs.db

# ipfs-deploy
.env
```

然后是 Node.js， 我们也要初始化博客所在的文件夹生成 `package.json` 文件，它的作用是告诉 Node.js 我们所需的模块。如果你的博客文件夹已经有该文件则可跳过这一步。通常情况下，已有的 `package.json` 文件内容信息并不完整。很有可能你的 `package.json` 文件中缺少 `description`、`main`、`scripts`、`repository`、`keywords`、`bugs`、`homepage` 这些信息。这里建议都添加进来，因为如果缺少部分信息，很可能在后面的操作中报错。输入以下命令即可进行初始化：

```sh
npm init
```

这样会出来一个交互界面，你需要填写相关的信息。如果你不需要这个交互界面，你可以直接执行 `npm init -y`，这样会将默认设置写入，然后你可以直接打开 `package.json` 文件编辑相关内容。如果你有不确定的地方，可以参考一下[本博客的该文件](https://github.com/guanqr/blog/blob/master/package.json)。

## 模块的安装与配置

接下来，我们要安装 [ipfs-deploy](https://github.com/ipfs-shipyard/ipfs-deploy) 模块，它是将博客部署到 IPFS 上的工具。输入以下命令安装： 

```sh
npm install ipfs-deploy --save-dev
```

安装结束后，如果你是在当前目录初次使用 `npm` 安装模块，那么你会发现多了一个 `node_modules` 文件夹和一个 `package-lock.json` 文件。关于文件夹，这就是你安装的模块所在的目录；关于文件，这是自动生成的该模块及其依赖的详细版本信息。同时，你会发现 `package.json` 文件多了几行，它的作用是告诉 Node.js 我们所需的模块，在这里的话也就是 `ipfs-deploy`：

```json
{
    "devDependencies": {
        "ipfs-deploy": "^7.14.0",
  }
}
```

我们在之前的步骤中将 `node_modules` 文件夹添加到了 `.gitignore` 列表，也就是说，我们上传博客文件夹到 GtiHub 仓库的时候，并不会上传 `node_modules` 文件夹。一是因为该文件夹包含了很多文件，上传速度很慢，二是因为 Netlify 会通过识别 `package.json` 文件重新安装所需模块，所以不必将该文件夹上传。

然后修改 `package.json` 文件，在 `scripts` 内添加两条命令： 

```json
{
    "scripts": {
        "build": "hugo --gc --minify --cleanDestinationDir && gulp build",
        "ipfs-deploy": "ipfs-deploy -p pinata public -u pinata -d cloudflare -C -O"
    }
}
```

第一条 `build` 即构建命令， Hugo 的命令即为 `hugo --gc --minify --cleanDestinationDir`。这里我还添加了 `gulp build` 是因为我使用了 Gulp 对博客进行了其他的一些操作（[实现 PWA 功能](/tech/website/realize-pwa/)），如果你也使用了 Gulp 请将其命令添加到这里，如果没有的话可以忽略。第二条 `ipfs-deploy` 就是将博客部署到 IPFS 的命令，里面的参数说明可通过以下命令查看： 

```sh
ipfs-deploy --help
```

我们还需要添加一个 `.env` 文件，它是 `ipfs-deploy` 所需的环境变量，如下：

```
IPFS_DEPLOY_PINATA__API_KEY=
IPFS_DEPLOY_PINATA__SECRET_API_KEY=

IPFS_DEPLOY_CLOUDFLARE__API_EMAIL=
IPFS_DEPLOY_CLOUDFLARE__API_KEY=
IPFS_DEPLOY_CLOUDFLARE__ZONE=example.com
IPFS_DEPLOY_CLOUDFLARE__RECORD=_dnslink.example.com
```

{{< notice notice-warning >}}
特别注意：这个文件包含重要信息，千万不要把它上传到 GitHub 上！请务必将 `.env` 添加到 `.gitignore` 文件！ 
{{< /notice >}}

对于该文件内容的前两项，先去 [Pinata](https://pinata.cloud/) 注册，注册完成你应该就能看到你的 API KEY 和 SECRET API KEY，将之分别填入以上文件。中间两项，你要去 [Cloudflare](https://www.cloudflare.com/) 注册，然后将你注册的邮箱填入上方，接下来去[这里](https://dash.cloudflare.com/profile/api-tokens)获取你的 API Key 并填入上方。最后两项，将 `example.com` 替换为你的域名即可，如果你的博客使用的是子域名，那么只需设置最后一项为 `_dnslink.blog.example.com`，这里假设你的子域名为 `blog.example.com`，注意是只需设置最后一项，前面的域名仍需填写主域名。

[^2]![pinata.png](/images/pinata.png)

Pinata 平台的服务是上传至 IPFS 的关键。Pinata 提供的是 Pinning（钉定）服务。简单来说，就是将你的文件上传到 IPFS 网络上，并且会同步到它建立的众多 IPFS 节点上（[IPFS 集群](https://cluster.ipfs.io/)）。当 IPFS 上的任一个节点想要下载你的这个文件时，速度才有保证。我们之所以需要它，是因为 Cloudflare 的 IPFS Gateway 其实只是一种「缓存」服务，让我们能够利用 Cloudflare 的全球节点高速访问 IPFS 网络上的内容，但其服务器不会永久保存 IPFS 网络上的文件。

一个 IPFS 节点不是一块本地硬盘，节点的存储空间是有限的（默认是 10GB）。当节点存储的文件总大小超出了这个值后，节点就会自动删除一些文件（清「缓存」），而 Pinning 就告诉节点：该文件很重要，请不要清除它。如此，节点就会保留你的文件。你的文件没被清除，它就依然能够被其它节点访问到，你的文件在 IPFS 网络上的可访问性就得到了保证。目前的 IPFS 节点数量虽已不少但还远远不够，且绝大部分人还是通过第三方提供的 IPFS Gateway 来访问你的博客的，而不是通过本地 IPFS 节点。这样的话，一旦提供 IPFS Gateway 服务的服务器清除了你的文件，你的博客就无法访问了。除非，你在本地每周 7 天每天 24 小时一直运行着 `ipfs daemon`。但是，即使这样其实也远远不够，举个例子：你的文件不幸被 Cloudflare 的 IPFS Gateway 的服务器清除，而正好此时有一个读者点开了你的博客，此时会发生什么呢？该服务器会重新去 IPFS 网络寻找，但此时的情况就如下图了：

[^3]![one-ipfs-node-only.png](/images/one-ipfs-node-only.png)

这就意味着你的读者可能要等待很久很久才能打开你的博客，如此你的博客的用户体验将会极差。因此，为了保证博客的可访问性，你就需要使用 Pinata 或其它服务提供商提供的 Pinning 服务了。

接下来你必须将你的域名移交给 Cloudflare 管理（即将域名服务器地址修改为 Cloudflare 提供的地址）。因为我们是通过 [DNSLink](https://dnslink.io/) 来实现将域名「解析」到 IPFS 的，即添加一条包含了构建好的博客文件夹（即 `public`）的 Hash 值——即 IPFS 上的「URL」，因为 IPFS 是内容寻址，即通过内容的 Hash 值寻址——的 DNS 记录。而你的博客每构建一次，`public` 文件夹的 Hash 值就会改变（如果博客有修改的话），因此如果你想保证读者能够及时获取到博客的最新版本，你就必须在每次发布博客的同时更新这条 DNS 记录。这种重复的无聊工作肯定不应该手动操作，而应该交给程序自动化处理，这就是 `ipfs-deploy` 的一个很重要的功能了，而它目前仅支持 Cloudflare。另外，Cloudflare 支持裸域名（即直接 `example.com`）CNAME。综上，目前我们必须将域名移交给 Cloudflare 管理。操作的流程如下： 

1. 在 Cloudflare 注册后点击 Add a Site，输入你的域名后按流程走；
2. 去你的域名服务商修改域名服务器的地址，设置好后可以用 Google 提供的[工具](https://developers.google.com/speed/public-dns/cache)清空域名的 NS 缓存以加速；
3. 回到 Cloudflare，点击 Check 或 Re-check now，然后等待几分钟，刷新页面可以看到成功提示；
4. 设置 DNS，删除原有的一些没用的值（如 A 记录和 AAAA 记录），然后添加一条 CNAME：Add record > Type：`CNAME`，Name：`example.com`，Target：`cloudflare-ipfs.com`> Save；
5. SSL/TLS > Always Use HTTPS；

在添加 CNAME 记录的时候，如果你用的是子域名，将 Name 的值改为子域名即可。我的域名之前使用的是 [DNSPod](https://www.dnspod.cn/) 的 DNS 解析服务，将域名提交到 Cloudflare 之后，网站会提示更改你的 Nameserver：

![dns-nameserver.png](/images/dns-nameserver.png)

这时候就需要回到域名服务商那里修改 Nameserver 到：

```
merlin.ns.cloudflare.com
vita.ns.cloudflare.com
```

我们是通过 IPFS Gateway 获取 IPFS 上的内容的，它的作用就是一个网关，连接了 HTTP 和 IPFS，让我们能够使用目前的浏览器方便地访问 IPFS 上的内容。这就是我们添加的这条 CNAME 的作用，将你的域名重定向到安装了 IPFS Gateway 的服务器。以上面添加的这条 CNAME 为例，当一个读者通过浏览器点开 `example.com` 后，浏览器去问 DNS 服务器：这个域名的 IP 地址是什么。DNS 服务器找到一条 CNAME 记录，指向 `cloudflare-ipfs.com` 并且它的 IP 地址是 `104.18.253.167`，于是 DNS 服务器告诉浏览器：IP 地址是 `104.18.253.167`。于是浏览器向这个 IP 地址发起一个 HTTP 请求，这就成功地将你的域名重定向到安装了 IPFS Gateway 的服务器了。之后发生了什么呢？安装了 IPFS Gateway 的服务器会通过 HTTP 请求里的 Header 信息获取到访问的域名是 `example.com`，然后它去查询该域名的 DNS 记录，读取到 `dnslink` 后，就会获取里面包含的 Hash 值（IPFS 地址），最后服务器去 IPFS 网络中获取到相应内容并通过 HTTP 返回给浏览器，浏览器将获取的内容渲染，该读者就能开始开心地阅读你的博客了。可见如果你的博客想要实现 HTTPS，你 CNAME 指向的支持 IPFS Gateway 的服务器就必须要有属于你的域名的 SSL 证书，而目前好像只有 Cloudflare 的 IPFS Gateway 才会提供这项服务——为你的域名生成相应的 SSL 证书。

完成以上步骤后，我们可以先在本地测试一下，执行命令：

```sh
npm run build && npm run ipfs-deploy
```

部署成功后，你可以从以下任何一个网址访问博客（将我的博客域名替换为你自己的即可）：

1. https://guanqr.com/
2. https://ipfs.io/ipns/guanqr.com/
3. https://cloudflare-ipfs.com/ipns/guanqr.com/
4. https://gateway.pinata.cloud/ipns/guanqr.com/
5. 其他 [IPFS 网关](https://ipfs.github.io/public-gateway-checker/)……

我们可以通过浏览器的控制台检查一下网页的 Header 信息，显示了 IPFS 的地址。

![host-blog-on-ipfs.png](/images/host-blog-on-ipfs.png)

这里会出现一个问题，如果你不是通过第一个域名访问的，即你自己的域名，那么页面资源加载可能会出现问题，因为你的博客的使用的是绝对链接而不是相对链接。比如说，你的博客之前的域名是 `https://example.com/`，而现在你访问的是 `https://a.com/ipfs/example.com/`，这就会导致大量用绝对链接的文件 404。以博客主题的 CSS 文件 `/css/main.css` 的加载为例，该文件的正确的有效的地址是 `https://a.com/ipfs/example.com/css/main.css`，但通过 IPFS 网关访问绝对链接 `/css/main.css`，请求的地址其实是 `https://a.com/css/main.css`。怎么解决呢？将它变成相对链接即可，如上面的链接如果是 `./css/main.css`，那就没问题了。不过目前很多博客主题的构建并没有使用相对链接……这是个很大的问题，可能需要自己手动解决了。

到目前为止，部署到 IPFS 的基本步骤已经完成，接下来需要做的就是通过 Netlify 实现持续集成地部署。先去 [Netlify](https://app.netlify.com/signup/) 注册，然后按照提示授权、选择博客的 GitHub 仓库（如果遇到问题可以参考《[博客通过 Netlify 实现持续集成](/tech/website/deploy-blog-to-netlify/)》），完成后前往 Site settings > Build & deploy > Environment 添加 6 个环境变量，名字和值分别对应 `.env` 文件里的值（因为在将博客文件夹上传至 GitHub 仓库的时候，并没有上传 `.env` 文件，所以这一步十分重要）。然后需要新建一个 `netlify.toml` 文件，添加一些持续集成所需的设置： 

```toml
[build]
  base = "/"
  publish = "public/"
  command = "npm run build"

[context.production]
  command = "npm run build && npm run ipfs-deploy"

[build.environment]
  HUGO_VERSION = "0.68.3"
  HUGO_ENV = "production"
  HUGO_ENABLEGITINFO = "true"

[[redirects]]
  from = "https://guanqr.netlify.com/*"
  to = "https://guanqr.com/:splat"
  status = 301
  force = true
```

这里，`build` 为基本构建命令设置，`publish` 即我们要发布的文件夹（其实这个已经没必要了，因为我们现在是部署在 IPFS 上，而非 Netlify 的服务器上），`command` 即要执行的命令，我们直接用 npm 执行写在 `package.json` 里的命令即可。`context.production` 的内容即为构建博客并部署到 IPFS 的命令。`build.environment` 的内容是有关 Hugo 博客框架的设置，如果你是用的是 Hexo，可以忽略。`redirects` 设置的是域名的重定向，我在 Netlify 中设置的仓库名为 `guanqr`，对应的域名为 `guanqr.netlify.com`，我们需要将该域名重定向到自己的主域名，这样也利于 SEO。

以上所有步骤完成后，将你的博客文件夹提交到 GitHub 仓库即可：

```sh
git add .
git commit -m "deploy to IPFS"
git push origin master
```

我们可以在 Netlify 上查看到部署到 IPFS 的详细信息：

```
8:10:05 PM: > ipfs-deploy -p pinata public -u pinata -d cloudflare -C -O
8:10:06 PM: - 📦  Calculating size of public…
8:10:06 PM: ✔ 🚚  Directory public weighs 126.0 MiB.
8:10:06 PM: - 📠  Uploading and pinning to Pinata…
8:10:16 PM: ✔ 📌  Added and pinned to Pinata with hash:
8:10:16 PM: ℹ 🔗  QmemkTVoNHX2GzZJngKZJjncTBj4bZx6wq6v5mnn9dSLTa (​https://gateway.pinata.cloud/ipfs/QmemkTVoNHX2GzZJngKZJjncTBj4bZx6wq6v5mnn9dSLTa/​)
8:10:16 PM: - ⚙️  Validating configuration for Cloudflare…
8:10:16 PM: ℹ 📡  Beaming new hash to DNS provider Cloudflare…
8:10:17 PM: ✔ 🙌  SUCCESS!
8:10:17 PM: ℹ 🔄  Updated DNS TXT _dnslink.guanqr.com to:
8:10:17 PM: ℹ 🔗  dnslink=/ipfs/QmemkTVoNHX2GzZJngKZJjncTBj4bZx6wq6v5mnn9dSLTa
8:10:17 PM: QmemkTVoNHX2GzZJngKZJjncTBj4bZx6wq6v5mnn9dSLTa
```

目前来看，部署到 IPFS 后在国内的访问速度较部署到 Netlify 上快一些，PWA 站点缓存内容的更新速度也比原来要快，可能是因为网站的访问通过的是 Cloudflare 的 IPFS Gateway，有一定的加速。不过目前这样的部署方式还存在一些问题，比如无法自定义 404 页面，Cloudflare 上看不到浏览统计信息，不支持强制跳转到 HTTPS 等等。我去年在进行部署的时候，使用的域名是子域名 `blog`，将域名的 NameServer 转为 Cloudflare 进行 DNS 解析服务的时候，过了两天在国内仍然无法正常访问，只能通过开代理访问，目前这个问题产生的原因尚未知道。除此之外，还有一个网址的重定向问题，由于我的部分文章 URL 结构进行了修改，之前通过 Netlify 部署的时候，可以进行 URL 的重定向设置，但现在部署到 IPFS 这些设置就失效了，好在 Hugo 有一个 [Aliases](https://gohugo.io/content-management/urls/#aliases) 的功能，这个问题也就很快得到了解决。对于域名的重定向，Cloudflare 也提供了域名重定向的服务（添加 Page Rules），我的博客域名也进行了多次地修改，子域名从 `www` 到 `blog` 再到现在直接使用的 `guanqr.com`，为了保证以前的读者收藏的文章能够正常访问，我也使用了 Cloudflare 的域名重定向功能。

[^1]: 图源：<https://www.cloudflare.com/distributed-web-gateway/>
[^2]: 图源：<https://medium.com/pinata/how-to-easily-host-a-website-on-ipfs-9d842b5d6a01>
[^3]: 图源：<https://medium.com/pinata/dedicated-ipfs-networks-c692d53f938d>