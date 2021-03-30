+++
title = "旧事新说：使用 Travis CI 部署 Hugo 博客"
date = "2021-03-30T07:43:03+08:00"
lastmod = "2021-03-30T14:34:15+08:00"
tags = ["hugo","travis-ci"]
series = ["create-a-blog"]
+++

在文章的开头先回答一个问题。为什么这篇文章是旧事新说？因为一年前的这个时候 Travis CI 对于开源仓库的部署还是免费的，但在去年年底，官方更改了定价模式，对于免费用户到达一定的免费额度后必须交费才能继续享用服务。对目前的情况来说，我并不推荐使用 Travis CI 部署任何东西，更好的方法就是使用 GitHub 自带的 Actions。

那么为什么还要写这篇文章？因为我曾经在使用 Netlify 的时候也尝试过 Travis CI，最近我对博客代码进行了很多改动，导致原来使用的 GitHub Actions 不再适用，所以重新拾起 Travis CI 作为临时替补工具，等到配置好新的 GitHub Actions 再迁移过来。既然是自己用过的东西，就想记录一下使用方法，避免以后忘记。

## Travis CI 与持续集成

持续集成指的是只要代码有变更，就自动运行构建和测试，反馈运行结果。确保符合预期以后，再将新代码集成到主干。持续集成的好处在于，每次代码的小幅变更，就能看到运行结果，从而不断累积小的变更，而不是在开发周期结束时，一下子合并一大块代码。[^1]

Travis CI 是用 Ruby 语言开发的一个开源的分布式持续集成服务，用于自动构建和测试在 GitHub 托管的项目。支持包括 JavaScript、Node.js、Ruby 等 20 多种程序语言。Travis CI 目前有两个官网，分别是 travis-ci.org 和 travis-ci.com。前者是旧平台，已经准备停用。[^2]

## 准备工作

Travis CI 的 Hugo 博客部署流程是这样的：

1. 将博客源码存放在 `blog` 仓库中；
2. Travis CI 载入 `blog` 仓库，编译源码，编译好的文件存放在了 `public` 文件夹中；
3. `public` 文件夹中的文件存放在 GitHub Pages `guanqr.github.io` 中。

首先进入 GitHub，获取一个 Personal Access Token。因为 Travis CI 在自动部署的时候，需要 push 文件到仓库的某个分支，而外界应用访问 GitHub 仓库需要用户的授权。获取 Token 的位置：GitHub → Settings → Developer Settings → Personal access tokens → Generate new token。如下图所示，勾选 `repo` 下的所有项，以及 `user` 下的 `user:email` 后，点击生成，即可生成一个 Token，复制 Token 的值。

![travis-0.png](/images/travis-0.png)

{{< simple-notice simple-notice-warning >}}
注意：Token 不要随意公开。该值只有在生成后才可看到，如果退出页面然后再次进入当前页面就无法看到该值，而且是再也看不到了。最好要及时保存。
{{< /simple-notice >}}

其次，授权 GitHub 账户登录 [Travis CI](https://www.travis-ci.com/)，选择需要部署的仓库，进入设置界面，选择触发部署的条件。如下图所示。

![travis-1.png](/images/travis-1.png)

在该页的下面，还需要设置一个环境变量（Environment Variables），如下图所示。这时候就用到了上文所生成的 Token。在 NAME 处填写 `Travis_Token`，VALUE 处填写 Token 的值。填写完成后点击 Add 添加环境变量。

![travis-2.png](/images/travis-2.png)

## 添加配置文件

以上的准备工作完成后，就需要编写一个配置文件，该文件的作用是让 Travis CI 明白需要做哪些事情。

配置文件需要命名为 `.travis.yml`，放置在仓库的根目录中。其内容如下：

```yml
language: node_js

node_js: stable

cache:
    apt: true
    directories:
        - node_modules

before_install:
    - export TZ='Asia/Shanghai'
    - chmod +x ./gh-pages.sh

install:
    - npm install
    - wget https://github.com/gohugoio/hugo/releases/download/v0.82.0/hugo_extended_0.82.0_Linux-64bit.deb
    - sudo dpkg -i hugo*.deb

script:
    - npm run build

after_script:
    - ./gh-pages.sh

branches:
    only:
        - master

env:
    global:
        - GH_REF: github.com/guanqr/guanqr.github.io.git # 替换成自己要部署到的仓库地址
```

相关说明如下：

1. `language: node_js` 是因为我的博客构建用到了一些插件，这些插件需要使用 `npm` 命令安装到 `node_modules` 中。
2. `export TZ='Asia/Shanghai'` 是设定系统时间为中国区时间。
3. `chmod +x ./gh-pages.sh` 表明需要调用一个额外的 `gh-pages.sh` 文件。
4. `install` 中的内容即为安装插件，安装指定版本的 Hugo。
5. `script` 中的指令 `npm run build` 是我在 `package.json` 文件中自定义的指令，具体含义为 `hugo --gc --minify --cleanDestinationDir && gulp build` 该指令的前半部分是编译 Hugo 博客，后半部分是执行 Gulp 的 build 指令（该指令的含义请看我的另一篇文章：《[博客实现 PWA 功能](/tech/website/realize-pwa/)》）。
1. `after_script` 中是执行 `gh-pages.sh` 文件中的命令。
2. `GH_REF` 是需要将博客部署到的仓库地址。

我用到了一个额外的 `gh-pages.sh` 文件。该文件中包含了提交文件到指定仓库的 Git 命令，其中就包含了授权操作的 Token。该文件也在仓库的根目录中，具体内容如下：

```sh
#!/bin/bash
set -ev

git clone https://${GH_REF} .deploy_git
cd .deploy_git
git checkout master

cd ../
mv .deploy_git/.git/ ./public/

cd ./public

git config user.name "guanqr" # 替换成自己的用户名
git config user.email "guanqirui@zju.edu.cn" # 替换成自己的邮箱

git add .
git commit -m "Travis CI Auto Builder at `date +"%Y-%m-%d %H:%M"` Asia/Shanghai"

git push --force --quiet "https://${Travis_Token}@${GH_REF}" master:master
```

## 运行测试

上述工作完成后，将博客源码上传至你的 GitHub 仓库中，即可在 Travis CI 中看到部署的信息与过程。如果部署失败也会有相应的提示。在 GitHub 的仓库提交记录中，也会显示部署成功与否的信息。

![travis-3.png](/images/travis-3.png)

![travis-4.png](/images/travis-4.png)

[^1]: [持续集成服务 Travis CI 教程 | 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
[^2]: [利用Travis CI + GitHub 实现持续集成和自动部署 | champyin](https://juejin.cn/post/6844903957215576078)