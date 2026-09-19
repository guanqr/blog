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
- 删除 i18n 中未使用的 14 种语言（仅保留 en、zh-hant）
- 删除上游元数据：`.github/`、`exampleSite/`、`config-examples/`、README、截图、`Socials.toml`
- 删除主题搜索功能（Lunr 与 Algolia，含搜索 UI 与索引输出）
- 删除顶栏居中布局（固定为弹性布局）
- 删除首页的视频片段与普通页面布局（仅保留诗意人生与文章摘要）
- 删除谷歌广告（AdSense）与不蒜子统计
- 删除文章分享模块（分享按钮、Fediverse 分享页与二维码）
- 删除分类树布局链路（categories 与树状分类模板、相关配置参数）
- 清理冗余：搜索功能遗留的 `relative-url` 工具、孤儿 i18n 键（`themeSwitcher` 等 5 个）与图标（`home`、`rss` 等 8 个）
- 删除首页底部链接（`menu.home`）的渲染与样式

### 重构

- custom SCSS 16 个文件按类型归并入主题结构（custom/ 仅留空钩子），编译 CSS 规则级等价
- 消除 SCSS 重复定义：配色、顶栏背景、菜单、导航开关、正文间距、代码块、首页诗词等站点值直接写入原规则
- 字体设置收编配置：`fontFamilySiteBrand`/`fontFamilyGlyph`/`fontFamilyStrong`/`fontFamilyArchivesYear`
- 新增 `enableVariableFont` 开关，可变字体轴设置独立为 `base/_variable-font.scss`，仅启用时导入
- 侧边栏宽度与桌面推挤断点配置化（`sidebarWidth`/`sidebarPushBreakpoint`）
- `font-size` 单位统一为 em（代码块等根锚定元素保留 rem）
- 迁移弃用 API：`site.Data`→`hugo.Data`、`site.Languages`→`hugo.Sites`、`.Site.LanguageCode`→`.Site.Language.Locale`、`.Site.Author`→`.Site.Params.author`（构建零警告）
