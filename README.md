# <div align="center"><a title="Guanqr's blog repository" href="https://github.com/guanqr/blog"><img align="center" width="75" height="75" src="https://raw.githubusercontent.com/guanqr/blog/master/static/icons/favicon.svg?sanitize=true"></a> 荷戟独彷徨</div>

<div align="center">

[![Home](https://img.shields.io/badge/Home-Guanqr-aa96da)](https://guanqr.com)
[![Generator](https://img.shields.io/badge/Generator-Hugo-ff4088?&logo=hugo)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/Theme-MemE-2a6df4)](https://github.com/reuixiy/hugo-theme-meme)
[![Build](https://github.com/guanqr/blog/workflows/build/badge.svg)](https://github.com/guanqr/blog/actions)

</div>

## 关于

个人博客，基于 [Hugo](https://gohugo.io/) 静态站点生成器和 [MemE](https://github.com/reuixiy/hugo-theme-meme) 主题。所有定制均通过外层覆盖实现，不修改主题文件。

## 结构

```
├── assets/
│   ├── js/
│   │   ├── dark-mode.js    # 二态主题切换
│   │   └── sidebar.js      # 侧边栏 & TOC 高亮
│   └── scss/custom/        # SCSS 覆盖
│       ├── _colors.scss    # 配色
│       ├── _sidebar.scss   # 侧边栏
│       ├── _books.scss     # 书单
│       ├── _micro.scss     # 微动态
│       ├── _identity-cards.scss  # 身份卡片
│       └── ...
├── data/                   # 结构化数据
│   ├── books.toml          # 书单
│   ├── identities.toml     # 身份标签
│   └── blogroll.toml       # 友链
├── content/zh/
│   ├── archives/           # 归档（含 _content.gotmpl）
│   ├── micro/              # 微动态
│   ├── books/              # 书单
│   └── ...
├── layouts/                # 模板覆盖
├── static/js/
│   └── archives.js         # 归档年份切换
├── scripts/
│   └── upload-images.py    # OSS 图片上传
├── upload-images.bat       # 一键上传
├── config.toml
└── themes/meme/            # MemE 主题（git submodule）
```

## 本地运行

```bash
git clone --recursive https://github.com/guanqr/blog.git
cd blog
hugo serve        # 开发
hugo              # 构建
```

## 许可

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>

本博客所有文章除特别声明外，均采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
