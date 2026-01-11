+++
title = "使用 GitHub Actions 部署 Hugo 博客"
date = "2026-01-11T15:56:27+08:00"
lastmod = "2026-01-11T15:56:27+08:00"
tags = ["hugo","meme"]
dropCap = false
+++

## 前言

对于部署静态博客这一过程，我使用过手动本地部署，[Netlify](/tech/website/deploy-blog-to-netlify/) 与 [Travis CI](/tech/website/deploy-hugo-with-travis-ci/) 自动部署。对我而言，采用什么部署方式最好的评判方法，就是看部署工具的访问与操作是否便捷。部署的速度快慢是无所谓的。Netlify 目前在国内访问速度甚至不如 GitHub，而 Travis CI 开启了收费模式。那么，既然我已经将博客放在了 GitHub 的仓库中，也将博客部署到了 GitHub Pages 中，那么直接采用 GitHub 自家的 GitHub Actions，就是最佳选择。

## 前期准备

首先捋一下思路。整体的思路和使用 Travis CI 差不多。

原始方法：

1. 在本地存放博客源码；
2. 在本地执行 `hugo` 命令后，生成的文件会存放在 `public` 文件夹内；
3. 将 `public` 文件夹内的全部文件 `push` 至 GitHub Pages 中，完成博客部署。

而我们想做的就是让 GitHub Action 自动完成上述第 2、3 步。于是就有了：

1. 将博客源码存放在 GitHub 仓库；
2. 使用 GitHub Action 访问你的源码仓库；
3. 在线安装 Hugo 和其他一些环境依赖；
4. 在线执行 `hugo` 命令，生成 `public` 文件夹；
5. 将 `public` 文件夹内的全部文件 `push` 至 GitHub Pages 中，完成博客部署。

## 具体实现方法

有关创建 GitHub 仓库和 GitHub Pages 的操作就不再赘述了，翻翻以往的文章即可。另外，需要实现声明一下，下面的实现方法是基于我本人使用环境的，你我可能存在某些差异：

1. 我使用了两个独立的仓库分别存放博客源码和 GitHub Pages。你可以在同一个仓库里创建两个分支分别存放他们，但在后续需要选择正确的分支进行部署。
2. 我需要使用 `npm` 安装一些额外的工具，因此有 `package.json` 文件。一般来说 Hugo 博客不需要用到它。

### 修改 `package.json`

创建一个脚本，命名为 `build`，用来执行 `hugo` 和 `gulp build` 命令。

这里我加上了 `gulp build`，是用来执行额外的 Gulp 脚本的，如果不需要可以去掉。同样，如果你没有用到 `package.json` 文件，也可以直接跳过这一步。

```diff
"scripts": {
+    "build": "hugo --gc --minify --cleanDestinationDir && gulp build",
}
```

后面可以直接通过 `npm run build` 来运行这一长串的命令。

### 新建 `build.yml`

在博客根目录下创建 `/.github/workflows/build.yml` 文件，内容如下，需要根据注释自行修改。

```yml
name: build

on:
  push:
    branches:
    - master

jobs:
  deploy:
    runs-on: ubuntu-22.04  # 运行系统和版本

    steps:
    - name: Checkout source
      uses: actions/checkout@v2
      with:
        submodules: true
    
    - name: Setup Node.js
      uses: actions/setup-node@v2  # 安装 Node.js
      with:
        node-version: '14.16.0'  # 选用 Node.js 版本

    - name: Install dependencies
      run: npm install  # 根据 package.json 文件，安装环境依赖

    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2  # 安装 Hugo
      with:
        hugo-version: '0.148.2'  # 选择 Hugo 版本
        extended: true  # 由于 MemE 主题使用的是 Extended 版本的 Hugo，因此需要设置此项为 true

    - name: Build
      run: npm run build  # 执行上文自定义的命令，执行 hugo 和 gulp build

    - name: Deploy
      env:
        TZ: Asia/Shanghai  # 时间地区
        DEPLOY_REPO: guanqr/guanqr.github.io  # 要部署到的仓库名（GitHub Pages 仓库名）
        DEPLOY_BRANCH: master # 要部署到的仓库分支
        PERSONAL_TOKEN: ${{ secrets.PERSONAL_TOKEN }}  # 关联个人账户信息的 Token，用于授权进入仓库，下文会说明如何获取
      run: |  # 执行需要的 git 命令：进入生成的 public 文件夹，push 文件至 GitHub Pages。这里的 USER NAME 和 USER EMAIL 请替换为你的 GitHub 信息
        cd ./public && git init
        git config user.name "USER NAME"
        git config user.email "USER EMAIL"
        git add .
        git commit -m "Automated Deployment @ $(date '+%Y-%m-%d %H:%M:%S') ${TZ}"
        git push --force --quiet "https://$PERSONAL_TOKEN@github.com/$DEPLOY_REPO" master:$DEPLOY_BRANCH
```

### 获取 Token

在 GitHub 中，点击个人头像 → Settings → Developer settings → Personal access token，点击「Generate new token」以获取新 Token。

![deploy-hugo-with-github-actions-0.png](/images/deploy-hugo-with-github-actions-0.png)

给这个 Token 自定义一个名字，下方「Select scopes」中需要勾选「workflow」。生成的 Token 需要保存好，后续无法再次查看。

![deploy-hugo-with-github-actions-1.png](/images/deploy-hugo-with-github-actions-1.png)

返回存放博客源码的仓库，点击 Settings → Secrets and variables → Actions，点击「New repository secret」创建密钥。需要命名为「PERSONAL_TOKEN」，和 `build.yml` 中保持一致。内容填写为上一步中生成的 Token。

![deploy-hugo-with-github-actions-2.png](/images/deploy-hugo-with-github-actions-2.png)

### 检查 Actions

上述步骤完成后，将博客源码 `push` 到仓库。访问你的源码仓库，在 Actions 中查看部署日志，若无报错则部署成功。你可以通过 GitHub Pages 访问网站了。

![deploy-hugo-with-github-actions-3.png](/images/deploy-hugo-with-github-actions-3.png)

## 后记

我在 2021 年 3 月的时候，已经实现使用 GitHub Actions 部署自己的博客，并计划写下本文，以分享自己的实现方法。本文的第一段文字已于当年 6 月写好，但由于种种事情，再无后文。2026 年初，我重新拾起写作兴趣，想到了这篇尚未完成的文章，欲将其补充完整，却发现困难重重。「为什么我的 `build.yml` 文件和别人的不一样？」「我当时是怎么写出这几行代码的？」我早已忘记五年前是参考了哪些文章，如何配置环境，遇到了哪些问题，如何解决这些问题的了。我翻阅着浏览器里的收藏夹，GitHub 仓库的修改履历，努力找寻当时的零星记忆，终于将其拼接完整。

由于这几年我并未跟进更新 `build.yml`，里面有些依赖的程序并非最新版本；由于记忆的偏差，有些步骤可能会出现纰漏……这都可能导致在部署的时候产生报错，还请理解。看来以后再有这样步骤繁琐的操作，不论是否要分享，都需要及时记录完整才行啊，人的记忆终究是靠不住的。