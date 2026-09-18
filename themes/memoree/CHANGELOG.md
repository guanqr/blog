# Changelog

本主题由 [hugo-theme-meme](https://github.com/reuixiy/hugo-theme-meme) v5.0.0 复刻而来，从 v1.0.0 开始记录自有修改。

## v1.0.0 (2026-09-18)

首个独立版本：剥离上游、合并站点定制、精简功能。

### 复刻

- 主题更名为 memoree，移除 submodule 声明，作为本站仓库 `themes/memoree/` 的普通文件维护
- 保留 MIT 许可与上游版权声明，theme.toml 更新作者与最低 Hugo 版本（0.164.0）
- 重写中文 README 与 CHANGELOG

### 定制并入主题

站点原有的全部外层覆盖直接写入主题，站点根目录不再有 layouts/、assets/、i18n/、archetypes/：

- 文章侧边栏目录（TOC 滚动高亮、移动端抽屉）
- 归档页年份切换（Content Adapter 生成 `/archives/YYYY/`，JS 即时切换 + pushState）
- 微动态（`type = "micro"` 模板）
- 9 个自定义短码：`align`、`blogroll`、`book-list`、`github`、`identity-cards`、`notice`、`quote-center`、`quote`、`simple-notice`
- Waline v3 评论（ESM 动态导入、懒加载）
- 二态深色模式（light/dark）、文章时效性提醒、文章英文副标题
- 自定义配色、字体与 16 个 custom SCSS 文件
- `data/SVG.toml` 与 `i18n/{en,zh-hant}.toml` 合并站点键
- 归档切换脚本移入主题 `static/js/`

### 精简

- 删除 Disqus、Valine、Utterances、Gitalk、Giscus、Remark42 评论系统（仅保留 Waline）
- 删除今日诗词与页脚订阅功能
- 删除 i18n 中未使用的 14 种语言（仅保留 en、zh-hant）
- 删除上游元数据：`.github/`、`exampleSite/`、`config-examples/`、README、截图、`Socials.toml`

### 修复

- 移除归档页遗留的 `<base href="/">` 标签（曾劫持页内锚点跳转）
