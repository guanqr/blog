+++
title = "Waline 评论系统的介绍与基础配置"
date = "2021-04-01T6:20:40+08:00"
lastmod = "2021-05-14T17:40:58+08:00"
tags = ["hugo","meme","vercel"]
displayExpiredTip = true
dropCap = false
toc = true
+++

## 引言

### 为何使用评论系统

在两年前刚开始写博客的时候，我是开启了评论系统的。前后用过 Gitalk、Valine、Utterances、Disqus。不过后来我发现，虽然每篇文章下面都开着评论区，但是因为我的博客本身的访问量很少，基本上没有人会来评论。开着评论区的话，每次进入页面还要加载额外的资源。因此我就干脆关闭了评论功能，只留下了一个邮箱地址。后来我的博客访问人数越来越多，有些朋友就通过邮箱和我进行联系。不过我觉得，通过邮箱联系的方式适合大段文字的正式交流，大部分读者看完文章后可能只想要评论一两句话，看到网页的底部没有评论区就放弃了，他们不会大费周折的去寻找作者的邮箱地址是什么，然后再打开邮箱写下一堆文字。我想要做的是一个综合类的博客，虽然是静态博客，但其功能不仅仅是作为记录自己的生活和技术的记事本，还要记录和别人的交流。评论是博客的标配功能。

### 为何选择 Waline

之前没有开启评论功能的原因除了博客的访问量少外，还有就是——没有找到合适的评论系统。什么是合适？第一点是能完美适配博客主题。现在有很多博客主题有明暗两色调节，评论系统的配色也应该能够随着主题明暗变化而做出相应的改变。第二点是便捷。对于评论功能，最便捷的就是填上一个昵称和邮箱，不需要去注册账户，想评论就评论。第三点是安全。作为博主，不希望有人滥用评论功能发送大量垃圾信息；作为评论者，不希望自己的邮箱和 IP 地址等隐私信息暴露给其他人。第四点是符合实际情况。我的博客是中文博客，面向的读者大部分来自国内，如果使用一些被墙的评论系统，国内的人想进行评论是很麻烦的。

在下表中，我对部分评论系统的性能进行了简单的对比。有些评论系统是我在很早之前使用过的，后来也许进行过优化，但我没有再关注过，所以作出的评估可能不太准确。

| 评论系统 | 适配主题 | 便捷  |  安全 | 符合实情 |
|:-------:|:-------:|:-----:|:-----:|:-------:|
| Gitalk  |    否   |  否   |   否   |   是    |
| Utterances |  是  |   是  |   是   |   是    |
| Valine  |    否   |   是  |   否   |   是    |
| Disqus  |    是   |   否  |   是   |   否    |

以前有位朋友和我讨论过选用哪个评论系统的问题。他发现 Gitalk 和 Valine 的密钥都能够从后台查到，所以很可能会有隐私泄露和数据篡改的危险。最终我推荐他使用了 Utterances。虽然 Utterances 和 Gitalk 一样需要借助 GitHub 的 Issues 区存放评论，要想进行评论需要注册 GitHub 账号，但不存在密钥泄露的风险，算是个折衷的方案。对于 Valine 的数据泄露风险，问题很严重。有关这个问题可以看看以下两篇文章：

+ [基于 Serverless 的 Valine 可能并没有那么香 | 怡红院落](https://imnerd.org/valine-may-not-so-good.html)
+ [请马上停止使用 Valine.js 评论系统，除非它修复了用户隐私泄露问题 | 荒野無燈](https://ttys3.dev/post/hugo/please-stop-using-valine-js-comment-system-until-it-fixed-the-privacy-leaking-problem/)

这里还要解释一下 Valine 的主题适配性问题。虽然 Valine 支持明暗主题切换，但我觉得，在暗色主题下，文字颜色和背景颜色不太协调。由此可见，每种评论系统都存在一些明显缺陷。于是，怡红公子的 Waline 诞生了。从名字上看，必然是从 Valine 衍生的，继承了 Valine 的优势的同时，又从安全性方面进行了改良。与 Valine 不同，该系统带有后端，所以不存在暴露密钥、IP 地址等安全问题。此外，该系统还支持多种部署方式和数据存储方式，可以称得上是国内评论系统中的精品。

## 正文

### 基础配置

[官方网站](https://waline.js.org/)给出了较为详细的配置说明。下文中讲述的是使用 LeanCloud 作为数据存储端，Vercel 作为服务端进行部署的方法，以及如何将部署好的评论系统插入到 Hugo MemE 主题当中。其他方法请阅读官方说明。

#### 配置 LeanCloud

我推荐使用 [LeanCloud 国际版](https://leancloud.app/)，因为国内版还需要和备案的域名绑定。注册账户登录以后，创建应用。应用名称随意填写，我写的是 `Hugo`，然后选择开发版（免费）进行创建。

![waline-0.png](/images/waline-0.png "LeanCloud 创建应用")

创建完成后进入控制台的「设置」→「应用 Keys」界面。将 AppID、AppKey、MasterKey 这三个值记下来，注意不要暴露给别人。

![waline-1.png](/images/waline-1.png "查看密钥")

#### 配置 Vercel

首先是注册 Vercel 账户，用 GitHub 账户注册即可。然后使用开发者提供的[快速部署链接](https://vercel.com/import/project?template=https://github.com/lizheming/waline/tree/master/example)，直接将开发者的 Waline 仓库 Clone 到 Vercel 新创建的项目中。项目名称随意填写一个即可，我写的是 `blog-waline`

![waline-2.png](/images/waline-2.png "创建 Vercel 项目")

下一步是填写 GitHub 仓库名。Vercel 会在你的 GitHub 中自动创建一个仓库，并基于 Waline 模板初始化该仓库。该仓库默认为私人仓库。仓库名我填写的还是 `blog-waline`。

![waline-3.png](/images/waline-3.png "设置 GitHub 仓库名")

下一步，需要在环境变量（Environment Variables）中配置 `LEAN_ID`、`LEAN_KEY` 和 `LEAN_MASTER_KEY` 三个环境变量。它们的值分别对应在 LeanCloud 中获得的 AppID、AppKey 和 MasterKey。

![waline-4.png](/images/waline-4.png "配置环境变量")

以上完成后，点击「Deploy」就会进行部署。稍等片刻，会看到满屏的烟花庆祝你部署成功。点击「Visit」会跳转到部署好的地址上，该地址即为之后需要填入的 `serverURL` 地址。你也可以设置自定义域名地址。

![waline-5.png](/images/waline-5.png "评论服务部署中")

#### 插入 MemE 主题

Hugo 的 MemE 主题目前并未带有 Waline 评论的相关配置。在主题仓库的 Issues 区有人已经提了增加 Waline 评论的建议，但可能是博主最近工作忙碌的缘故，迟迟没有更新。我觉得早晚会更新的，如果你没有耐心等待的话，自己修改主题的代码也不是问题。主题中含有 Valine 的相关代码，稍微修改一下就可以了。

先查看一下主题内和 Valine 相关的代码有哪些：

+ ~/themes/meme/layouts/partials/components/comments.html
+ ~/themes/meme/layouts/layouts/third-party/script.html
+ ~/themes/meme/layouts/layouts/third-party/valine.html

当然还有博客配置文件 `config.toml` 中的 Valine 部分：

```toml
## Valine
enableValine = false
valineAppId = ""
valineAppKey = ""
valinePlaceholder = "Just go go"
valinePath = ""
valineAvatar = "mm"
valineMeta = ["nick", "mail", "link"]
valinePageSize = 10
valineLang = "zh-cn"
valineVisitor = false
valineHighlight = true
valineAvatarForce = false
valineRecordIP = false
valineServerURLs = ""
valineEmojiCDN = ""
valineEmojiMaps = {}
valineEnableQQ = false
valineRequiredFields = []
# 说明：https://valine.js.org/
```

接下来就是比葫芦画瓢。改动主题代码的时候注意，为了便于主题更新，目前推荐的方式是以 `submodule` 的形式加载主题。所以不要在主题文件夹下修改相应代码，应该直接在博客文件夹的根目录下，对应主题文件夹下相应的文件夹目录新建文件。也就是在下面所示的目录中新建文件（没有所示的文件夹请自建）：

+ ~/layouts/partials/components/comments.html
+ ~/layouts/layouts/third-party/script.html
+ ~/layouts/layouts/third-party/valine.html

这样新建的文件可以覆盖主题文件夹下相同命名的文件，在下一次更新主题的时候不用重复修改主题文件。其中：

+ `comments.html` 文件的作用是控制是否开启评论（`enableComments`），开启哪个评论系统（`enableValine`），如果开启，则插入相关评论的 `<div>` 标签 `id`；
+ `script.html` 文件的作用是载入开启的评论的相应 HTML 文件（`valine.html`）；
+ `valine.html` 文件的作用是调用 valine.js，对评论功能进行设定。

在`comments.html` 中，下面所示代码之间部分是加载评论 `<div>` 标签 `id`的代码，在这部分插入：

```diff
{{ if and (.Params.comments | default .Site.Params.enableComments) (eq hugo.Environment "production") }}
    {{ if or (in .Site.Params.mainSections .Section) .Params.comments }}

+       {{ if .Site.Params.enableWaline }}
+           <div id="waline"></div>
+       {{ end }}

    {{ end }}
{{ end }}
```

在 `script.html` 中，下面所示代码之间部分是载入开启的评论的相应 HTML 文件的，在这部分插入：

```diff
{{ if and (.Params.comments | default .Site.Params.enableComments) (eq hugo.Environment "production") }}
    {{ if or (in .Site.Params.mainSections .Section) .Params.comments }}

+       {{ if .Site.Params.enableWaline }}
+           {{ partial "third-party/waline.html" . }}
+       {{ end }}

    {{ end }}
{{ end }}
```

这时候，我们用到了 `enableWaline`，所以，找到博客配置文件 `config.toml` 中配置评论的部分，插入：

```toml
## Waline
enableWaline = true
```

也就是开启 Waline 评论。然后，从官网的说明中，我们可以看到需要配置哪些内容。这些内容有必填的，也有选填的。

![waline-6.png](/images/waline-6.png "需要配置的内容")

这部分就是 `waline.html` 文件中要写的内容（将 `valine.html` 替换为 `waline.html`）：

```html
<script>
    function loadComments() {
        if (typeof Waline === 'undefined') {
            var getScript = (options) => {
                var script = document.createElement('script');
                script.defer = true;
                script.crossOrigin = 'anonymous';
                Object.keys(options).forEach((key) => {
                    script[key] = options[key];
                });
                document.body.appendChild(script);
            };
            getScript({
                src: 'https://cdn.jsdelivr.net/npm/@waline/client/dist/Waline.min.js',
                onload: () => {
                    newWaline();
                }
            });
        } else {
            newWaline();
        }
    }
    function newWaline() {
        new Waline({
            el: '#waline',
            serverURL: '{{ .Site.Params.walineServerURL }}',
            placeholder: '{{ .Site.Params.walinePlaceholder }}',
            avatar: '{{ .Site.Params.walineAvatar }}',
            meta: {{ .Site.Params.walineMeta }},
            pageSize: {{ .Site.Params.walinePageSize }},
            lang: '{{ .Site.Params.walineLang }}',
            highlight: {{ .Site.Params.walineHighlight }},
            avatarCDN: '{{ .Site.Params.walineAvatarCDN }}',
            requiredFields: {{ .Site.Params.walineRequiredFields }}
        });
    }
</script>
```

这里我只配置了必填项和部分选填项。其他的内容我觉得按照默认的就行，不需要改动。最后，回到博客配置文件 `config.toml` 中之前添加代码的地方，继续添加：

```toml
## Waline
enableWaline = true
walineServerURL = ""
walinePlaceholder = "请填写正确的昵称和邮箱，方便接收评论回复信息哦。"
walineAvatar = "mp"
walineMeta = ["nick", "mail", "link"]
walinePageSize = 10
walineLang = "zh-CN"
walineHighlight = true
walineAvatarCDN = "https://cdn.v2ex.com/gravatar/"
walineRequiredFields = ["nick", "mail"]
# 说明：https://waline.js.org/
```

这里的 `walineServerURL` 要填的内容就是上文在 Vercel 中生成的评论部署地址，也就是对应的 `serverURL`。以上步骤都完成后，重新部署博客，就可以正常加载评论了。

#### 评论功能测试

对评论进行简单测试：

![waline-7.png](/images/waline-7.png "亮色模式")

![waline-8.png](/images/waline-8.png "暗色模式")

#### 评论数据管理

Waline 带有简单的后台，可以实现对评论的管理。部署完成后访问 `<serverURL>/ui/register` 进行注册，第一个注册的账户会被设定成管理员。登录成功后就可以看到评论管理的界面了。在评论的时候，如果选择登陆账户后进行评论，你的评论昵称后面会显示「博主」字样。在上图中，有条评论我没有登录直接进行评论，虽然是同一个用户，但依然没有显示「博主」字样。

![waline-9.png](/images/waline-9.png "后台评论管理")

![waline-10.png](/images/waline-10.png "后台个人信息页")

不过在个人信息页的设定中，无法修改个人邮箱。如果想要修改个人邮箱，则需要到 LeanCloud 数据中的 `Users` 处修改。

![waline-11.png](/images/waline-11.png "LeanCloud 中修改邮箱的地方")

### 开启邮件提醒功能

邮件提醒功能，即当某人在文章下方进行评论的时候，博主能够收到提醒邮件；某人的评论得到新回复的时候，这个人也能收到提醒邮件。这虽然不是一个必要的功能，但能节省两个人之间沟通的间隔时间，不必天天守在后台去看是否有人评论了某篇文章。

#### 添加 Vercel 环境变量

在 Vercel 的项目中添加以下新的环境变量：

+ `AUTHOR_EMAIL`：博主邮箱，用来区分发布的评论是否是博主本身发布的。如果是博主发布的则不进行提醒通知。
+ `SMTP_SERVICE`：SMTP 邮件发送服务提供商，可以在[这个页面](https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json)查看所有支持的运营商。如果没在列表中的可以自行配置 `SMTP_HOST` 和 `SMTP_PORT`。
+ `SMTP_HOST`：SMTP 服务器地址，如果未配置 `SMTP_SERVICE` 的话该项必填。
+ `SMTP_PORT`：SMTP 服务器端口，如果未配置 `SMTP_SERVICE` 的话该项必填。
+ `SMTP_USER`：SMTP 邮件发送服务的用户名，一般为登录邮箱。
+ `SMTP_PASS`：SMTP 邮件发送服务的密码，一般为邮箱登录密码，部分邮箱（例如 163 邮箱）是单独的 SMTP 密码。
+ `SITE_NAME`：网站名称，用于在消息中显示。
+ `SITE_URL`：网站地址，用于在消息中显示。
+ `SENDER_NAME`：自定义发送邮件的发件人，选填。
+ `SENDER_EMAIL`：自定义发送邮件的发件地址，选填。
+ `MAIL_SUBJECT`：评论回复邮件标题自定义。
+ `MAIL_TEMPLATE`：评论回复邮件内容自定义。
+ `MAIL_SUBJECT_ADMIN`：新评论通知邮件标题自定义。
+ `MAIL_TEMPLATE_ADMIN`：新评论通知邮件内容自定义。

{{< simple-notice simple-notice-tip >}}
对于邮箱的选用，我个人觉得，不要使用自己平时常用的邮箱。最好单独注册个邮箱用来自动发送邮件。因为很可能会有滥用邮箱账户发送垃圾邮件的行为。我是单独使用了一个网易邮箱进行配置的。
{{< /simple-notice >}}

添加完环境变量后需要重新部署一下。在添加环境变量的过程中可能会出现两个问题，下面重点讲解。

#### 某一环境变量「值」的更改

当你配置了 `SMTP_HOST` 邮箱地址后，会自动生成一个 `@smtp-host` 的 Secret 来存储其值。比如你的邮箱是 `a@a.com` 如果想要更换邮箱到 `b@a.com`，就无法再将其值存放在 `@smtp-host` 中，因为 `@smtp-host` 已经被占用。只能存放在加了后缀的，比如名为 `@smtp-host-1` 的 Secret 中。这其实没什么大碍，但作为一个有强迫症的人，我既然已经不用 `a@a.com` 邮箱了，为什么还要留着 `@smtp-host` 来存放 `a@a.com`？为什么无法删除？

![waline-12.png](/images/waline-12.png "Vercel 中配置环境变量的界面")

实际上 `@smtp-host` 是可以删除的。只不过过程有些繁琐。可以在本地使用命令来管理 Vercel。[官方文档](https://vercel.com/docs/cli)中介绍了 Vercel CLI 的一系列命令。

先在本地安装 Vercel CLI：

```sh
npm i -g vercel
```

然后执行以下命令连接你的账户，`YOUR_EMAIL` 填写你 Vercel 账户的邮箱：

```sh
vercel login YOUR_EMAIL
```

接着，Vercel 会向你的邮箱发送一个确认邮件，确认即可。

![waline-13.png](/images/waline-13.png "本地连接 Vercel 确认账户")

下面在一个空文件夹内启动命令行，输入：

```sh
vercel
```

Vercel 会向你确认是否部署 Vercel 在该文件夹，是否链接到已有项目，以上都选择「Y」，然后输入项目的名字，我的是 `blog-valine`。

操作完成后，输入：

```sh
vercel secrets list
```

即可查看已有的 Secret 列表。这里我们想要删除的是 `smtp-host`，所以输入下面的命令即可删除：

```sh
vercel secrets remove smtp-host
```

![waline-14.png](/images/waline-14.png "查看所有的 Secret")

#### 自定义回复邮件标题和内容

`MAIL_SUBJECT`、`MAIL_TEMPLATE`、`MAIL_SUBJECT_ADMIN`、`MAIL_TEMPLATE_ADMIN` 四个环境变量是用来自定义回复邮件标题和内容的。不过一般而言，邮件回复的时候，标题和内容都不是固定的。比如说 A 回复了某条评论，系统发送邮件通知评论作者 B 的时候，标题最好含有 B 的名字。内容也应该含有 A 对 B 的什么评论作出了什么评论。这些内容会随着评论作者和评论内容的不同进行改变，所以不能直接简单的设置成固定的内容，需要设定一个回复模板。

模板可以通过 `self`、`parent` 和 `site` 对象传递参数，其中分别包含以下变量：

+ `self`：该条评论本身
  
  |  变量  |  备注  |
  |:------:|:------:|
  | `nick` | 评论者姓名 |
  | `mail` | 评论者邮箱 |
  | `link` | 评论者网址 |
  | `url`  |  文章地址  |
  | `comment` | 评论内容 |

+ `parent`：该条评论的回复对象（父评论）

  |  变量  |  备注  |
  |:------:|:------:|
  | `nick` | 评论者姓名 |
  | `mail` | 评论者邮箱 |
  | `link` | 评论者网址 |
  | `type` | 评论者类型 |
  | `comment` | 评论内容 |

+ `site`：网站配置

  |  变量  |  备注  |
  |:------:|:------:|
  | `name` | 博客名字 |
  | `url`  | 博客网址 |
  | `postUrl` | 评论完整网址 |

比如想要显示评论者姓名，就用 `{{self.nick}}`。这样一来，我们就可以对上述四个环境变量设定模板。不过由于 Vercel 的环境变量大小限制为 4KB，如果你的模板存储需求比较大，需要直接使用代码配置。

使用代码配置则需要到 GitHub 上自动创建的那个私人仓库。仓库中有一个名为 `index.js` 的文件，最初的内容为：

```javascript
const Application = require('@waline/vercel');

module.exports = Application({
  async postSave(comment) {
    //do what ever you want after save comment
  }
});
```

在 `{}` 中添加相关配置即可。下面是完整的代码：

```javascript
const Application = require('@waline/vercel');

module.exports = Application({
  mailSubject: '{{parent.nick}}，您在博客「{{site.name}}」上的评论收到了回复',
  mailTemplate: `
    <div style="border-top:2px solid #12ADDB;box-shadow:0 1px 3px #AAAAAA;line-height:180%;padding:0 15px 12px;margin:50px auto;font-size:12px;">
      <h2 style="border-bottom:1px solid #DDD;font-size:14px;font-weight:normal;padding:13px 0 10px 8px;">        
        您在博客<a style="text-decoration:none;color: #12ADDB;" href="{{site.url}}" target="_blank">{{site.name}}</a>上的评论有了新的回复
      </h2>
      <div style="padding:0 12px 0 12px;margin-top:18px">
		<p>{{parent.nick}}，您曾发表评论：</p>
        <div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">{{parent.comment | safe}}</div>
        <p><strong>{{self.nick}}</strong> 回复说：</p>
        <div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">{{self.comment | safe}}</div>
        <p>您可以点击<a style="text-decoration:none; color:#12addb" href="{{site.postUrl}}" target="_blank">前往原文查看完整的回复內容</a>，欢迎再次光临<a style="text-decoration:none; color:#12addb" href="{{site.url}}" target="_blank">{{site.name}}</a>。</p>
        <br/>
      </div>
	  <div style="border-top:1px solid #DDD; padding:13px 0 0 8px;">
		该邮件为系统自动发送的邮件，请勿直接回复。
	  </div>
	  <br/>
    </div>`,
  mailSubjectAdmin: '您的博客「{{site.name}}」收到了新评论',
  mailTemplateAdmin: `
    <div style="border-top:2px solid #12ADDB;box-shadow:0 1px 3px #AAAAAA;line-height:180%;padding:0 15px 12px;margin:50px auto;font-size:12px;">
      <h2 style="border-bottom:1px solid #DDD;font-size:14px;font-weight:normal;padding:13px 0 10px 8px;">        
        有人在<a style="text-decoration:none;color: #12ADDB;" href="{{site.url}}" target="_blank">{{site.name}}</a>发表了新的评论
      </h2>
      <div style="padding:0 12px 0 12px;margin-top:18px">
		<p><strong>{{self.nick}}</strong> 评论说：</p>
		<div style="background-color: #f5f5f5;padding: 10px 15px;margin:18px 0;word-wrap:break-word;">{{self.comment | safe}}</div>
        <p>您可以点击<a style="text-decoration:none; color:#12addb" href="{{site.postUrl}}" target="_blank">前往原文查看完整的评论内容。</a></p>
        <br/>
      </div>
	  <div style="border-top:1px solid #DDD; padding:13px 0 0 8px;">
		该邮件为系统自动发送的邮件，请勿直接回复。
	  </div>
	  <br/>
    </div>`
});
```

测试如下：

![waline-15.png](/images/waline-15.png "King 对某篇文章进行评论，博主对 King 进行回复")

![waline-16.png](/images/waline-16.png "King 会在邮箱中收到博主回复的通知")

在 `index.js` 文件中，你还可以设定安全域名、违禁词、IP 禁止名单等等，这些内容请直接参考官方文档。

### 注意事项

完成本文的时候，MemE 主题还未内置 Waline 评论功能。并且 Waline 评论还在 0.n 版时代，尚未发布正式稳定版。所以 Waline 评论系统的样式和功能仍在不断改进中。可能各位读者在阅读本人的这篇文章的时候，Waline 评论已经更新换代很多次了。但总的来说，配置方法是不会有较多改动的。

如果遇到这样的情况：原本配置好的 Waline 评论，到某一天突然出现了 BUG，不能用了。那可能就是官方的代码进行了较多的改动，需要你手动更新 GitHub 的评论仓库的 `package.json` 文件。将其中的依赖 `@waline/vercel` 更新到最新版即可。

## 总结

没有什么是完美的，但我只需要选择当前较好的那一个。本文并不是什么广告来宣传 Waline，只是为了记录我配置 Waline 的过程，供有同样需求的朋友一个参考。

我看了怡红公子去年年底的文章和文章下方的评论区，发现在他写了那篇 Valine 存在一定安全问题的文章后，有图谋不轨的人盗用他的身份在 Valine 用户的评论区发布了大量垃圾广告，用以栽赃怡红公子。尽管他再三解释这是有人假冒他做的，但仍然遭到了不少人的谩骂。我也担心有人会盗用我的昵称和邮箱，到别人评论区作出低俗的操作。

这种事情是无法进行监管的。不论我使用哪个评论系统，总会有人使用安全性能较差的那一个，然后就会被恶意攻击。或许是我多虑了，不会有人关注到我这个小小的博客，不会总有人带着极度的恶意攻击互联网上素不相识的人。但我想，如果发生了这样的事，我可能会考虑再次关闭评论。