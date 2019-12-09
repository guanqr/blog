+++
title = "使用 Gulp 压缩博客静态资源"
date = "2019-10-02T13:24:25+08:00"
tags = ["gulp","hexo","next"]
series = ["Build-Up-Blog"]
dropCap = true
displayCopyright = true
gitinfo = true
+++

[^1]![gulp.jpg](/images/gulp.jpg)

网站的访问速度是影响网站阅读量的一个重要因素，因此加速网页的访问速度十分重要。对于加速博客访问速度的方法，可以使用将浏览器第一次加载的数据存入缓存，第二次访问时就能够节省很多时间，这一种方法以及所需的插件，可以参见我之前的文章「[加速 Hexo 博客的方法及遇到的问题](/study/blog/speed-up-hexo/)」，在此不再赘述。在本文中，我主要讲述使用 Gulp 压缩网页源码的方法，这一种方法也可以提升一定的网站访问速度。

## 为什么要压缩源码

我是采用 Hexo 博客框架搭建的博客，文章的书写是先写入 Markdown 文件，然后通过 Hexo 将 Markdown 文件转换成 HTML 文件。在转换后的 HTML 文件代码中，会留下大量的空白空间，毕竟计算机程序不如人的大脑那么灵活。

![use-gulp-to-compress-source-code.jpg](/images/use-gulp-to-compress-source-code.jpg "代码中大量的空白")

不只是 HTML 文件，网站中引入的 CSS、JavaScript 等文件中也会存在一定的空白。而这些空白在网页的载入的时候，浏览器并不会忽略掉，会消耗一定的时间。因此将这些空白的区域去除很重要。

使用 Gulp 工具，能够很好地压缩静态资源，去除这些空白。

## 如何使用

目前在网上搜索相关的教程，大都是基于 Gulp 3 版本，而目前 Gulp 已经更新到了 v4.0，使用旧版本的方法会报错。在这里我提供 Gulp 4 版本的使用方法。

### 安装插件

全局安装：

```
npm install gulp -g
```

然后到站点文件夹的根目录安装：

```
npm install gulp-htmlclean gulp-htmlmin gulp-minify-css gulp-uglify --save
```

在这里说明一下，使用该工具可以压缩 HTML、CSS、JavaScript 文件，但我并没有压缩 JavaScript 文件，因为有很大的概率会报错，实际也并不需要压缩，因为大部分 JavaScript 都已压缩过。

如果你也考虑不压缩 JavaScript 文件，可以选择不安装 `gulp-uglify`。

### 配置文件

在站点文件夹的根目录下，新建一个文件，命名为 `gulpfile.js`，内容如下：

```javascript
var gulp = require('gulp');
//Plugins模块获取
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
//压缩css
gulp.task('minify-css', function () {
	return gulp.src('./public/**/*.css')
		.pipe(minifycss())
		.pipe(gulp.dest('./public'));
});
//压缩html
gulp.task('minify-html', function () {
	return gulp.src('./public/**/*.html')
		.pipe(htmlclean())
		.pipe(htmlmin({
			removeComments: true,
			minifyJS: true,
			minifyCSS: true,
			minifyURLs: true,
		}))
		.pipe(gulp.dest('./public'))
});
//压缩js 不压缩min.js
gulp.task('minify-js', function () {
	return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
		.pipe(uglify())
		.pipe(gulp.dest('./public'));
});
//4.0以前的写法 
//gulp.task('default', [
  //  'minify-html', 'minify-css', 'minify-js'
//]);
//4.0以后的写法
// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.parallel('minify-html', 'minify-css', 'minify-js'));
```

如果不压缩 JavaScript 文件，则将上述代码中有关 `minify-js` 的代码删除即可。

### 执行命令

```
hexo clean	//先清理文件
hexo g	//编译生成静态文件
gulp	//Gulp 插件执行压缩任务
hexo s	//开启服务
```

正常运行后应该显示：

```
$ gulp
[13:08:13] Using gulpfile G:\Hexo\gulpfile.js
[13:08:13] Starting 'default'...
[13:08:13] Starting 'minify-html'...
[13:08:13] Starting 'minify-css'...
[13:08:15] Finished 'minify-css' after 1.55 s
[13:08:18] Finished 'minify-html' after 4.79 s
[13:08:18] Finished 'default' after 4.79 s
```

然后你就可以从站点中的 `/public/` 文件夹中检查这些文件是否被压缩。

除了上述方法外，Hexo 还有一个插件（[hexo-neat](https://github.com/rozbo/hexo-neat)）能够压缩静态资源。不过我并没有使用过，如果你想要使用这个插件也可以试一试。另外，我还使用 Gulp 结合 workbox-build 实现了博客的 PWA 功能，具体的介绍可以看[这篇文章](/study/blog/realize-pwa/)。

## 参考

1. [基于 Hexo 搭建个人博客优化（五）——压缩篇（gulp 4.0 压缩静态资源）| illusorycloud](https://blog.csdn.net/java_1996/article/details/86499625)。
2. [打造个性超赞博客 Hexo + NexT + GitHub Pages 的超深度优化 | reuixiy](https://io-oi.me/tech/hexo-next-optimization/)。

[^1]: 图源：<https://gulpjs.com/>。