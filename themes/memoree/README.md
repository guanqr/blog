# memoree

memoree 是 [Guanqr's Blog](https://guanqr.com/) 使用的个人 Hugo 主题，由 [hugo-theme-meme](https://github.com/reuixiy/hugo-theme-meme)（v5.0.0）复刻而来。上游自 2022 年起已停止更新，本站将主题剥离为自有主题并直接维护。

## 与上游的差异

- **站点定制全部写入主题**：不再通过外层覆盖，站点根目录无 layouts/、assets/、i18n/、archetypes/
- **评论系统仅保留 Waline**（v3 ESM 懒加载），删除了 Disqus、Valine、Utterances、Gitalk、Giscus、Remark42
- **删除今日诗词与页脚订阅功能**
- **删除未使用语言**：i18n 仅保留 `en` 与 `zh-hant`
- **删除上游元数据**：`.github/`、`exampleSite/`、`config-examples/`

## 特性

- 深色模式（二态切换）、弹性顶栏、返回顶部
- 文章侧边栏目录（TOC 滚动高亮、移动端抽屉）
- 归档页年份切换（Content Adapter 生成 `/archives/YYYY/`，JS 即时切换 + pushState）
- 微动态（`type = "micro"`）
- 标签云、生肖年份图标、相关文章
- KaTeX / MathJax / Mermaid 公式与图表（按文章开启）
- Waline 评论、代码块复制、medium-zoom 图片缩放、instant.page 预加载
- 9 个自定义短码：`align`、`blogroll`、`book-list`、`github`、`identity-cards`、`notice`、`quote-center`、`quote`、`simple-notice`
- 中文排版：段首缩排、两端对齐、首字下沉、着重号（`..文本..`）、中文标点字形纠正、文章时效性提醒
- 自定义 Atom / RSS 输出、图片外链重写、Google Analytics、Service Worker

## 结构

```
memoree/
├── archetypes/         # 文章与微动态模板
├── assets/
│   ├── js/             # 深色模式、侧边栏、代码复制等脚本
│   └── scss/           # main.scss 注入配置变量；custom/ 存放站点定制样式
├── data/
│   ├── SVG.toml        # 图标
│   └── ChineseZodiac.toml  # 生肖
├── i18n/               # en / zh-hant
├── layouts/            # 模板（含 shortcodes/）
└── static/             # 图标、manifest、归档切换脚本、标点修正字体
```

## 使用

主题随[本站仓库](https://github.com/guanqr/blog)的 `themes/memoree/` 目录维护，站点配置 `theme = "memoree"` 即可。需 Hugo extended（SCSS 由 Hugo 编译，无 npm 构建步骤），版本 >= 0.164.0。

## 许可证

[MIT](LICENSE)，基于 reuixiy 的 [hugo-theme-meme](https://github.com/reuixiy/hugo-theme-meme)。
