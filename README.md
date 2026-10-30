# <div align="center"><a title="Guanqr's blog repository" href="https://github.com/guanqr/blog"><img align="center" width="75" height="75" src="https://raw.githubusercontent.com/guanqr/blog/master/themes/memoree/static/icons/favicon.svg?sanitize=true"></a> 荷戟独彷徨</div>

<div align="center">

[![Home](https://img.shields.io/badge/Home-Guanqr-aa96da)](https://guanqr.com)
[![Generator](https://img.shields.io/badge/Generator-Hugo-ff4088?&logo=hugo)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/Theme-memoree-2a6df4)](https://github.com/guanqr/blog/tree/master/themes/memoree)
[![Build](https://github.com/guanqr/blog/workflows/build/badge.svg)](https://github.com/guanqr/blog/actions)

</div>

## 关于

个人博客，基于 [Hugo](https://gohugo.io/) 静态站点生成器和自有主题 [memoree](themes/memoree/)（基于 [MemE](https://github.com/reuixiy/hugo-theme-meme) 修改而来，MIT 许可）。所有定制均已直接写入主题，站点目录不再包含模板覆盖。

## 结构

```
├── themes/memoree/            # 自有主题（基于 MemE 修改，含 CHANGELOG）
│   ├── layouts/               # 全部模板（含侧边栏、归档、微动态、9 个 shortcode）
│   ├── assets/
│   │   ├── js/                # ES 模块源码（js.Build 打包为单 bundle）
│   │   └── scss/              # config 默认值 + @use 模块，按 base/components/layout/pages/themes 分层
│   ├── i18n/                  # en / zh-hant（含站点定制键）
│   ├── archetypes/            # 文章与微动态模板
│   └── data/SVG.toml          # 图标（含站点新增图标）
├── data/                      # 站点结构化数据
│   ├── booklist.toml          # 书单
│   ├── identities.toml        # 身份标签
│   ├── blogroll.toml          # 友链
│   └── image_dimensions.json  # 正文图片尺寸表（LQIP，脚本生成）
├── content/zh/
│   ├── archives/              # 归档（分页列表）
│   ├── micro/                 # 微动态
│   └── ...
├── local-preview.toml         # 本地预览 OSS 图片的配置覆盖
├── scripts/
│   ├── upload-images.py       # OSS 图片上传
│   └── generate-image-dimensions.py  # 生成正文图片尺寸表（LQIP）
├── upload-images.bat          # 一键上传
├── .github/workflows/build.yml  # 推送即自动构建部署
└── hugo.toml
```

## 本地运行

需要 [Hugo 标准版](https://gohugo.io/installation/) ≥ 0.164.0 + [Dart Sass](https://sass-lang.com/dart-sass/) 1.107.0 独立版（把 `sass` 加入 PATH；CI 会自动下载，不需要 npm 构建链）：

```bash
git clone https://github.com/guanqr/blog.git
cd blog
hugo serve        # 开发（正文图片走本地 static/images）
hugo serve --config hugo.toml,local-preview.toml  # 预览 OSS 图片（打开 http://localhost:1313/；127.0.0.1 可能被 OSS 防盗链拒绝）
hugo              # 构建（生产，输出至 public/）
```

## 部署

推送 `master` 后由 GitHub Actions 自动构建，并部署至 `guanqr/guanqr.github.io` 仓库。详见 `.github/workflows/build.yml`。

## 许可

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>

本博客所有文章除特别声明外，均采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
