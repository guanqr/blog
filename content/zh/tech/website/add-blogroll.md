+++
title = "重构博客的友情链接"
date = "2019-12-04T21:08:01+08:00"
tags = ["hexo","hugo","meme","typography"]
series = ["create-a-blog"]
aliases = ["/study/blog/add-blogroll/"]
displayExpiredTip = true
+++

![blogroll-new-style.png](/images/blogroll-new-style.png "全新的友链设计")

就在昨天晚上，我看着我的博客友情链接的设计，觉得是时候改进一下了。因为我的友链在设计与添加两个方面都有一定的缺陷，在设计方面，与主题风格有些不符，而且由于宽度过窄，网站的说明文字字数受到了很大的限制，最多显示十二个汉字；在添加方面，因为没有在 HTML 中添加任何复杂语句，每次添加新友链的时候，都需要将网站名称、网站地址等基本信息插入到已有的标签中，操作过于繁琐。于是我参考了几个博客的友链设计样式与源码，自己构建了一个全新的友链页面。

目前绝大多数博客主题，不论是 Hexo 还是 Hugo 的主题，很少会自带友链页面模板的。就拿 Hexo 的 NexT 主题来说，该主题将友链放置在了侧栏中，只能够显示友链的名字，不能显示头像与博客的说明，导致友链的地位显得有些「低下」，而且空间大小受到了限制。我更喜欢单独将友链放置在一个页面中，这样就能向来访我的博客的人们..郑重..介绍我的朋友们和我喜欢的网站有哪些。

## 以前的友链设计

![blogroll-old-style.png](/images/blogroll-old-style.png "以前的友链页面")

之前的友链设计我参考的 [Sanarous](https://bestzuo.cn/) 这位博主的文章。他的博客采用的是旧版的 NexT 主题，从他的博客可以看出，他也是参考了很多博主的教程对博客进行了个性化改造，所以这个友链设计到底出自谁手，我也不太清楚😅。当初采用这个友链设计就是因为我只找到了这一种配置比较简单的教程。在主题下添加一个友链的模板，然后新建一个友链页面，引用该模板，再在配置文件中依照 YAML 语法添加每个博客的链接即可。但是现在我将博客从 Hexo 迁移到了 Hugo，博客主题结构发生了变化，直接将原来的友链添加方法「照搬」过来显然是不行的。由于当时也没有太多时间研究主题的文件结构，为了能快速建好友链页面，直接采用了最傻瓜的办法：将每个博客的信息用 HTML 语言一条一条地写进友链的 Markdown 文件中……😕

![blogroll-old-html.png](/images/blogroll-old-html.png "采用最傻瓜的办法添加友链")

## 全新的友链设计

这次我对友链页面的重构，适配了目前我采用的 Hugo 博客框架与 MemE 博客主题。而且可以采用添加网站信息至独立的 TOML 文件中，通过页面调取文件中的各项信息生成友链。比之前的傻瓜方式便捷了很多，而且文件结构层次分明，方便管理🍻。

首先是添加友链模板。为了避免因对原主题文件进行大规模修改而进行文件的大量替换，方面以后的主题更新，这里为友链创建一个全新的页面模板。首先在博客根目录下的 `layouts` 文件夹（没有该文件夹请自建）下创建一个名为 `blogroll` 的文件夹，在该文件夹下创建名为 `blogroll.html` 的模板文件。主题中的页面模板为 `~/themes/meme/layouts/partials/pages/` 目录下的 `post.html` 文件，可参照该文件内容进行添加。不过需要注意的是，随着主题的更新，该文件的内容可能会发生变化，目前我添加的代码如下所示。如果你使用的主题版本和我的不一样，请自行修改：

```html
<!-- 文件位置：~/layouts/blogroll/blogroll.html -->

{{ define "main" }}
    {{- $Deliver := . -}}
    <main class="main single" id="main">
        <div class="main-inner">
            <article class="content post">
                
                <h1 class="post-title">{{ .Title }}</h1>

                {{ if .Site.Params.displayPostDescription }}
                    {{ with .Params.description }}
                        {{- $raw := . -}}
                        <div class="post-description">{{ partial "utils/markdownify.html" (dict "Deliver" $Deliver "raw" $raw "isContent" false) }}</div>
                    {{ end }}
                {{ end }}

                <div class="post-body">
                    {{ range .Site.Data.blogroll }}
                        {{ range sort . "weight" }}
                            <div class="blogroll">
                                <img class="avatar" src="{{ .avatar }}"/>
                                <a class="friend" href="{{ .url }}" target="_blank">
                                    <div class="name">{{ .name }}</div>
                                    <div class="excerpt">{{ .description }}</div>
                                </a>  
                            </div>
                        {{ end }}
                    {{ end }}
                    {{ partial "utils/content.html" . }}
                </div>

            </article>

            {{ partial "components/comments.html" . }}

        </div>
    </main>
{{ end }}
```

这里我删减了许多没有用到的组件。代码中的核心部分如下：

```html
{{ range .Site.Data.blogroll }}
    {{ range sort . "weight" }}
        <a href="{{ .url }}" target="_blank">
            <div class="blogroll">
                <img class="avatar" src="{{ .avatar }}"/>
                <div class="friend">
                    <div class="name">{{ .name }}</div>
                    <div class="excerpt">{{ .description }}</div>
                </div>
            </div>
        </a>
    {{ end }}
{{ end }}
```

这里需要调用博客根目录 `data` 文件夹下的 `blogroll.toml` 中的数据，所以先在 `data` 下新建 `blogroll.toml` 文件，然后在该文件中添加友链的各项基本信息，比如：

```toml
[[blogroll]]
  name = "荷戟独彷徨"
  url = "https://guanqr.com"
  avatar = "https://guanqr.com/icons/android-chrome-512x512.png"
  description = "爱光学，爱生活，爱创造"
  weight = 1

[[blogroll]]
  name = "荷戟独彷徨"
  url = "https://guanqr.com"
  avatar = "https://guanqr.com/icons/android-chrome-512x512.png"
  description = "爱光学，爱生活，爱创造"
  weight = 2
```

其中，`weight` 表示该友链的权重，用来排序。然后当然是需要新建一个友链页面，运行命令 `hugo new blogroll/_index.md`。接着运行 `Hugo server -D` 检查友链是否显示出来，如果显示正常，那么就可以继续添加 CSS 样式。在自定义 CSS 样式的文件 `custom.scss` 中添加下面的样式：

```scss
// 文件位置：~/assets/scss/custom/_custom.scss

.blogroll {
    padding: 1em 0;
    border: 2px solid transparent;
    border-bottom: 1px dashed var(--color-contrast-low);
    display: flex;
    transition: all .5s;
    .friend {
        text-decoration: none;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .name {
        font-weight: bold;
        margin: 0.375em 0;  
    }
    .excerpt {
        font-size: 0.875em;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .avatar {
        width: 4em !important;
        height: 4em !important;
        margin: 0 1em 0 0 !important;
        z-index: 0;
    }
}
```

这样一个全新的友链页面就添加完成啦。为了将友链的页面样式和使用 TOML 记录友链信息，我花了一晚上的时间去研究🧐，功夫不负有心人，最终还是完成了它。所以写这一篇文章的目的，一是为了记录我的心血，二是为了分享这一不太复杂的成果😆。