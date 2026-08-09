# <div align="center"><a title="Guanqr's blog repository" href="https://github.com/guanqr/blog"><img align="center" width="75" height="75" src="https://raw.githubusercontent.com/guanqr/blog/master/static/icons/favicon.svg?sanitize=true"></a> 荷戟独彷徨</div>

<div align="center">

[![Home](https://img.shields.io/badge/Home-Guanqr-aa96da)](https://guanqr.com)
[![Generator](https://img.shields.io/badge/Generator-Hugo-ff4088?&logo=hugo)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/Theme-MemE-2a6df4)](https://github.com/reuixiy/hugo-theme-meme)
[![Build](https://github.com/guanqr/blog/workflows/build/badge.svg)](https://github.com/guanqr/blog/actions)

</div>

## 关于

个人博客，基于 [Hugo](https://gohugo.io/) 静态站点生成器和 [MemE](https://github.com/reuixiy/hugo-theme-meme) 主题。所有定制均通过外层覆盖实现，不修改主题文件。

## 特性

### 排版
- 英文装饰副标题（slug 转换，全大写，可变字体）
- 首字母 6em 大号垫在标题之后
- 文章间距收紧（5em → 3em）

### 配色
- 亮色 / 暗色双主题，一键切换（仅亮↔暗，无系统跟随模式）
- 金色主色调，其余对比度层级保持 MemE 原版
- dark-mode.js 精简为二态逻辑，移除系统跟随

### 侧边栏（Next Muse 风格）
- 文章目录（TOC），仅 TOC 开启的页面显示
- 宽屏推挤主内容（1100px+），窄屏叠加遮罩
- CSS 计数器三级编号（1 / 1.1 / 1.1.1）
- 滚动高亮当前章节
- 三横线汉堡图标，点击变叉号，动画与导航栏一致

### 微动态（Micro）
- Markdown 创建，无标题无目录无评论
- `/micro/` 页面倒序展示，日期在正文下方
- 排除在 RSS / 归档之外
- `hugo new micro/xxx.md` 一键创建

### 书单（Books）
- `data/books.toml` 按年份分组，自动倒序排列
- 书名 + 作者 + 类型 + 出版社内联展示
- 年份右侧生肖图标，hover 金色高亮

### 关于页面
- Emoji 卡片网格，data 驱动
- 虚线边框 + hover 金黄过渡

### 归档
- 年份 URL 路由：`/archives/2025/` 等，由 Hugo Content Adapter 自动生成
- 即时切换年份，`pushState` 同步 URL
- 键盘 ← → 导航
- `<base href="/">` 仅存档页使用，修正相对链接

### 图床
- 图片托管于阿里云 OSS（`guanqr.oss-cn-hangzhou.aliyuncs.com`）
- `scripts/upload-images.py` 一键增量上传，本地缓存避免重复

### 顶栏
- 纯色半透明背景 + 毛玻璃模糊，金色底边线
- 宽窄屏自适应，`resize` 自动清理菜单状态

### 其他
- Hugo 0.164.0 适配（`languageCode`→`locale`，`languageName`→`label`，`.Site.Data`→`site.Data`）
- SCSS 清理冗余代码（色值、订阅样式、失效选择器）
- archives.js 修复 popstate / 相对链接 / 动态 basePath

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
