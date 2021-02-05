+++
title = "关于"
date = "2019-05-01T08:41:47+08:00"
dropCap = false
displayCopyright = false
gitinfo = false
badge = false
meta = false
share = false
comments = false
+++

![zijingang-qiushi-college.jpg](/images/zijingang-qiushi-college.jpg "浙江大学紫金港校区·求是书院")

你好，欢迎来到我的博客。我是一名学生，浙江大学光电科学与工程学院本科在读，热爱光学、机械、设计，向往宇宙。

我希望通过一个平台来分享自己的生活、想法，把自己学到的知识分享给他人。拥有一个属于自己的独立域名，建立一个属于自己的博客网站，这样我就可以随意控制网站的布局设计，发挥最大的自由空间。选择建立静态博客的原因，一是降低了运营的成本，使用服务器建立个人博客有些大材小用；二是能够专注于文章的写作，不用花费额外的精力去维护服务器的稳定。

目前我的博客采用 [Hugo](https://gohugo.io/) 框架，主题为 [MemE](https://github.com/reuixiy/hugo-theme-meme)，源码存放于 [GitHub](https://github.com/guanqr/blog)，通过 [GitHub Actions](https://github.com/guanqr/blog/actions) 进行持续构建、持续部署。本博客启用了 [PWA](https://developers.google.com/web/progressive-web-apps/) 技术，你可以通过浏览器添加本站到你的手机主屏或计算机桌面，随时随地进行浏览。如果你想订阅本博客，推荐 <a href="/atom.xml" target="_blank">Atom</a> / <a href="/rss.xml" target="_blank">RSS</a>。另外，我还会在<a href="/images/wechat-official-accounts.svg" target="_blank">微信公众号</a>上推送文章，不过因为个人时间有限，推送会滞后一些。

博客的名字取自鲁迅的诗作《题〈彷徨〉》的最后一句——「两间余一卒，荷戟独彷徨」。博客的文章主要分为两大类：「[生活感悟](/life/)」与「[科学技术](/tech/)」。前者主要是我平时的所见所想；后者涵盖了我的专业（光学工程）知识、计算机技术等，也有一些经过我的个人实践进行适当修改的搬运的文章。除了这两类文章，我还开启了一个「[专栏](/series/)」，目前归纳了我写过的建立静态博客和专业课程学习两个类别的文章。如非特别说明，博客中的文章均采用 [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议，如果想要转载的话，请注明出处。

我对博客的字体进行了比较任性的设置。中文部分使用的是 Google Fonts 的[思源宋体](https://fonts.google.com/specimen/Noto+Serif+SC?subset=chinese-simplified)，英文部分使用的是 [Amstelvar](https://github.com/TypeNetwork/Amstelvar/)，代码部分使用的是 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)。另外，页脚的诗词显示功能使用了[今日诗词](https://www.jinrishici.com) 的 API 接口。

如果你在浏览博客的过程中发现了任何问题，欢迎前往 GitHub 的[代码仓库](https://github.com/guanqr/blog)提交 Issues 或直接修改相关文件后提交 Pull Requests。如果你有其他事情想要咨询，可以通过邮件联系我，邮箱地址：guanqirui (at) zju.edu.cn。

<!-- 网站运行时间的设置 -->
<span id="timeDate">载入天数...</span>
<span id="times">载入时分秒...</span>
<script>
    var now = new Date();
    function createtime() {
        var grt= new Date("03/09/2019 13:14:21");//此处修改你的建站时间或者网站上线时间
        now.setTime(now.getTime()+250);
        days = (now - grt ) / 1000 / 60 / 60 / 24; dnum = Math.floor(days);
        hours = (now - grt ) / 1000 / 60 / 60 - (24 * dnum); hnum = Math.floor(hours);
        if(String(hnum).length ==1 ){hnum = "0" + hnum;} minutes = (now - grt ) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum);
        mnum = Math.floor(minutes); if(String(mnum).length ==1 ){mnum = "0" + mnum;}
        seconds = (now - grt ) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
        snum = Math.round(seconds); if(String(snum).length ==1 ){snum = "0" + snum;}
        document.getElementById("timeDate").innerHTML = "本站已安全运行 "+dnum+" 天 ";
        document.getElementById("times").innerHTML = hnum + " 小时 " + mnum + " 分 " + snum + " 秒";
    }
setInterval("createtime()",250);
</script>