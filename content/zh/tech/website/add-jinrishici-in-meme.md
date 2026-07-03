+++
title = "在 MemE 主题页脚添加今日诗词"
date = "2021-03-22T17:16:54+08:00"
lastmod = "2021-03-28T9:48:32+08:00"
tags = ["hugo","meme"]
series = ["create-a-blog"]
dropCap = false
+++

## 何为「今日诗词」

> 今日诗词 API 是一个可以返回一句古诗词名句的接口。它可以通过图片和 JSON 格式调用。今日诗词 API 根据不同地点、时间、节日、季节、天气、景观、城市进行智能推荐。

也就是说，在博客中的某个位置调用今日诗词 API，即可在该位置显示一句诗词，而且会根据浏览者的环境智能推荐相关诗词。我曾经在《[Hexo-NexT 主题个性优化](/tech/website/hexo-theme-next-customization/)》一文中介绍了给 Hexo 博客添加今日诗词的方法，但因为当时我并没有想过要在自己的博客中添加这个功能，所以这部分内容是完全照搬其他博主的，诗句显示的格式并不是我想要的格式，且仅适用于当时的 NexT 主题，有很大的局限性。如今我转入使用 Hugo 博客，想给自己平淡的博客中增添一些文化色彩，于是决定在页脚插入今日诗词。

## 添加方法

首先我们先了解一下使用今日诗词 API 接口返回的 JSON 数据都有什么：

```json
{
    "status": "success",
    "data": {
        "id": "5b8b9572e116fb3714e6faba",
        "content": "君问归期未有期，巴山夜雨涨秋池。",
        "popularity": 1170000,
        "origin": {
            "title": "夜雨寄北",
            "dynasty": "唐代",
            "author": "李商隐",
            "content": [
                "君问归期未有期，巴山夜雨涨秋池。",
                "何当共剪西窗烛，却话巴山夜雨时。"
            ],
            "translate": [
                "您问归期，归期实难说准，巴山连夜暴雨，涨满秋池。",
                "何时归去，共剪西窗烛花，当面诉说，巴山夜雨况味。"
            ]
        },
        "matchTags": [
            "秋",
            "晚上"
        ],
        "recommendedReason": "",
        "cacheAt": "2018-09-17T21:18:44.693645"
    },
    "token": "6453911a-9ad7-457e-9b9d-c21011b85a0c",
    "ipAddress": "162.248.93.154"
}
```

其中：

+ `data.content` 是核心，即推荐的诗句；
+ `data.matchTags` 是与你相关的标签，也是推荐给你的部分理由；
+ `data.recommendedReason` 是推荐原因，暂未支持；
+ `data.cacheAt` 是指会对每个 Token 进行预生成推荐数据并缓存。正常情况下会 10 分钟更新一次缓存数据；
+ `data.popularity` 是对这句诗的流行度评价；
+ `data.origin` 源诗信息；
+ `data.origin.translate` 是整诗翻译，部分诗词有，部分没有；
+ `token` 是当前用户的 Token，原则上，同一个用户，一段时间内 Token 应该不变；
+ `ipAddress` 是当前用户的 IP，如果 IP 有异常，您需要查明您是否在服务端调用。[^1]

虽然说调用的 API 可返回的内容有很多，但因为我是想在博客的页脚插入今日诗词，内容不宜过多，最好在手机端也能一至两行显示完整，所以我决定只调用「诗句」和「作者」两个元素。且诗句和作者之间用破折号「——」连接。

在 MemE 主题的自定义页脚文件中添加以下代码即可：

```html
<!-- 文件位置：~/layouts/partials/custom/footer.html -->

<script src="https://sdk.jinrishici.com/v2/browser/jinrishici.js" charset="utf-8"></script>
<text class="poem_sentence"></text>
<text class="poem_info"></text>
<script type="text/javascript">
  jinrishici.load(function(result) {
    var sentence = document.querySelector(".poem_sentence")
    var info = document.querySelector(".poem_info")
    sentence.innerHTML = result.data.content
    info.innerHTML = '——' + result.data.origin.author
  });
</script>
```

[^1]: 这部分内容摘自今日诗词的[官方文档](https://www.jinrishici.com/doc/)，如有改动请以官方文档为准。