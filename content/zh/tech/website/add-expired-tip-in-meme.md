+++
title = "在 MemE 主题文章开头添加过时提醒"
date = "2021-03-29T20:40:27+08:00"
lastmod = "2021-03-29T22:57:16+08:00"
tags = ["hugo","meme"]
series = ["create-a-blog"]
+++

在浏览别人的博客的时候，偶尔会看到一些博主所写文章的开头或者结尾标记了一句话，大致是说，「这篇文章写于/更新于 xxx 天前，已经很久没有更新了，文中所讲的内容可能已经过时。」我觉得这句话很有必要放在一些技术类的文章中。因为科技发展太快了，技术类文章大多具有时效性。比如某人在某个依赖环境下编写了一段代码，将这段代码分享到了网上，几个月后这个环境更新换代了，那么这段代码也就失效了。这时候一些尝试新环境的人在网上搜索相关问题，往往搜索到的是旧代码。他们费半天劲将环境配置好，将代码写好，运行后只有报错。所以在技术类的文章中增加一个该文章已经过时的提醒很有必要，告诉浏览这篇文章的人，如果你没有充足时间的话，没有必要浪费时间去钻研一个过时的东西。

我对这项功能也有需求。因为我早期写了一些关于 Hexo 博客搭建和优化的文章，里面的方法仅适用于当时的版本，如今 Hexo 的很多设定已经发生了改变，我的那些文章就没有什么参考价值了。作为一个代码搬运工，为了实现这一功能，我优先考虑的是复制别人已有的代码。但我查阅了那些使用该项功能博客的源码仓库或是主题仓库，都没有发现相应代码。那么只能自己写了。

先说说设计的思路吧。在功能上：

1. 文章过时的判别标准是现在的时间与创作时间相比还是与更新时间相比？我认为，和更新时间相比较好。创作时间即使距现在很久远，但文章存在实时更新的可能。文章页标题下方的元素中含有更新时间，如果仅仅按照创作时间进行提醒，那么更新时间这个元素就显得没有什么意义。过时提醒这个功能，就是为了给文章的更新时间进行进一步强调。
2. 不是所有的文章都需要过时提醒。生活类的文章不需要，技术类的文章超出一定时间未更新的需要。那么就不方便直接在主题的模板中添加该模块的代码，应该单独写成一个组件存放在 `partials` 的 `components` 中。不必给每一篇技术类文章都增加该组件，然后根据一个函数判断到达某个时长后「过时」成立。比较简单的方法就是直接给需要添加过时提醒的文章增加该组件，增加组件后直接显示该文章已过时。

在布局上：

1. 放置在文章开头比放置在结尾更为有效。如果放置在文章结尾，读者很可能会在阅读完文章后才发现这篇文章已经过时。
2. 过时提示的区域要与正文区分。比如改变文字的颜色或改变文字背景的颜色。颜色不宜过深，要和页面背景配合融洽，且能够随着主题亮暗改变作出相应的改变。

组件设计的方法可以参考 MemE 主题的其他组件内容。首先在博客根目录的 `/partials/components/` 文件夹（没有请自建）下新建文件，命名为 `expired-tip.html`。其代码如下：

```html
{{ if and .Site.Params.enableExpiredTip (.Params.displayExpiredTip | default .Site.Params.displayPostExpiredTip) }}

<time id="LastmodTime" datetime="{{ $.Lastmod.Format "2006-1-2" }}"></time>
<div id="expiredTip"></div>

<script>
    function GetNumberOfDays(date1,date2){ // 获得天数，date1 开始日期，date2 结束日期
        var a1 = Date.parse(new Date(date1));
        var a2 = Date.parse(new Date(date2));
        var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); // 核心：时间戳相减，然后除以天数
        return day
    };

    var date = new Date();
    var ny = date.getFullYear();
    var nm = date.getMonth() + 1;
    var nd = date.getDate();

    var a1 = document.getElementById("LastmodTime").dateTime;
    var a2 = ny + "-" + nm + "-" + nd;
    var num = GetNumberOfDays(a1,a2);

    var str1 = '{{ i18n "expiredTipHead"}}'
    var str2 = '{{ i18n "expiredTipTail"}}'

    document.getElementById("expiredTip").innerHTML = str1 + "&nbsp;" + num + "&nbsp;" + str2;
</script>

{{ end }}
```

可以看到，代码的核心就是利用 JavaScript 计算相差的天数。代码的第一行是判断是否开启过时提醒功能。相应的，需要在博客配置文件 `config.toml` 中的 `[params]` 下添加：

```toml
# 自定义文章时效性提醒

# 是否开启
enableExpiredTip = true
# 是否显示（全局设置）
displayPostExpiredTip = false
# 说明：文章的 Front Matter 中的 
# `displayExpiredTip` 的优先级高于此处
```

代码中的 `{{ i18n }}` 部分，则是对应的语言翻译。如果是中文，则在博客根目录下的 `i18n` 文件夹（没有请自建）创建中文翻译文件 `zh.toml`，内容为：

```toml
[expiredTipHead]
other = "本文最后更新于"

[expiredTipTail]
other = "天前，文中所描述的信息可能已发生改变，请谨慎使用文中的方法。"
```

英文则在同一文件夹下创建  `en.toml`，内容为：

```toml
[expiredTipHead]
other = "This article was last updated"

[expiredTipTail]
other = "days ago. The information described in this article may have changed. Please use the method carefully."
```

最后，如果某篇文章需要增加过时提醒，则在文章的 Front Matter 中插入 `displayExpiredTip = true` 即可。