+++
title = "Hexo-NexT 主题添加评论系统"
date = "2019-05-12T23:56:53+08:00"
tags = ["hexo","next"]
series = ["create-a-blog"]
+++

静态博客无法直接构建评论系统，需要借助第三方平台的后端。NexT 主题支持 Disqus、Valine、Gitalk 等多种第三方评论系统。我推荐使用 Valine 或者 Disqus（加载评论需科学上网）。Valine 评论系统借助于 LeanCloud 存储数据，LeanCloud 的[国内版本](https://leancloud.cn/)需要绑定域名和备案，这对于很多人来说不太方便，所以可以选择使用[国际版](https://leancloud.app/)。目前 NexT 主题支持多评论系统，不过我认为这项功能有些多余，有谁会无聊使用多种评论系统呢？不方便管理评论，将简单的管理变得更加复杂。

下面这一部分是设定多评论系统，首先设定默认的评论系统，然后是其他评论系统的优先级等等配置，由于我没有使用该项功能，所以不再做过多说明：

```yml
# Multiple Comment System Support
comments:
  # Available values: tabs | buttons
  style: tabs
  # Choose a comment system to be displayed by default.
  # Available values: changyan | disqus | disqusjs | facebook_comments_plugin | gitalk | livere | valine | vkontakte
  active:
  # Setting `true` means remembering the comment system selected by the visitor.
  storage: true
  # Modify texts or order for any navs, here are some examples.
  nav:
    #disqus:
    #  text: Load Disqus
    #  order: -1
    #facebook_comments_plugin:
    #  text: <i class="fa fa-facebook-official" aria-hidden="true"></i> facebook
    #gitalk:
    #  order: -2
```

下面我将对 Disqus、Valine、Gitalk 三种评论系统的单独配置进行详细说明。

## Disqus

![hexo-theme-next-disqus.png](/images/hexo-theme-next-disqus.png "Disqus 官网主页")

[Disqus](https://disqus.com/) 评论系统我认为是重多评论系统中最好的一个，无奈需要科学上网才能访问。首先是到官网注册一个用户，然后在官网的主页，有一个「GET STARTED」按钮，点击进入，可以看到如下界面：

![hexo-theme-next-disqus-install-site.png](/images/hexo-theme-next-disqus-install-site.png)

选择「I want to install Disqus on my site」，就会跳转到信息设定页面。在信息设定页面，设定你的网站名称，比如我在这里填写的是「guanqr」，那么「guanqr」就是你的一个 shortname，记住这个名字。相应的，你的聊天系统的控制台对应的网址就是 `guanqr.disqus.com`。你还需要在这里填写你的网站类别和语言，这里我填写的是技术类「Tech」，语言是中文。

![hexo-theme-next-disqus-setting.png](/images/hexo-theme-next-disqus-setting.png)

这些设定完成后，回到主题配置文件中，找到 Disqus 评论系统的配置，开启 Disqus 评论，`shortname` 填写之前你设定的网站名称，如下所示：

```yml
# Disqus
disqus:
  enable: true
  shortname: 
  count: true
  lazyload: false
  #post_meta_order: 0
```

到此，Disqus 评论系统的配置就完成了。如果你想实现在国内网络环境下也能访问 Disqus 评论的内容，则需要借助 Disqus API，这就用到了 [DisqusJS](https://github.com/SukkaW/DisqusJS)。这里需要注意，目前 DisqusJS 仅支持评论的「读」操作，不支持「写」操作。

配置 DisqusJS 的时候，首先要到 [Disqus API Application](https://disqus.com/api/applications/) 处注册一个 Application，如下图所示，点击右边的「Register new application」。

![hexo-theme-next-disqus-api.png](/images/hexo-theme-next-disqus-api.png)

然后进行网站的基本信息设定，将信息提交后，网站会提供给你一个 API Key，将这一长串字符记下来。

![hexo-theme-next-disqus-api-key.png](/images/hexo-theme-next-disqus-api-key.png)

进入 [Settings] 页面，设置你的域名，Disqus 会检查 API 请求的 Referrer。

![hexo-theme-next-disqus-api-domains.png](/images/hexo-theme-next-disqus-api-domains.png)

在这些都设定完成后，回到主题配置文件，进行 DisqusJS 的配置。开启 DisqusJS，这里的 `api` 是 DisqusJS 请求的 API Endpoint，通常情况下你应该配置一个 Disqus API 的反代并填入反代的地址。你也可以直接使用 Disqus 官方 API 的 Endpoint：`https://disqus.com/api/`。如果不填写，则默认为该插件的作者自己搭建的 Disqus API 反代 Endpoint：`https://disqus.skk.moe/disqus/`。`apikey` 就是上文中让你记下的那一串字符。`shortname` 即上文配置 Disqus 评论系统时记下的网站名称。

```yml
# DisqusJS
# Alternative Disqus - Render comment component using Disqus API.
# Demo: https://suka.js.org/DisqusJS/
# For more information: https://github.com/SukkaW/DisqusJS
disqusjs:
  enable: true
  # API Endpoint of Disqus API (https://disqus.com/api/).
  # Leave api empty if you are able to connect to Disqus API.
  # Otherwise you need a reverse proxy for Disqus API.
  # For example:
  # api: https://disqus.skk.moe/disqus/
  api:
  apikey: # Register new application from https://disqus.com/api/applications/
  shortname: # See: https://disqus.com/admin/settings/general/
```

## Valine

![hexo-theme-next-valine.png](/images/hexo-theme-next-valine.png "Valine 官方主页")

[Valine](https://valine.js.org/) 评论系统是我认为的在国内网络环境下最好用的评论系统，可通过 Leancloud 管理评论，无广告，简洁美观。不过缺点就是，Leancloud 平台的不稳定性，在 2019 年夏季的时候，出现了一次域名停止解析的事故，原因是有人利用 Leancloud 进行一些非法行为，而平台管理人员并没有监管到位。在那次事故之后，Leancloud 加强了监管，国内用户必须进行实名注册，每一个服务器必须绑定一个备案的域名。如果你不想备案，可以选择使用 Leancloud 国际版。但谁也无法确保 Leancloud 国际版会发生什么事情。

Leancloud 国内版和国际版的配置相同，这里以国际版为例进行说明。首先进入[官网](https://leancloud.app/)进行用户注册，注册完成后点击「创建应用」，填写应用的名称，选择「开发版」进行创建。

![hexo-theme-next-leancloud-create-app.png](/images/hexo-theme-next-leancloud-create-app.png)

进入刚才创建好的应用，在「储存」中选择「创建 Class」，设定 Class 名称为 Comment，设定 ACL 权限为创建者可读可写，其他人可读不可写。

![hexo-theme-next-leancloud-comment.png](/images/hexo-theme-next-leancloud-comment.png)

然后进入「设置」中的「安全中心」，添加 Web 安全域名，防止其他用户盗用你的 Keys 存储个人数据。

![hexo-theme-next-leancloud-safe.png](/images/hexo-theme-next-leancloud-safe.png)

再进入「设置」中的「应用 Keys」，记录 AppID 和 AppKey 的值。回到主题配置文件中，开启 Valine，在 Valine 配置中填写 AppID 和 AppKey 即可。在该项配置中，你也可以设置评论框中的提示语，默认是「Just go go」。当你将 `visitor` 选项设置为 `true` 时，可以记录当前页面的访客数。这一部分需要填写的内容可能根据 Valine 版本的更新会有相应的增减，不过基本功能的配置思路是一样的。

```yml
# Valine
# You can get your appid and appkey from https://leancloud.cn
# For more information: https://valine.js.org, https://github.com/xCss/Valine
valine:
  enable: true # When enable is set to be true, leancloud_visitors is recommended to be closed for the re-initialization problem within different leancloud adk version
  appid: # Your leancloud application appid
  appkey: # Your leancloud application appkey
  notify: false # Mail notifier. See: https://github.com/xCss/Valine/wiki
  verify: false # Verification code
  placeholder: Just go go # Comment box placeholder
  avatar: mm # Gravatar style
  guest_info: nick,mail,link # Custom comment header
  pageSize: 10 # Pagination size
  language: # Language, available values: en, zh-cn
  visitor: false # leancloud-counter-security is not supported for now. When visitor is set to be true, appid and appkey are recommended to be the same as leancloud_visitors' for counter compatibility. Article reading statistic https://valine.js.org/visitor.html
  comment_count: true # If false, comment count will only be displayed in post page, not in home page
  recordIP: false # Whether to record the commenter IP
  serverURLs: # When the custom domain name is enabled, fill it in here (it will be detected automatically by default, no need to fill in)
  #post_meta_order: 0
```

## Gitalk

Gitalk 评论系统借助 GitHub 平台，将评论的数据存储在仓库的 Issues 中。另一款评论系统 Gitment 与之类似，不过由于 Gitment 已停止维护，目前已经从 NexT 主题中删除。

![hexo-theme-next-gitalk.png](/images/hexo-theme-next-gitalk.png)

首先，你需要在 GitHub 上创建一个仓库，用来存放评论，用你存放博客源代码的仓库即可。然后创建一个 Github Application 用来授权登录。点击[这里](https://github.com/settings/applications/new)申请，「Authorization callback URL」（回调地址）填写你主页地址，完成后会生成相应的 clientID 和 clientSecret，记录这两项的值，回到主题配置文件的 Gitalk 设定中，开启 Gitalk，填写你的 GitHub 用户名，以及之前记录的 lientID 和 clientSecret 的值即可。

每一篇文章在你登录评论系统前都未开启评论功能，所以在你发布文章后，需要先浏览文章，在评论系统中登录你的账号，此时，Gitalk 就会将该篇文章的标题作为一个 Issue 记录在仓库的 Issues 中。如果 Gitalk 评论系统配置异常，请查看你的网站地址（回调地址）是否填写正确。

```yml
# Gitalk
# Demo: https://gitalk.github.io
# For more information: https://github.com/gitalk/gitalk
gitalk:
  enable: true
  github_id: # GitHub repo owner
  repo: # Repository name to store issues
  client_id: # GitHub Application Client ID
  client_secret: # GitHub Application Client Secret
  admin_user: # GitHub repo owner and collaborators, only these guys can initialize gitHub issues
  distraction_free_mode: true # Facebook-like distraction free mode
  # Gitalk's display language depends on user's browser or system environment
  # If you want everyone visiting your site to see a uniform language, you can set a force language value
  # Available values: en | es-ES | fr | ru | zh-CN | zh-TW
  language:
```

## Utterances

有朋友向我咨询配置评论系统的时候，提到了信息安全方面的内容。像 Gitalk、Valine 这样的评论系统，都会将自己的 AppID 和 AppKey 暴露在网页的源码中，虽然说这些信息的泄露对评论的影响微乎其微，不过总觉得会有那么一点担忧。[Utterances](https://utteranc.es/) 评论系统和 Gitalk 类似，借助 GitHub 仓库的 Issues 存储评论信息，但 Utterances 的配置并不会设置 AppID 和 AppKey，只需要填写仓库名。

![hexo-theme-next-utterances.png](/images/hexo-theme-next-utterances.png)

Utterances 评论系统并非主题包含的评论系统，因此需要自己添加代码，或者借助插件。NexT 主题提供了添加该评论系统的插件 [hexo-next-utteranc](https://github.com/theme-next/hexo-next-utteranc).安装插件后，在配置文件 `_config.yml` 中添加以下代码：

```yaml
utteranc:
  enable: true
  repo: #Github repo such as :TrumanDu/comments
  pathname: pathname
  # theme: github-light,github-dark,github-dark-orange
  theme: github-light
  cdn: https://utteranc.es/client.js
  # If you want to modify priority, please config in **hexo**
  #priority:
```

然后在 GitHub 上安装 [Utterances 应用程序](https://github.com/apps/utterances)，添加存储评论的仓库，再将仓库名填写在配置文件 `_config.yml` 中即可。