+++
title = "微信小程序课程后记"
description = "「微信小程序开发实践」课程总结，微信小程序「生活工具箱」设计"
date = "2020-01-18T19:52:44+08:00"
tags = ["mini-app","typography","wechat","zju"]
aliases = ["/study/computer/wechat-mini-app-development-toolbox/"]
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

我对于这门课程的分数高低并不太关心，早已修够了通识课程的学分，选这一门课程只是为了对前端知识进行巩固和学习如何开发小程序。我们制作的小程序只能处于全班的中下等水平。因为别的组三个人都能为了自己的项目呕心沥血，但我们组的成员毫不放在心上，完全依靠我一个人。但恰好我正是那个没有时间肝项目的人，毕竟在这段时间里，我一直在为 SRTP 发愁。

![wechat-mini-app-toolbox.png](/images/wechat-mini-app-toolbox.png "利用假期时间开发的小程序")

由于我们组设计的程序我很不满意，所以就不展示出来献丑了。放假回到家后，我再次回顾了这门课程的学习过程。在课堂展示上，我很欣赏一个小组的设计，他们组设计的是一个工具箱，具备亲戚关系的计算、BMI 的计算、家庭记账等功能。我利用两天的时间将这个工具箱复刻了出来，我将完整的程序放在了 GitHub 的仓库中。

{{< github name="WeApp-Toolbox" link="https://github.com/guanqr/WeApp-Toolbox" description="WeChat MiniApp: Toolbox. 微信小程序：一个健康管理主题的生活工具箱。" color="#f1e05a" language="JavaScript" >}}

## 程序设计

![wechat-mini-app-page-3.png](/images/wechat-mini-app-page-0.png "生活工具箱")

目前「生活工具箱」实现了「亲戚计算器」、「BMI 计算器」、「家庭记账本」这三个功能。其实在 GitHub 上有很多相关的程序，一些函数直接搬运现成的就能使用，节省了许多时间。

### 亲戚计算器

![wechat-mini-app-page-4.png](/images/wechat-mini-app-page-1.png "亲戚计算器")

亲戚计算器的核心就是能够区分人与人之间的关系，这里我使用的是 mumuy 写的 [Javascript 库](https://github.com/mumuy/relationship/blob/master/dist/relationship.js)。首先需要用户确认自己的性别，不同性别对亲戚的称谓也不同。然后再进行按键按下的方法处理，核心函数如下所示：

```javascript
// pages/relationship-calculator/relationship-calculator.js

var relationship = require("../../datas/relationship.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    second_height: 0, // 第二部分的高度
    screenData: "我",
    result: "",
    id1: "丈夫",
    id2: "妻子",
    id3: "back",
    id4: "clean",
    id5: "爸爸",
    id6: "妈妈",
    id7: "哥哥",
    id8: "弟弟",
    id9: "姐姐",
    id10: "妹妹",
    id11: "儿子",
    id12: "女儿",
    id13: "each",
    isTrue: false,
    sex: 1,
    wantHelp: true
  },

  /**
   * 点击开关男|女
   */
  switchChange: function (e) {
    // 通过判断 true or false
    if (e.detail.value) { // true时为女
      // 设置数据为选中
      this.setData({
        sex: 0
      })
    } else {
      // 设置数据为选中
      this.setData({
        sex: 1
      })
    }
  },

  /**
   * 点击按钮事件
   */
  clickButton: function (event) {
    // 获取屏幕内容
    var data = this.data.screenData.toString();
    // 获取屏幕结果内容
    var dataResult = this.data.result.toString();
    // 获取点击的 id
    var id = event.target.id;
    if (id == this.data.id3) { // 如果是 X 后退则清除两个字符
      // 如果屏幕只有 我 则不处理
      if (data == "我") {
        return;
      } else {
        var data = data.substring(0, data.length - 3);
        // 需要重新计算关系
        var result = relationship({ text: data, sex: this.data.sex, reverse: false, type: 'default' });
        dataResult = result;
      }
    } else if (id == this.data.id4) { // AC 操作 清空屏幕
      data = "我";
      dataResult = "";
    } else { // 点击其他操作
      var data = data.substring(0, data.length);
      var result = relationship({ text: data, sex: this.data.sex, reverse: false, type: 'default' });
      if (id == this.data.id13) { // 互查操作 Ta 称呼我
        // 如果字数大于 22 个则不要增加 and 提示关系态复杂啦
        if (data.length >= 22) {
          dataResult = "关系有点远，年长就叫老祖宗吧~";
          return;
        }
        if (this.data.isTrue) { // 一开始为 false
          result = relationship({ text: data, sex: this.data.sex, reverse: false, type: 'default' });
          // 设置数据
          this.setData({
            isTrue: false
          })
        } else {
          result = relationship({ text: data, sex: this.data.sex, reverse: true, type: 'default' });
          // 设置数据
          this.setData({
            isTrue: true
          })
        }
        // 修改屏幕结果为 result
        dataResult = result;
      } else {
        // 如果字数大于 22 个则不要增加 and 提示关系态复杂啦
        if (data.length >= 22) {
          dataResult = "关系有点远，年长就叫老祖宗~\n同龄人就叫帅哥美女吧";
        } else {
          // 同性关系处理 当为男性时，一开始点击不做处理
          if ((this.data.sex == 1 && id == this.data.id1 && data == '我') || (this.data.sex == 0 && id == this.data.id2 && data == '我')) {
          } else {
            data = data + "的" + id;
            // 需要重新计算关系
            result = relationship({ text: data, sex: this.data.sex, reverse: false, type: 'default' });
            if (this.isNull(result)) { // 结果为空
              result = "哎呀，关系太复杂了啊，我算不出来";
            }
            dataResult = result;
          }
        }
      }
    }
    // 设置数据
    this.setData({
      screenData: data,
      result: dataResult
    })
  },

  // 判断结果是否为空，若是则输出关系太复杂了
  isNull: function (result) {
    if (result.length == 0) {
      return true;
    }
    return false;
  },

  wantHelp: function () {
    setTimeout(function () {
      wx.showModal({
        title: "温馨提示",
        content: "请先选择你的性别，使用屏幕下方按键输入亲戚和你之间的关系，屏幕上方即可显示亲戚对你的称谓。点击交换按钮可以查看你对亲戚的称谓。",
      })
    }, 50)
  },
})
```

`relationship-calculator.wxml`：

```html
<!--pages/relationship-calculator/relationship-calculator.wxml-->

<view class="head-view"  >
    男<switch class="switchClass" bindchange="switchChange" />女
    <image class="exchange" bindtap="clickButton" id="{{id13}}" src="/images/exchange.png"></image>
    <image class="help" catchtap='wantHelp' src="/images/help.png"></image>
</view>
<view class="body-view">
  <textarea  class="textstyle" value='{{screenData}}' disabled='true' maxlength="34"  />
</view>
<view class="body-view">
  <textarea  class="result-style" value='{{result}}' disabled='true' style="text-align:right"  />
</view>

  <view class="family">
    <image class="family-image" src="/images/family.png"></image>
  </view>

<view class="keyboard" >
  <view class="btnGroup"  >       
    <view class="item normal" bindtap="clickButton" id="{{id1}}">夫</view>
    <view class="item normal" bindtap="clickButton" id="{{id2}}">妻</view>
    <view class="item normal" bindtap="clickButton" id="{{id3}}">
      <image class="delate-icon" bindtap="clickButton" id="{{id3}}" src="/images/delate.png"></image>
    </view>
    <view class="item normal-color" bindtap="clickButton" id="{{id4}}">AC</view>
  </view>
  <view class="btnGroup">
    <view class="item normal" bindtap="clickButton" id="{{id5}}">父</view>
    <view class="item normal" bindtap="clickButton" id="{{id6}}">母</view>
    <view class="item normal" bindtap="clickButton" id="{{id7}}">兄</view>
    <view class="item normal" bindtap="clickButton" id="{{id8}}">弟</view>
  </view>
  <view class="btnGroup">
    <view class="item normal" bindtap="clickButton" id="{{id9}}">姐</view>
    <view class="item normal" bindtap="clickButton" id="{{id10}}">妹</view>
    <view class="item normal" bindtap="clickButton" id="{{id11}}">子</view>
    <view class="item normal" bindtap="clickButton" id="{{id12}}">女</view>
  </view>
</view>
```

`relationship-calculator.wxss`：

```css
/* pages/relationship-calculator/relationship-calculator.wxss */

page{
  height: 100%;
  background: #f7f7f7;
}
.head-view .wx-switch-input{
  background: #7DB9DE !important;
  border: #7DB9DE !important;
  height: 40rpx !important;
}
/*白色样式（false的样式）*/
.head-view .wx-switch-input::before{
  height: 36rpx !important;
}
/*绿色样式（true的样式）*/
.head-view .wx-switch-input::after{
  height: 36rpx !important;
}
.keyboard {
  background: #e5e5e5;
  color: #FFFFFF;
  border:solid 0.25rpx #c0c0c0;
  position: fixed;
  bottom: 0;
}
.head-view {
  height: 84rpx;
  background-color: #f7f7f7;
  border-bottom: solid 0.5rpx #d9d9d9;
  color: #313131;
  padding-left: 37.5rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
}
.gender {
  width: 200rpx;
}
.exchange {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  right: 120rpx;
}
.help {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  right: 37.5rpx;
}
.body-view {
  background-color: #f7f7f7;
  padding: 0 37.5rpx;
}
.textstyle {
  font-size: 32rpx;
  width: 100%;
  height: 120rpx;
  color: #313131;
  padding-top: 36rpx;
}
.result-style {
  font-size: 42rpx;
  width: 100%;
  height: 120rpx;
  color: #313131;
  border-color: #f7f7f7;
}
.family-image {
  position: absolute;
  width: 100%;
  height: calc(0.4*100vw);
  top: 32vh;
}
.btnGroup {
  display: flex;
  flex-direction: row;
}
.item {
  width: 187.5rpx;
  min-height: 10rpx;
  margin: 0rpx;
  border-radius: 0px;
  text-align: center;
  line-height: 15vh;
  display: inline-block;
  font-size: 40rpx; 
}
.delate-icon {
  width: 40rpx;
  height: 40rpx;
}
.color {
  color: #ebebeb;
  border:solid 0rpx #d9d9d9;
  background:#7DB9DE;  
}
.normal {
  color: #313131;
  border:solid 0.5rpx #d9d9d9;
  background-color: #f7f7f7;
}
.normal-color {
  color:#7DB9DE;
  border:solid 0.5rpx #d9d9d9;
  background-color: #f7f7f7;
}
```

### BMI 计算器

![wechat-mini-app-page-5.png](/images/wechat-mini-app-page-2.png "BMI 计算器")

BMI 计算器也是一个很简单的设计，调整好身高和体重的数据就能够计算出你的 BMI 得分和在该身高下正常的体重。因为国内和国际 BMI 标准有一定的区别，在函数中可以做修改。核心函数如下：

```javascript
// pages/bmi-calculator/bmi-calculator.js

Page({
  STANDARD: 22,
  rules: [
    [18.5, 24, 28],
    [18.5, 25, 30, 35, 40],
    [18.5, 23, 25, 30]
  ],
  ruleConfig: ['偏瘦', '正常', '偏胖', '肥胖', '重度肥胖', '极重度肥胖'],
  /**
   * 页面的初始数据
   */
  data: {
    bmi: {
      height: 170,
      weight: 60
    },
    score: 20.8,
    height: 0,
    weight: 0,
    index: 0,
    weightStandard: 63.6,
    physicalCondition: '正常',
  },

  changeHeight: function (e) {
    this.data.bmi.height = e.detail.value;
    this.setData(this.data);
  },

  changeWeight: function (e) {
    this.data.bmi.weight = e.detail.value;
    this.setData(this.data);
  },

  calculateBtn: function (e) {
    this.calculate();
    this.weightStandardCalculate();
    this.physicalConditionCalculate();
  },

  calculate: function () {
    let score = 0;
    let height = this.data.bmi.height / 100;
    let weight = this.data.bmi.weight;
    score = (weight / (height * height)).toFixed(1);
    this.setData({
      score: score
    })
  },

  weightStandardCalculate: function () {
    let weight = 0;
    let height = this.data.bmi.height / 100;
    weight = (this.STANDARD * (height * height)).toFixed(1);
    this.setData({
      weightStandard: weight
    })
  },

  //身体状况计算
  physicalConditionCalculate: function () {
    let rule = this.rules[0];
    let value = 0;
    let score = + this.data.score;
    let length = rule.length;
    if (score >= rule[length - 1]) {
      value = length;
    } else {
      for (let length = rule.length, i = length; i >= 1; --i) {
        if (score < rule[i] && score >= rule[i - 1])
          value = i;
      }
    }
    this.setData({
      physicalCondition: this.ruleConfig[value]
    })
  }
})
```
`bmi-calculator.wxml`：

```html
<!--pages/bmi-calculator/bmi-calculator.wxml-->
<view class="head">
  <view class="bmi">
    <view class="bmi-head">你的 BMI 值</view>
    <view class="bmi-index">{{score}}</view>
  </view>
  <view class="bmi-description">BMI，即身体质量指数，是国际上常用的衡量人体肥胖程度和健康程度的重要标准。BMI=体重/身高平方 (kg/㎡)</view>
  <view class="result">
    <view class="overview">身体状况：{{physicalCondition}}</view>
    <view class="overview">标准体重：{{weightStandard}}kg</view>
  </view>
</view>
<view class="height">
  <view class="slider-description">
    <view class="icon">
      <image class="slider-icon" src="/images/height.png"></image>
    </view>
    <view class="data">
      <view class="slider-head">身高</view>
      <view class="slider-index">{{bmi.height}}cm</view>
    </view>
  </view>
  <view class="body-view">
    <slider max="220" min="80" step="1" value="{{bmi.height}}" bindchanging="changeHeight" block-color="#7DB9DE" block-size="16" activeColor="#7DB9DE"/>
  </view>
</view>
<view class="weight">
  <view class="slider-description">
    <view class="icon">
      <image class="slider-icon" src="/images/weight.png"></image>
    </view>
    <view class="data">
      <view class="slider-head">体重</view>
      <view class="slider-index">{{bmi.weight}}kg</view>
    </view>
  </view>
  <view class="body-view">
    <slider max="100" min="10" step="1" value="{{bmi.weight}}" bindchanging="changeWeight" block-color="#7DB9DE" block-size="16" activeColor="#7DB9DE"/>
  </view>
</view>
<button hover-class="btn-hover" bindtap="calculateBtn">计算</button>
```

`bmi-calculator.wxss`：

```css
/* pages/bmi-calculator/bmi-calculator.wxss */
page {
  background: -webkit-linear-gradient(bottom,white,#cef3ff,#7DB9DE);
}
.head {
  background-color: #eff2f5;
  height: 440rpx;
  width: 90%;
  margin-left: 37.5rpx;
  margin-top: 42rpx;
  border-radius: 25rpx;
  align-items: center;
  box-shadow: 0rpx 0rpx 16rpx 1rpx #7da0c0;
}
.bmi {
  text-align: center;
}
.bmi-head {
  padding: 32rpx 0 0 0;
  font-size: 32rpx;
}
.bmi-index {
  padding-bottom: 0rpx;
  font-size: 120rpx;
}
.bmi-description {
  padding: 0 32rpx 24rpx 32rpx;
  font-size: 24rpx;
  text-indent: 2em; 
}
.result {
  display: flex;
}
.overview {
  width: 40%;
  font-size: 26rpx;
  text-align: center;
  padding: 24rpx 0;
  margin: 0 34rpx;
  border-top: 1rpx solid;
}
.height {
  background-color: #eff2f5;
  height: 210rpx;
  width: 90%;
  margin-left: 37.5rpx;
  margin-top: 42rpx;
  border-radius: 25rpx;
  align-items: center;
  box-shadow: 0rpx 0rpx 16rpx 1rpx #7da0c0;
}
.weight {
  background-color: #eff2f5;
  height: 210rpx;
  width: 90%;
  margin-left: 37.5rpx;
  margin-top: 42rpx;
  border-radius: 25rpx;
  align-items: center;
  box-shadow: 0rpx 0rpx 16rpx 1rpx #7da0c0;
}
.slider-description {
  padding-top: 12rpx;
  display: flex;
  margin-bottom: -24rpx;
}
.icon {
  margin: 24rpx 12rpx 12rpx 24rpx;
}
.slider-icon {
  height: 100rpx;
  width: 100rpx;
}
.data {
  margin: 24rpx 12rpx 12rpx 12rpx;
}
.slider-head {
  padding: 8rpx 10rpx;
  font-size: 26rpx;
}
.slider-index {
  padding: 0 8rpx;
  font-size: 32rpx;
  font-weight: bold;
}
wx-button {
  color: #eff2f5;
  background-color: #7DB9DE;
  border-color: #7DB9DE;
  margin-top: 64rpx;
}
```

### 家庭记账本

![wechat-mini-app-page-6.png](/images/wechat-mini-app-page-3.png "家庭记账本")

记账本因为需要存储用户数据，这里使用到了微信小程序的云开发功能。云开发数据的储存和调用其实不算难，关键是要理清数据存储的结构。这里我将讲述一下云开发的基本使用方法，不再展示记账本的 `wxml` 和 `wxss` 的内容。

使用微信小程序云开发，则需要使用自己的 AppID，进入云开发控制台，创建数据库，添加一个集合。这里我创建的数据库环境为 `guanqr-01`，集合名称为 `cashbook`。

在小程序所在目录中，将除了 `project.config.json` 外的全部文件存放在 `miniprogram` 文件夹内，然后再新建一个名为 `cloudfunctions` 文件夹，用来存放云函数，不过目前并未涉及到云函数的使用。以上步骤完成后，在 `project.config.json` 文件的开头添加：

```diff
{
+ "miniprogramRoot": "miniprogram/",
+ "cloudfunctionRoot": "cloudfunctions/",
  "description": "项目配置文件",
  "packOptions": {
    "ignore": []
  }
}
```

然后进入 `app.js`，添加：

```diff
App({
  onLaunch: function () {
+   if (!wx.cloud) {
+     console.error('请使用 2.2.3 或以上的基础库以使用云能力')
+   } else {
+     wx.cloud.init ({
+       env: 'guanqr-01',
+       traceUser: true,
+     })
+   }
  }
})
```

`env` 这里需要填写你配置云开发的时候填写的数据库环境。上述步骤完成后，云开发的基本配置就完成了。如果你需要上传数据到云端，可以设置一个函数，比如名为 `addData`，在 `js` 文件中添加：

```javascript
addBtn: function(){
  const db = wx.cloud.database()
  db.collection('cashbook').add ({
    data: {
      // 这里是需要上传的数据，以下面的六组数据为例
      title: this.data.title,
      incomeOrPay: this.data.incomeOrPay,
      fontColor: this.data.fontColor,
      mark: this.data.mark,
      money: this.data.money,
      date: this.data.date
    },
    success: res => {
      this.setData ({
        // 这里填写上传成功后的运行的函数
      })
      wx.showToast ({
        title: '添加成功'
      })
      //console.log('添加成功，记录 _id:', res._id)
    },
    fail: err => {
      wx.showToast ({
        icon: 'none',
        title: '添加失败'
      })
      //concole.error('添加失败', err)
    }
  })
}
```

运行该函数将数据上传后，即可在控制台中看到存储的数据。

![wechat-mini-app-cloud.png](/images/wechat-mini-app-cloud.png "云开发控制台")

每一组数据具有唯一的 `_id`，因此可以借助 `_id` 查找并修改特定的数据类型。

对于数据库中的数据读取操作也很简单：

```javascript
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashbook: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const db = wx.cloud.database()
    db.collection('cashbook').get({
      success: res => {
        //console.log(res.data)
        this.setData({
          cashbook: res.data,
        })
      }
    })
  }
}
```

至于数据的删除，我觉得当前很多应用都是向左滑动删除当前一栏数据，因此我对此进行了模仿。

![wechat-mini-app-page-4.png](/images/wechat-mini-app-page-4.png "向左滑动删除数据")

首先对 `wxml` 文件进行改写：

```html
<!--pages/cashbook/cashbook.wxml-->

<view class="body">
  <view class="cashbook {{item.isTouchMove ? 'touch-move-active' : ''}}" data-index="{{index}}" bindtouchstart="touchstart" bindtouchmove="touchmove" wx:for="{{cashbook}}" wx:key= "index">
    <view class="content">
      <view class="title">{{item.title}}</view>
      <view class="details">
        <view class="money" style="color:{{item.fontColor}};">{{item.mark}}{{item.money}} 元</view>
        <view class="date">{{item.date}}</view>
      </view>
    </view>
    <view class="del" catchtap="del" data-index="{{index}}" id='{{item._id}}'>删除</view>
  </view>
</view>
```

再编写 JavaScript 函数实现滑动删除：

```javascript
// pages/cashbook/cashbook.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashbook: [],
    startX: 0, //开始坐标
    startY: 0,
    countereId: null
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const db = wx.cloud.database()
    db.collection('cashbook').get({
      success: res => {
        //console.log(res.data)
        res.data.reverse()
        this.setData({
          cashbook: res.data,
        })
      }
    })
  },

  addNewCash: function () {
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/add-cash/add-cash',
      })
    }, 50)
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.cashbook.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cashbook: this.data.cashbook
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.cashbook.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      cashbook: that.data.cashbook
    })
  },
  /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.cashbook.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      cashbook: this.data.cashbook
    })
    var uid = e.target.id
    //console.log(uid)
    const db = wx.cloud.database()
    db.collection('cashbook').doc(uid).remove()
  },
})
```

删除数据的关键就是获取当前数据的 `_id` 值。在 `wxml` 文件中，我通过使用 `id = '{{item._id}}'` 获取到了当前数据的 `_id` 值，然后使用 `remove()` 删除了指定数据。