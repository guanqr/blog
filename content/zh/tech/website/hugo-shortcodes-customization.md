+++
title = "自定义 Hugo Shortcodes 简码"
date = "2020-06-06T19:28:42+08:00"
tags = ["hugo","typography"]
series = ["create-a-blog"]
+++

目前我的博客采用 Hugo 框架，使用 Markdown 进行写作。Markdown 语法的特点是简洁，但有时我们在写作的过程中需要插入一些特殊的样式，然而 Markdown 并没有相对应的语法，我们就不得不额外插入一些 HTML 语言。Hugo 提供了简码（Shortcodes）的功能，我们事先设定好某种样式的模板和对应的简码，当你需要插入这种样式的时候，直接使用简码插入，Hugo 能够自动将其转化为 HTML 语言。这样便节省了书写大量繁琐的 HTML 语言的时间。

Hugo 在其官网上介绍了[自带的一些简码的形式](https://gohugo.io/content-management/shortcodes/)和[自定义简码的方法](https://gohugo.io/templates/shortcode-templates/)。对于官方自带简码的介绍和如何插入简码，请阅读上述的两篇文章，这里不再赘述。下面我来分享一些我的博客目前使用的自定义简码。需要注意的是，部分简码需要搭配 MemE 主题使用，如果你使用的是其他主题，可能需要做适当的修改。

## align

这个简码的功能是设定文字的位置（居左、居中、居右、两端对齐等等），支持的样式基于 CSS 语法。你需要在 `~/layouts/shortcodes/` 下创建 `align.html` 文件，其内容如下：

```html
<!-- 文件位置：~/layouts/shortcodes/align.html -->

<p style="text-align:{{ index .Params 0 }}">{{ index .Params 1 | markdownify }}</p>
```

具体简码和样式如下：

```markdown
{{</* align left "文字居左" */>}}
```

{{< align left "文字居左" >}}

```markdown
{{</* align center "文字居中" */>}}
```

{{< align center "文字居中" >}}

```markdown
{{</* align right "文字居右" */>}}
```

{{< align right "文字居右" >}}

## github

这个简码的功能是插入 GitHub 仓库。有时候我们会在文中分享某个 GitHub 仓库，但如果只是放一个超链接，样式有些单一，不能吸引读者的注意力。所以我模仿 GitHub 仓库的形式写了这个简码。首先创建 `github.html` 文件，内容如下所示：

```html
<!-- 文件位置：~/layouts/shortcodes/github.html -->

<div class="github">
    <div class="logo">
        {{ replace $.Site.Data.SVG.repository "icon" "icon github-icon" | safeHTML }}
        <a class="name" href={{ .Get "link" }} target="_blank">{{ .Get "name" }}</a>
    </div>
    <div class="description">{{ .Get "description" }}</div> 
    <div class="language">
        <span class="language-color" style="background-color: {{ .Get "color" }}"></span>
        <span class="language-name">{{ .Get "language" }}</span>
    </div>
</div>
```

然后添加自定义 CSS 样式。在 `~/assets/scss/custom/_custom.scss` 文件中添加如下内容：

```scss
// 文件位置：~/assets/scss/custom/_custom.scss

.github {
    border: 1px solid var(--color-contrast-low);
    border-radius: 3px;
    margin: 0 auto;
    margin-bottom: 1em;
    padding: 1em;
    .github-icon {
        width: 1.2em;
        height: 1.2em;
        margin-right: 0.5em;
        margin-bottom: 0.2em;
        fill: var(--color-contrast-high);
        transition: all .5s;
    }
    .name {
        font-weight: bold;
        color: var(--color-primary);
        text-decoration: none;
    }
    .description {
        margin-top: 0.5em;
        margin-bottom: 1em;
        color: var(--color-contrast-high);
        text-align: justify;
        font-size: 90%;
        transition: all .5s;
    }
    .language-color {
        position: relative;
        top: 1px;
        display: inline-block;
        width: 0.75em;
        height: 0.75em;
        border-radius: 50%;
    }
    .language-name {
        color: var(--color-contrast-high);
        font-size: 90%;
        margin-left: 0.5em;
        transition: all .5s;
    }
}
```

最后需要在 `~/data/SVG.toml` 文件中插入图标：

```toml
# 文件位置：~/data/SVG.toml

# GitHub Icon
repository = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 2.5C2 1.83696 2.26339 1.20107 2.73223 0.732233C3.20108 0.263392 3.83696 0 4.5 0L13.25 0C13.4489 0 13.6397 0.0790176 13.7803 0.21967C13.921 0.360322 14 0.551088 14 0.75V13.25C14 13.4489 13.921 13.6397 13.7803 13.7803C13.6397 13.921 13.4489 14 13.25 14H10.75C10.5511 14 10.3603 13.921 10.2197 13.7803C10.079 13.6397 10 13.4489 10 13.25C10 13.0511 10.079 12.8603 10.2197 12.7197C10.3603 12.579 10.5511 12.5 10.75 12.5H12.5V10.5H4.5C4.30308 10.5 4.11056 10.5582 3.94657 10.6672C3.78257 10.7762 3.65442 10.9312 3.57816 11.1128C3.50191 11.2943 3.48096 11.4943 3.51793 11.6878C3.5549 11.8812 3.64816 12.0594 3.786 12.2C3.92524 12.3422 4.0023 12.5338 4.00024 12.7328C3.99818 12.9318 3.91716 13.1218 3.775 13.261C3.63285 13.4002 3.4412 13.4773 3.24222 13.4752C3.04325 13.4732 2.85324 13.3922 2.714 13.25C2.25571 12.7829 1.99929 12.1544 2 11.5V2.5ZM12.5 1.5V9H4.5C4.144 9 3.806 9.074 3.5 9.208V2.5C3.5 2.23478 3.60536 1.98043 3.79289 1.79289C3.98043 1.60536 4.23478 1.5 4.5 1.5H12.5ZM5 12.25V15.5C5 15.5464 5.01293 15.5919 5.03734 15.6314C5.06175 15.6709 5.09667 15.7028 5.1382 15.7236C5.17972 15.7444 5.22621 15.7532 5.27245 15.749C5.31869 15.7448 5.36286 15.7279 5.4 15.7L6.85 14.613C6.89328 14.5805 6.94591 14.563 7 14.563C7.05409 14.563 7.10673 14.5805 7.15 14.613L8.6 15.7C8.63714 15.7279 8.68131 15.7448 8.72755 15.749C8.77379 15.7532 8.82028 15.7444 8.8618 15.7236C8.90333 15.7028 8.93826 15.6709 8.96266 15.6314C8.98707 15.5919 9 15.5464 9 15.5V12.25C9 12.1837 8.97366 12.1201 8.92678 12.0732C8.87989 12.0263 8.81631 12 8.75 12H5.25C5.1837 12 5.12011 12.0263 5.07322 12.0732C5.02634 12.1201 5 12.1837 5 12.25Z"/></svg>'
```

你需要在简码中填写仓库名 `name`，仓库链接 `link`，仓库描述 `description`，代码语言 `language`，代码语言对应的颜色 `color`。

具体简码和样式如下：

```markdown
{{</* github name="Organic-Carbon-Estimating" link="https://github.com/guanqr/Organic-Carbon-Estimating" description="A program used in estimating organic carbon stocks in oceans. 计算指定海域的有机碳存量，包括颗粒有机碳与溶解有机碳，数据依赖于 NASA 中分辨率成像光谱仪 MODIS 遥感产品。" color="#e16737" language="MATLAB" */>}}
```

{{< github name="Organic-Carbon-Estimating" link="https://github.com/guanqr/Organic-Carbon-Estimating" description="A program used in estimating organic carbon stocks in oceans. 计算指定海域的有机碳存量，包括颗粒有机碳与溶解有机碳，数据依赖于 NASA 中分辨率成像光谱仪 MODIS 遥感产品。" color="#e16737" language="MATLAB" >}}

## notice

之前在使用 Hexo 的 NexT 主题的时候，主题中自带了很多标签样式，其中就有一个类似的提示标签。在 Hugo 中，也有人写了一个类似的简码：

{{< github name="martignoni / hugo-notice" link="https://github.com/martignoni/hugo-notice" description="A Hugo theme component to display nice notices" color="#e34c26" language="HTML">}}

如果你在 MenM 主题中直接使用这个短代码的话，其样式会有一些错误。因此我对原有的代码进行了小小的修改，改成了和 Hexo 的 NexT 主题 Note 标签类似的样式。

首先创建 `notice.html` 文件，内容如下所示：

```html
<!-- 文件位置：~/layouts/shortcodes/notice.html -->

<!--https://github.com/martignoni/hugo-notice-->
{{- $noticeType := .Get 0 -}}

{{- $raw := (markdownify .Inner | chomp) -}}

{{- $block := findRE "(?is)^<(?:address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h(?:1|2|3|4|5|6)|header|hgroup|hr|li|main|nav|noscript|ol|output|p|pre|section|table|tfoot|ul|video)\\b" $raw 1 -}}

{{ $icon := (replace (index $.Site.Data.SVG $noticeType) "icon" "icon notice-icon") }}
<div class="notice {{ $noticeType }}" {{ if len .Params | eq 2 }} id="{{ .Get 1 }}" {{ end }}>
    <div class="notice-title">{{ $icon | safeHTML }}</div>
    {{- if or $block (not $raw) }}{{ $raw }}{{ else }}<p>{{ $raw }}</p>{{ end -}}
</div>
```

然后添加自定义 CSS 样式：

```scss
// 文件位置：~/assets/scss/custom/_custom.scss

.notice {
    position:relative;
    padding: 1em 1em 1em 2.5em;
    margin-bottom: 1em;
    border-radius: 4px;
    p:last-child {
        margin-bottom: 0;
    }
    .notice-title {
        position: absolute;
        left: 0.8em;
        .notice-icon {
            width: 1.2em;
            height: 1.2em;
        }
    }
    &.notice-warning {
        background: hsla(0, 65%, 65%, 0.15);
        border-left: 5px solid hsl(0, 65%, 65%);
        .notice-title {
            color: hsl(0, 65%, 65%);
        }
    }
    &.notice-info {
        background: hsla(30, 80%, 70%, 0.15);
        border-left: 5px solid hsl(30, 80%, 70%);
        .notice-title {
            color: hsl(30, 80%, 70%);
        }
    }
    &.notice-note {
        background: hsla(200, 65%, 65%, 0.15);
        border-left: 5px solid hsl(200, 65%, 65%);
        .notice-title {
            color: hsl(200, 65%, 65%);
        }
    }
    &.notice-tip {
        background: hsla(140, 65%, 65%, 0.15);
        border-left: 5px solid hsl(140, 65%, 65%);
        .notice-title {
            color: hsl(140, 65%, 65%);
        }
    }
}

[data-theme="dark"] .notice {
    &.notice-warning {
        background: hsla(0, 25%, 35%, 0.15);
        border-left: 5px solid hsl(0, 25%, 35%);
        .notice-title {
            color: hsl(0, 25%, 35%);
        }
    }
    &.notice-info {
        background: hsla(30, 25%, 35%, 0.15);
        border-left: 5px solid hsl(30, 25%, 35%);
        .notice-title {
            color: hsl(30, 25%, 35%);
        }
    }
    &.notice-note {
        background: hsla(200, 25%, 35%, 0.15);
        border-left: 5px solid hsl(200, 25%, 35%);
        .notice-title {
            color: hsl(200, 25%, 35%);
        }
    }
    &.notice-tip {
        background: hsla(140, 25%, 35%, 0.15);
        border-left: 5px solid hsl(140, 25%, 35%);
        .notice-title {
            color: hsl(140, 25%, 35%);
        }
    }
}
```

最后同样需要在 `~/data/SVG.toml` 文件中插入图标：

```toml
# 文件位置：~/data/SVG.toml

# Notice Icon
notice-warning = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512"><path d="M570 440c18 32-5 72-42 72H48c-37 0-60-40-42-72L246 24c19-32 65-32 84 0l240 416zm-282-86a46 46 0 100 92 46 46 0 000-92zm-44-165l8 136c0 6 5 11 12 11h48c7 0 12-5 12-11l8-136c0-7-5-13-12-13h-64c-7 0-12 6-12 13z"/></svg>'
notice-info = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><path d="M256 8a248 248 0 100 496 248 248 0 000-496zm0 110a42 42 0 110 84 42 42 0 010-84zm56 254c0 7-5 12-12 12h-88c-7 0-12-5-12-12v-24c0-7 5-12 12-12h12v-64h-12c-7 0-12-5-12-12v-24c0-7 5-12 12-12h64c7 0 12 5 12 12v100h12c7 0 12 5 12 12v24z"/></svg>'
notice-note = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><path d="M504 256a248 248 0 11-496 0 248 248 0 01496 0zm-248 50a46 46 0 100 92 46 46 0 000-92zm-44-165l8 136c0 6 5 11 12 11h48c7 0 12-5 12-11l8-136c0-7-5-13-12-13h-64c-7 0-12 6-12 13z"/></svg>'
notice-tip = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512"><path d="M504 256a248 248 0 11-496 0 248 248 0 01496 0zM227 387l184-184c7-6 7-16 0-22l-22-23c-7-6-17-6-23 0L216 308l-70-70c-6-6-16-6-23 0l-22 23c-7 6-7 16 0 22l104 104c6 7 16 7 22 0z"/></svg>'
```

具体简码和样式如下：

```markdown
{{</* notice notice-warning */>}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{</* /notice */>}}
```

{{< notice notice-warning >}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{< /notice >}}

```markdown
{{</* notice notice-info */>}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{</* /notice */>}}
```

{{< notice notice-info >}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{< /notice >}}

```markdown
{{</* notice notice-note */>}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{</* /notice */>}}
```

{{< notice notice-note >}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{< /notice >}}

```markdown
{{</* notice notice-tip */>}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{</* /notice */>}}
```

{{< notice notice-tip >}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{< /notice >}}

## quote

这个简码是用来替代 Mardown 默认的引用样式。我常常将这个简码插入到随笔的引用中。首先创建 `quote.html` 文件，其内容如下：

```html
<!-- 文件位置：~/layouts/shortcodes/quote.html -->

<blockquote class="quote{{ range .Params }} {{ . }}{{ end }}">
    {{- $content := .Inner | markdownify -}}
    {{- if not (strings.HasPrefix $content "<p>") }}
        {{ printf `<p>%s</p>` $content | safeHTML }}
    {{- else }}
        {{- $content }}
    {{- end -}}
</blockquote> 
```

然后添加自定义 CSS 样式：

```scss
// 文件位置：~/assets/scss/custom/_custom.scss

blockquote.quote {
    position: relative;
    margin: 2em auto;
    padding-left: 3em;
    border: none;
    &::before {
        position: absolute;
        left: 0;
        content: '“';
        color: var(--color-contrast-low);
        font-family: 'JetBrains Mono', 'Amstelvar', 'Noto Serif SC', serif;
        font-size: 3em;
        font-weight: bold;
        line-height: 1;
    }
    &.poetry {
        display: table;
        padding: 0;
        &::before {
            left: -1em;
        }
        p:last-child {
            margin: 0;
        }
    }
    &.en {
        p {
            line-height: 1.618;
            text-align: left;
            hyphens: auto;
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
        }
    }
}
@media (max-width: $maxWidth) {
    blockquote.quote {
        &.poetry {
            padding-left: 3em;
            &::before {
                left: 0;
            }
        }
    }
}
```

具体简码和样式如下：

中文：

```markdown
{{</* quote */>}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{</* /quote */>}}
```

{{< quote >}}
十里青山远，潮平路带沙。数声啼鸟怨年华。又是凄凉时候，在天涯。白露收残月，清风散晓霞。绿杨堤畔问荷花。记得年时沽酒，那人家。
{{< /quote >}}

英文：

```markdown
{{</* quote en */>}}
To see a world in a grain of sand. And a heaven in a wild flower. Hold infinity in the palm of your hand. And eternity in an hour.
{{</* /quote */>}}
```

{{< quote en >}}
To see a world in a grain of sand. And a heaven in a wild flower. Hold infinity in the palm of your hand. And eternity in an hour.
{{< /quote >}}

## quote-center

这是一个用于居中引用的简码，其样式也是借鉴自 Hexo 的 NexT 主题。首先创建 `quote-center.html` 文件，其内容如下：

```html
<!-- 文件位置：~/layouts/shortcodes/quote-center.html -->

<blockquote class="quote-center">
    {{- $content := .Inner | markdownify -}}
    {{- if not (strings.HasPrefix $content "<p>") }}
        {{ printf `<p>%s</p>` $content | safeHTML }}
    {{- else }}
        {{- $content }}
    {{- end -}}
</blockquote> 
```

然后添加自定义 CSS 样式：

```scss
// 文件位置：~/assets/scss/custom/_custom.scss

blockquote.quote-center {
    position: relative;
    border-left: none;
    padding-left: 0;
    border-top: 1px solid var(--color-contrast-lower);
    border-bottom: 1px solid var(--color-contrast-lower);
    p{
        text-align: center !important;
        margin-top: 1.5em;
        margin-bottom: 1.5em;
    }
    &::before {
        position: absolute;
        left: 0;
        content: '“';
        color: var(--color-contrast-low);
        font-size: 3em;
        font-weight: bold;
        margin-top: -0.42em;
    }
    &::after {
        position: absolute;
        right: 0;
        content: '”';
        color: var(--color-contrast-low);
        font-size: 3em;
        font-weight: bold;
        margin-top: -0.7em;
    }
}
```

具体简码和样式如下：

```markdown
{{</* quote-center */>}}
十里青山远，潮平路带沙<br>数声啼鸟怨年华<br>又是凄凉时候，在天涯<br>白露收残月，清风散晓霞<br>绿杨堤畔问荷花<br>记得年时沽酒，那人家
{{</* /quote-center */>}}
```

{{< quote-center >}}
十里青山远，潮平路带沙<br>数声啼鸟怨年华<br>又是凄凉时候，在天涯<br>白露收残月，清风散晓霞<br>绿杨堤畔问荷花<br>记得年时沽酒，那人家
{{< /quote-center >}}

---

注：因为简码的具体形式写出来会直接被 Hugo 转义渲染，所以需要在简码的括号内加入 `/* */` 来防止被转义[^1]。即你需要在 Markdown 中输入：

```markdown
{{</*/* myshortcode */*/>}}
```

渲染出来的结果是：

```markdown
{{</* myshortcode */>}}
```

[^1]: 参考：[如何在代码块里内嵌 HUGO 的简码 (SHORTCODES) | 消夏錄](https://tin6.com/post/how-to-escape-hugo-shortcodes-within-hugo-markdown/)