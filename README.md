# <div align="center"><a title="Guanqr's blog repository" href="https://github.com/guanqr/blog"><img align="center" width="75" height="75" src="https://raw.githubusercontent.com/guanqr/blog/master/static/icons/favicon.svg?sanitize=true"></a> 荷戟独彷徨</div>

<div align="center">

[![Home](https://img.shields.io/badge/Home-Guanqr-aa96da)](https://guanqr.com)
[![Generator](https://img.shields.io/badge/Generator-Hugo-ff4088?&logo=hugo)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/Theme-memoree-2a6df4)](https://github.com/guanqr/blog/tree/master/themes/memoree)
[![Build](https://github.com/guanqr/blog/workflows/build/badge.svg)](https://github.com/guanqr/blog/actions)

</div>

## 关于

个人博客，基于 [Hugo](https://gohugo.io/) 静态站点生成器和自有主题 [memoree](themes/memoree/)（由 [MemE](https://github.com/reuixiy/hugo-theme-meme) 复刻而来，MIT 许可）。所有定制均已直接写入主题，站点目录不再包含模板覆盖。

## 结构

```
├── themes/memoree/         # 自有主题（由 MemE 复刻）
│   ├── layouts/            # 全部模板（含侧边栏、归档、微动态、9 个 shortcode）
│   ├── assets/
│   │   ├── js/             # dark-mode/header/sidebar 等脚本
│   │   └── scss/custom/    # 配色、侧边栏、书单、身份卡片等样式
│   ├── static/js/archives.js  # 归档年份切换
│   ├── i18n/               # en / zh-hant（含站点定制键）
│   └── data/SVG.toml       # 图标（含站点新增图标）
├── data/                   # 站点结构化数据
│   ├── booklist.toml       # 书单
│   ├── identities.toml     # 身份标签
│   └── blogroll.toml       # 友链
├── content/zh/
│   ├── archives/           # 归档（含 _content.gotmpl）
│   ├── micro/              # 微动态
│   └── ...
├── scripts/
│   └── upload-images.py    # OSS 图片上传
├── upload-images.bat       # 一键上传
└── config.toml
```

## 本地运行

```bash
git clone https://github.com/guanqr/blog.git
cd blog
hugo serve        # 开发
hugo              # 构建
```

## 许可

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>

本博客所有文章除特别声明外，均采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
