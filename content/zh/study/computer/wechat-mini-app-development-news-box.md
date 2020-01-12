+++
title = "一个失败的课程设计"
description = "微信小程序「新闻盒子」设计，「微信小程序开发实践」课程回顾与总结"
date = "2020-01-07T22:37:21+08:00"
tags = ["wechat","typography","zju"]
dropCap = true
displayCopyright = true
gitinfo = true
toc = false
+++

![wechat-mini-app.png](/images/wechat-mini-app.png)

据说微信小程序的开发是计算机学院暑假短学期的一门课程，因为我并非计算机专业的学生，所以无法选修该门课程。不过在 2019 年秋冬学期的选课中，我竟发现计算机学院开设了一门名叫「微信小程序开发实践」的通识课程。这门课程的上课地点在紫金港，虽然我已搬到玉泉，不过既然有这样一门开发微信小程序的课程，为何不抓住这一机会呢？在几乎十比一的选中概率下，我这样一个「选课非酋」居然幸运地选上了这门课程。

## 课程介绍

首先需要说明的一点是，这门课程虽然属于学校的通识选修课程，面向对象也是全校各专业的学生，但是对于非工科类学生以及大一新生等没有学过编程的学生极不友好。不过我看在 2020 年的选课系统中并没有这门课程，想必是因为上述原因外加授课教师时间不充足导致课程停开。

由于这门课程是横跨秋冬两个学期的课程，在教学安排上面，秋学期主要讲解网页设计前端的基础（HTML，CSS，JavaScript），冬学期则是使用微信小程序的开发工具进行小程序的开发，总共分为六次实验，最后的考核是三人一组完成一个大作业项目。我对这门课程并不是很满意，原因如下：

1. 选课的时候，在课程介绍上，我看到这门课程会讲一些后端开发的内容，但实际上并没有怎么涉及到。
2. 授课教师是计算机学院一位学生评分很高的教授，但是他对讲授这门课的态度不太认真。课堂上有一半的时间都是让助教上台讲课，自己下台休息。
3. 前端基础知识的讲解耗费了很长时间，教师并没有对当天课程的授课内容进行合理规划，完全是想到哪里讲哪里，对知识点没有进行系统性地讲解。
4. 课程的重点应该是小程序的开发，但是在冬学期时，对小程序开发的讲解只花费了一节课的时间，剩下的时间全部是让学生依照实验指导书进行上机实验，对于小程序开发的很多问题都得不到解决。
5. 六次实验已经耗费了很多精力，最后仍需要三人一组完成一个项目设计并进行答辩，不符合通识课程的定位。以至于在期末复习阶段，在复习专业课程知识的同时，还需要操该门课程的任务。
6. 和我同一组的组员缺少上进心，全程划水，我作为组长分配给每个人的任务，上交的时候只能完成目标的三分之一。我要求每个人完成一个页面的设计，数据单独存放，页面内的元素单独构成组件（component），使用 JavaScript 对数据进行传递，但这些工作都是由我一人完成的，他们均以不会为由偷工减料。

我对于这门课程的分数高低并不太关心，早已修够了通识课程的学分，选这一门课程只是为了对前端知识进行巩固和学习如何开发小程序。我们制作的这一「新闻盒子」只能处于全班的中下等水平。因为别的组三个人都能为了自己的项目呕心沥血，但我们组的成员毫不放在心上，完全依靠我一个人。但恰好我正是那个没有时间肝项目的人，毕竟在这段时间里，我一直在为[某一论文的写作](/life/school/2020-new-year-night/)发愁。

目前「新闻盒子」只能算是个半成品吧，有很多不尽人意的地方。

## 程序设计

其实最初我的想法是将博客的内容移植到小程序中，但是毕竟 HTML / CSS 和 WXML / WXSS 还是存在一定的差异，我们决定做一款发布新闻的类博客小程序。

### 整体规划

预期功能：

+ 第一个页面是「新闻列表」，列出全部的文章名和作者。点击即可进入「文章详情」页面；
+ 第二个页面是「分类目录」，将文章分为不同的类别，点击类别，跳转到文章的「分类详情」页面，样式与「新闻列表」相同，再点击文章即可进入「文章详情」页面；
+ 第三个页面是「个人中心」，在该页面设置查看收藏的文章，小程序的问题反馈等等功能。
+ 在页面中添加评论功能。

其实静态页面的设计很简单，按照预期，总共分为三个主页面，通过 `tabBar` 跳转：

```json
{
  "//": "文件位置：~/app.json"

  "tabBar": {
    "position": "bottom",
    "selectedColor": "#0e932e",
    "list": [
      {
        "pagePath": "pages/news/news",
        "text": "新闻列表",
        "iconPath": "images/news_inactive.png",
        "selectedIconPath": "images/news_active.png"
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类目录",
        "iconPath": "images/category_inactive.png",
        "selectedIconPath": "images/category_active.png"
      },
      {
        "pagePath": "pages/user/user",
        "text": "个人中心",
        "iconPath": "images/user_inactive.png",
        "selectedIconPath": "images/user_active.png"
      }
    ]
  }
}
```

首先确认文章内容的存放方式。我选择的是按照文章类别进行存放，这样在「分类目录」实现页面跳转与数据传递较为方便。因为时间有限，我们最初并没有考虑将文章内容存放至云端数据库，只考虑保存在本地的 `~/datas/categoryList.js` 中，每个类别的文章数据存放如下所示：

```javascript
var polity = [
  {
    "id": 1,
    "title": "",
    "author": "", 
    "time": "",
    "category": "",
    "image": "",
    "body1": "",
    "body2": "",
    "body3": "",
    "body4": ""
  }
]

var tech = [
]

var life = [
]

var health = [
]

var sport = [
]

var military = [
]

module.exports = {
  polity: polity,
  tech: tech,
  life: life,
  health: health,
  sport: sport,
  military: military
}
```
因为小程序 WXML 没有 `<br>` 语法，无法自然换行分段。因为每篇新闻的字数不会太多，所以考虑每篇文章最多分为四个段落，分别存放在 `body1` 到 `body4` 中。

### 新闻列表

![wechat-mini-app-page-0.png](/images/wechat-mini-app-page-0.png "新闻列表")

「新闻列表」中显示的是每一篇文章的封面图、标题和作者（来源），因此可以构建成一个组件，方便调用。在根目录新建 `components` 文件夹存放组件，比如新闻列表的文章显示组件名为 timeCard，那么在 `components` 文件夹下新建 `timeCard` 文件夹，在微信开发者工具中右击该文件夹，新建 Component ，命名为 `timeCard` 即可。这时候就会自动生成：`timeCard.js`、`timeCard.json`、`timeCard.wxml`、`timeCard.wxss`四个文件。

小程序调用组件的方式很简单，在你需要调用的页面的 `json` 文件中引入该组件即可。「新闻列表」所在的页面为 `news.wxml`，则在 `news.json` 中引入：

```diff
{
  "usingComponents": {
+   "timeCard": "../../components/timeCard/timeCard"
  },
  "navigationBarTitleText": "新闻列表"
}
```
该组件的样式具体设定为：

`timeCard.js`：

```javascript
// components/timeCard/timeCard.js

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  methods: {
    handleHot: function (e) {
      wx.navigateTo({
        url: `../post/post?title=${this.data.item.title}&author=${this.data.item.author}&time=${this.data.item.time}&image=${this.data.item.image}&category=${this.data.item.category}&body1=${this.data.item.body1}&body2=${this.data.item.body2}&body3=${this.data.item.body3}&body4=${this.data.item.body4}`,
      })
    }
  }
})
```

`methods` 中设置的是触发 `handleHot` 事件进行的函数，这里是传递数据到「文章详情」页面 `post`。

`timeCard.wxml`：

```html
<!--components/timeCard/timeCard.wxml-->

<view class='newsdetail' bindtap="handleHot">
   <view class='news-pics'>
       <image class='picture' src="{{item.image}}" mode="aspectFill">
        <view class='news-title'>
          <text class='title'>{{item.title}}</text>
          <text class='author'>{{item.author}}</text>
        </view>
       </image>
   </view>
</view>
```

其中，诸如 `{{item.image}}` 等内容调用的即为 `categoryList.js` 中的数据。对于数据的调用以及传递，在下一章节中会详细讲解。

`timeCard.wxss`：

```css
/* components/timeCard/timeCard.wxss */

.page {
  height: 100%;
}
.newsdetail {
  background-color: #fff;
  display: flex;
  align-items: center;
  width: 100%;
}
.news-pics {
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 0;
}
.picture {
  width: 100%;
  z-index: 0;
  position: relative;
}
.news-title {
  background-color: black;
  opacity: 0.75;
  height: 125rpx;
  position: absolute;
  left: 0rpx;
  bottom: 0rpx;
  align-items: center;
  z-index: 1;
  width: 100%;
  padding-top: 20rpx;
}
.title {
  width: 550rpx;
  overflow: hidden;
  color: snow;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
  font-size: 36rpx;
  z-index: 2;
  margin: 20rpx;
}
.author {
  margin: 20rpx 5rpx 10rpx 20rpx;
  font-size: 26rpx;
  display: flex;
  color: ghostwhite;
  z-index: 2;
}
```

### 分类目录

![wechat-mini-app-page-1.png](/images/wechat-mini-app-page-1.png "分类目录")

「分类目录」需要实现两次页面跳转。该页面设置有六类文章，点击某一类别，则会跳转到该类别的「文章列表」页面，再点击该页面的任意文章，则会跳转到「文章详情」页面。因为「文章列表」页面样式与「新闻列表」相同，所以也可以使用 `timeCard` 组件。

因为文章的类别可以任意设定，并非强行设定为六类，所以这里依然采取使用组件的方法。

首先新建 `newsList.js` 存放类别信息：

```javascript
var json = [
  {
    "id": 1,
    "category": "时政新闻",
    "logo": "/images/logo1.png",
  },
  {
    "id": 2,
    "category": "科学技术",
    "logo": "/images/logo2.png",
  },
  {
    "id": 3,
    "category": "日常生活",
    "logo": "/images/logo3.png",
  },
  {
    "id": 4,
    "category": "人民健康",
    "logo": "/images/logo4.png",
  },
  {
    "id": 5,
    "category": "体育赛事",
    "logo": "/images/logo5.png",
  },
  {
    "id": 6,
    "category": "军事热点",
    "logo": "/images/logo6.png",
  }
]

module.exports = {
  news: json
}
```

然后新建 `itemCard` 组件。

`itemCard.js`：

```javascript
// components/itemCard/itemCard.js

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  methods: {
    handleHot: function(e) {
      wx.navigateTo({
        url: `../categoryDetails/categoryDetails?category=${this.data.item.category}`,
        // 数据传递到 categoryDetails 页面
      })
    }
  }
})
```

`itemCard.wxml`：

```html
<!--components/itemCard/itemCard.wxml-->

<view class="plate-item" bindtap="handleHot">
  <view class="plate-img">
    <image src="{{item.logo}}"></image>
  </view>
  <text class="plate-info">{{item.category}}</text>
</view>
```

`itemCard.wxss`：

```css
/* components/itemCard/itemCard.wxss */

.plate-item {
  display: flex;
  float: left;
  position: relative;
  width: 100rpx;
  height: 160rpx;
  padding: 32rpx 16rpx 32rpx 16rpx;
  margin-left: 36rpx;
  margin-right: 36rpx;
}
.plate-img {
  padding-left: 16rpx;
}
.plate-img image {
  width: 75rpx;
  height: 75rpx;
}
.plate-info {
  position: absolute;
  height: 40rpx;
  font-size: 26rpx;
  bottom: 64rpx;
  left: 16rpx;
}
```

在「分类目录」引入该组件后，在 `category.js` 中添加：

```javascript
// pages/category/category.js

var newsList = require("../../datas/newsList.js");
// 这里需要调用存放目录数据的文件 newsList.js

Page({
  onLoad: function (options) {
    this.setData({
      news: newsList.news
    })
    console.log(newsList)
    console.log(this.data.news)
  },
})
```

`category.wxml`：

```html
<!--pages/category/category.wxml-->

<view class="plate">
  <view wx:for="{{news}}" wx:for-item="item" wx:for-index="index" wx:key="index">
    <itemCard item="{{item}}"/>
  </view>
</view>
```

`<itemCard item="{{item}}"/>` 表示使用该组件。`wx:for` 语句的作用是按照数据存放顺序循环载入该组件。

`category.wxss`：

```css
/* pages/category/category.wxss */

.plate {
  height: 160rpx;
  background: #fff;
  margin: 64rpx 64rpx
}
```

接着设置 `categoryDetails` 页面的内容。首先需要引入组件 `timeCard`，然后：

`categoryDetails.js`：

```javascript
// pages/categoryDetails/categoryDetails.js

var categoryList = require("../../datas/categoryList.js");
Page({
  data: {
    category: null,
    dateSource: []
  },
  onLoad: function (options) {
    const {category} = options;
    console.log(category)
    this.setData ({
      category: category,
    })
    switch(category){
      case "时政新闻":
        this.setData({
          dataSource: categoryList.polity
        });
        break;
      case "科学技术":
        this.setData({
          dataSource: categoryList.tech
        });
        break;
      case "日常生活":
        this.setData({
          dataSource: categoryList.life
        });
        break;
      case "人民健康":
        this.setData({
          dataSource: categoryList.health
        });
        break;
      case "体育赛事":
        this.setData({
          dataSource: categoryList.sport
        });
        break;
      case "军事热点":
        this.setData({
          dataSource: categoryList.military
        });
        break;
    }
  },
  onReady: function () {
    console.log(this.data.dataSource)
  },
})
```

这里设置的是判断点击图标点击的是哪一类别的文章，将该类别的数据导入 `dataSource`。

`categoryDetails.wxml`：

```html
<!--pages/categoryDetails/categoryDetails.wxml-->

<view class="post-category">
  <view wx:for='{{dataSource}}' wx:for-item="item" wx:for-index="index" wx:key="index">
    <timeItem item="{{item}}" category="{{category}}"/>
  </view>
</view>
```

现在点击类别图标，就能够跳转到对应类别的文章目录。

最后设置「文章详情」页面。

`post.js`：

```javascript
// pages/post/post.js

Page({
  data: {
    title: null,
    time: null,
    author: null,
    category: null,
    body: null
  },
  onLoad: function (options) {
    const { title, time, author, image, category, body1, body2, body3, body4} =options;
    console.log(title, time, author, image, category, body1, body2, body3, body4)
    this.setData({
      title: title,
      time: time,
      author: author,
      image: image,
      category: category,
      body1: body1,
      body2: body2,
      body3: body3,
      body4: body4
    })
  },
})
```

`post.wxml`：

```html
<!--pages/post/post.wxml-->

<view class="head">
  <image class="post-image" src="{{image}}" mode="aspectFill"></image>
  <view class="post-head">
    <view class="post-title">{{title}}</view>
    <view class="post-meta">
      <view class="post-time">时间：{{time}}</view>
      <view class="post-type">类别：{{category}}</view>
      <view class="post-author">作者：{{author}}</view>
    </view>
  </view>
</view>
<view class="post-body">{{body1}}</view>
<view class="post-body">{{body2}}</view>
<view class="post-body">{{body3}}</view>
<view class="post-body">{{body4}}</view>
```

`post.wxss`：

```css
/* pages/post/post.wxss */
.post-head{
  box-shadow: 0rpx 0rpx 50rpx 0rpx rgba(85, 85, 85, 0.10);
}
.post-image{
  width: 100%;
  height: 250px;
}
.post-title{
  font-size: 24px;
  padding: 16rpx 30rpx 12rpx 30rpx;
  letter-spacing: 2rpx;
  z-index: 2;
}
.post-meta {
  font-size: 12px;
  color: #79797c;
  display: flex;
  padding: 0 0 16rpx 0;
}
.post-time {
  padding: 0 16rpx 0 30rpx;
}
.post-type {
  padding: 0 16rpx;
}
.post-author {
  padding: 0 16rpx;
}
.post-body {
  padding: 20rpx 30rpx;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 2rpx;
}
```

### 个人中心

![wechat-mini-app-page-2.png](/images/wechat-mini-app-page-2.png "个人中心")

由于时间有限以及队友划水，个人中心的各项功能尚未完成，目前只有一个空壳。

### 评论功能

![wechat-mini-app-comment.png](/images/wechat-mini-app-comment.png "评论功能")

本来我考虑过使用小程序的云开发功能存放评论，但是依然是因为时间有限没有实现预期目标。为了能够实现评论功能，我在 GitHub 上找到了一个微信小程序评论组件：[NewWxComment](https://github.com/yicm/NewWxComment)（新版）/ [WxComment](https://github.com/yicm/WxComment)，该组件模仿博客的 Valine 评论，使用第三方 LeanCloud 存储评论。按照作者的使用说明引用该组件即可。不过由于目前 LeanCloud 国内版需要绑定备案的域名才能使用，所以我建议使用国际版。