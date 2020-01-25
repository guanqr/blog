+++
title = "博客实现 PWA 功能"
date = "2019-10-04T07:15:43+08:00"
tags = ["gulp","hugo","next","pwa"]
series = ["create-a-blog"]
aliases = ["/2019/10/03/realize-pwa/"]
+++

![pwa.png](/images/pwa.png)

渐进式网络应用程序（Progressive Web Apps，PWA）是一种运用现代的 Web API 以及传统的渐进式增强策略创建的跨平台 Web 应用程序。这种应用程序将目前最为现代化的浏览器提供的功能与移动设备的体验优势相结合，使其具有与原生应用相同的用户体验优势。[^1]

当你的网站实现了 PWA 功能后，使用 Google Chrome 浏览器访问时，就会发现浏览器地址栏右侧有一个 `+` 号，并会提醒你安装此网页到桌面。当然，如果你是用手机访问的话，Chrome 就会在页面的底部提醒你安装。

## 前言

PWA 的特点：

1. 添加你的博客到电脑 / 手机的桌面，以原生应用般的方式浏览你的博客
2. 更快速地浏览你的博客
3. 离线浏览你的博客

第一点：对于读者，博客可一触即达，且无浏览器的地址栏、菜单栏等「无关」干扰；对于博客，非常有利于博客的用户留存率，也利于博客的品牌形象。第二点：可以利用 Service Worker 的缓存特点，极大地加速你的博客。第三点：能让你的博客更贴近 APP 的形象。

PWA 有很多要求，比如：HTTPS、响应式布局等等，可参考这个 [Checklist](https://developers.google.com/web/progressive-web-apps/checklist)，可用 [Lighthouse](https://developers.google.com/web/tools/lighthouse)[^2] 检查你的网站是否满足 PWA 的所有要求。

![lighthouse-pwa.png](/images/lighthouse-pwa.png "Lighthouse 检测结果")

我在之前的文章「[加速 Hexo 博客的方法及遇到的问题](/study/blog/speed-up-hexo/)」中提到过如何实现 PWA 功能。在那一篇文章中，我使用的是 Hexo 的一款插件 hexo-service-worker。但最近几个月，通过这款插件生成的 `sw.js` 文件无法被浏览器识别，且网页停止自动更新，需要手动清理缓存才可以看到最新的内容。这显然是与我们的意愿相违背的。

那么该如何改进呢，还有别的插件能提供这样的功能吗？

目前和实现 PWA 相关的 Hexo 插件总共有三个：

1. [hexo-service-worker](https://github.com/zoumiaojiang/hexo-service-worker)
2. [hexo-offline](https://github.com/JLHwung/hexo-offline)
3. [hexo-pwa](https://github.com/lavas-project/hexo-pwa)

这三款插件是通过 sw-precache 实现文件的预缓存，都有各自的独特之处，但都不太完美。其实还可以使用 Gulp，利用 Workbox 实现 PWA，而且这种方法适用于各种静态博客，不仅限于 Hexo。

## 三款插件

hexo-service-worker 和 hexo-offline 插件的设定方法几乎相同，hexo-service-worker 的作者也说他的这款插件是根据 hexo-offline 插件进行的一些魔改。多出来的一项功能就是，当你的博客更新后，网页上方会弹出一个提示，提醒你网站已经更新完成，请刷新网页。因此这两款插件的使用方法我不再做过多的讲解，直接参考我的文章「[加速 Hexo 博客的方法及遇到的问题](/study/blog/speed-up-hexo/)」以及官方文档进行配置即可。

这里还要特别提醒一点，上述两款插件在站点配置文件中的配置内容仅有一处不同：

```yaml
service_worker: #这是 hexo-service-worker 的配置开头
offline: #这是 hexo-offline 的配置开头
```

上文提到，我使用这两款插件的时候都遇到了问题，而且这个问题只是在最近才遇到的，我在别的网站进行测试，问题同样会发生。我不知道是什么原因，导致浏览器无法识别 `sw.js`，所以才放弃了这两款插件，从而开始使用 hexo-pwa。

下面我重点说明 hexo-pwa 插件的配置。

这一款插件的特别之处在于，你可以直接在站点的配置文件中设定 `manifest.json` 的内容，而无需额外设定。通过：

```
npm install --save hexo-pwa
```

安装完成插件后，在站点配置文件中添加下述内容：

```yaml
pwa:
  manifest:
    path: /manifest.json
    body:
      name: hexo
      short_name: hexo
      icons:
        - src: /images/android-chrome-192x192.png
          sizes: 192x192
          type: image/png
        - src: /images/android-chrome-512x512.png
          sizes: 512x512
          type: image/png
      start_url: /index.html
      theme_color: '#ffffff'
      background_color: '#ffffff'
      display: standalone
  serviceWorker:
    path: /sw.js
    preload:
      urls:
        - /
      posts: 5
    opts:
      networkTimeoutSeconds: 5
    routes:
      - pattern: !!js/regexp /hm.baidu.com/
        strategy: networkOnly
      - pattern: !!js/regexp /.*\.(js|css|jpg|jpeg|png|gif)$/
        strategy: cacheFirst
      - pattern: !!js/regexp /\//
        strategy: networkFirst
  priority: 5
```

其中，`manifest:` 后面接的就是 `manifest.json` 的设定，在此处对博客的名称、图标等进行设定，运行该插件后，可以直接在 `public` 中生成 `manifest.json` 文件。`serviceWorker:` 后面接的就是你要设置的缓存内容。

```yaml
preload:
      urls:
        - /
      posts: 5
```

这一部分是设置中的重点，`posts:` 后面的数字就是你想要缓存的文章数量，注意这里只能够设置缓存文章。如果你想要缓存全部的文章，可以将该数字设置到超过你的文章总数。比如 `200`。当然，特定的页面也可以进行缓存，在 `url:` 的后面，你可以输入你想要缓存的特定页面。比如主页，就是输入 `- /`，分类页面，输入的是 `- /categories/`。这个插件的缺点就在于这里，如果你想要缓存博客的全部页面，那只能将所在目录一个一个输入进去。

## Workbox

我目前采用的就是通过 Workbox 实现博客的 PWA，个人感觉效果要比使用上述三种插件要好很多。

首先依然是设定你的 `manifest.json` 文件，直接参考「[加速 Hexo 博客的方法及遇到的问题](/study/blog/speed-up-hexo/)」中的「将博客添加至桌面」这一章节即可。

由于需要使用 Node 的模块，因此我们的电脑必须安装 [Node.js](https://nodejs.org/zh-cn/download/)。如果你使用的是 Hexo，那么是已经安装过的；如果你使用的并非基于 Node.js 的博客框架，那么请自行安装一下。然后，我们安装模块：

```
npm install workbox-build gulp gulp-uglify readable-stream uglify-es --save-dev
```

这里便需要依靠 Gulp 生成 `sw.js` 文件。对于 Gulp 这一款工具的使用，也可以参考我的另一篇文章「[使用 Gulp 压缩博客静态资源](/study/blog/use-gulp-to-compress-source-code/)」进行初步的了解。

接下来，我们在博客站点根目录下新建一个 `gulpfile.js` 文件：

```javascript
const gulp = require("gulp");
const workbox = require("workbox-build");
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const pipeline = require('readable-stream').pipeline;

gulp.task('generate-service-worker', () => {
    return workbox.injectManifest({
        swSrc: './sw-template.js',
        swDest: './public/sw.js',
        globDirectory: './public',
        globPatterns: [
            "**/*.{html,css,js,json,woff2}"
        ],
        modifyURLPrefix: {
            "": "./"
        }
    });
});

gulp.task("uglify", function () {
    return pipeline(
        gulp.src("./public/sw.js"),
        uglify(),
        gulp.dest("./public")
  );
});

gulp.task("build", gulp.series("generate-service-worker", "uglify"));
```

其中，`globPatterns` 就是生成的预缓存列表的文件匹配模式，在这里就是将所有的 `html`、`css`、`js`、`json`、`woff2` 文件预缓存，即博客首次加载时，自动将这些文件缓存。

如果你此前使用 Gulp 压缩了博客的源码，你的站点根目录下应该已经存在 `gulpfile.js` 文件，那么可以直接在该文件中添加上述内容，重复的地方忽略即可。

然后，再在站点根目录下新建一个 `sw-template.js` 文件：

```javascript
const workboxVersion = '4.3.1';

importScripts(`https://cdn.jsdelivr.net/npm/workbox-cdn@${workboxVersion}/workbox/workbox-sw.js`);

workbox.setConfig({
    modulePathPrefix: `https://cdn.jsdelivr.net/npm/workbox-cdn@${workboxVersion}/workbox/`
});

workbox.core.setCacheNameDetails({
    prefix: "Guanqr"
});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute([]);

workbox.precaching.cleanupOutdatedCaches();

// Images
workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|gif|bmp|webp|svg|ico)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "images",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Fonts
workbox.routing.registerRoute(
    /\.(?:eot|ttf|woff|woff2)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "fonts",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Google Fonts
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets"
    })
);
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    })
);

// Static Libraries
workbox.routing.registerRoute(
    /^https:\/\/cdn\.jsdelivr\.net/,
    new workbox.strategies.CacheFirst({
        cacheName: "static-libs",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    })
);

workbox.googleAnalytics.initialize({});
```

其中，请将 `prefix` 修改为你博客的名字（英文），请查看 Workbox 的 [Releases](https://github.com/GoogleChrome/workbox/releases) 页面和 [workbox-cdn](https://github.com/nuxt-community/workbox-cdn) 的 GitHub 页面以修改 `workboxVersion` 为最新版，其它项也请务必结合你的情况自行修改。如果你想用其它缓存策略，请自行查看[相关文档](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)。同时，提醒一下，绝对不要缓存视频。

设置完成后，运行命令：

```
hexo g
gulp build
```

即可在 `public` 文件夹下生成一个 `sw.js` 文件。

最后，我们还需要在 HTML 页面中加入相关代码以注册 Service Worker，并添加页面更新后的提醒功能。在这里可能要编辑你的主题相关模板文件，把以下代码放在 `</body>` 的前面：

```html
<div class="app-refresh" id="app-refresh">
    <div class="app-refresh-wrap" onclick="location.reload()">
        <label>已更新最新版本</label>
        <span>点击刷新</span>
    </div>
</div>

<script>
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            showNotification();
                        }
                    }
                });
            });
        });
    }
    
    function showNotification() {
        document.querySelector('meta[name=theme-color]').content = '#000';
        document.getElementById('app-refresh').className += ' app-refresh-show';
    }
</script>
```

如果你使用的是 Hexo 的 NexT 主题，且主题版本在 v7.4.0 以上，请直接在 `~/themes/next/layout/_layout.swig` 文件中的 `</body>` 前面添加上述内容，不要使用主题的 inject 注入功能，在 `~/source/_data/body-end.swig/` 中添加。因为如果你启用了 PJAX 功能，在 `body-end.swig` 中添加的内容会自动带上 PJAX 的标签，亲测在博客部署后会报错。

然后再添加以下 CSS 样式到你的自定义样式文件中：

```css
.app-refresh {
    background: #000;
    height: 0;
    line-height: 3em;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 42;
    padding: 0 1em;
    transition: all .3s ease;
}
.app-refresh-wrap {
    display: flex;
    color: #fff;
}
.app-refresh-wrap label {
    flex: 1;
}
.app-refresh-show {
    height: 3em;
}
```

如果你完成了上述配置，将网站部署后，就可以实现 PWA 了。

<p class="note-info">
本文主要参考了「<a href="https://io-oi.me/tech/pwa-via-workbox/" target="_blank">利用 Workbox 实现博客的 PWA</a>」这一篇文章，内容结合个人实际情况有所改动。
</p>

[^1]: 参考①：[渐进式网络应用程序 | 维基百科](https://zh.wikipedia.org/wiki/渐进式网络应用程序)<br>参考②：[渐进式 Web 应用（PWA） | MDN web docs](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)
[^2]: 这里一个提供在线测试的网站：<https://www.webpagetest.org/lighthouse>
