# 博客代码修改要求

本文件总结自 memoree 主题（themes/memoree/）的重构过程，适用于本站所有代码修改工作。

## 提交纪律

- **任何代码修改完成后都不自动 git commit**，停留工作区供用户检查；用户明确说「提交」后才提交
- `content/` 下的文章与 `data/booklist.toml` 等用户个人内容**一律不修改、不提交**（未跟踪的草稿文章同样不动）
- `git add` 逐路径指定，禁止 `git add -A`

### Commit Message 格式

- 首行以约定前缀开头，随后写明主要改动内容：
  - `feat:` 新功能 / `fix:` 修复 / `refactor:` 重构 / `style:` 样式与格式 / `docs:` 文档 / `trim:` 删除与精简 / `chore:` 杂项
- 中英文均可，但条理要清晰：正文逐条列出改动（1、2、3…），每条一行
- 示例：
  ```
  refactor: 配置化字体与侧边栏

  1. 字体栈收编 hugo.toml 配置
  2. 新增 enableVariableFont 开关与独立可变字体文件
  3. 侧边栏尺寸参数化
  ```

## 修改原则

- **值等价优先**：重构/整理类修改不得改变渲染结果；完成后必须构建并用基线对比验证（CSS 规则级对比或 winner-map 声明对比），差异逐项解释
- **改原规则而非追加覆盖**：站点值应直接写入主题原有规则（或收编配置），不在文件末尾追加重复定义的覆盖块
- **配置驱动**：字体栈、尺寸、开关等设计常量收编到 `hugo.toml`；为功能新增配置项时用注释说明用途
- **一功能一文件**：SCSS 按 base/components/layout/pages/themes 分层；功能样式独立成文件，由 main.scss 按配置开关条件导入（参考 `enableVariableFont` → `base/_variable-font.scss`）
- **删除功能要删干净**：模板、样式、JS、配置参数、i18n 键、SVG 图标、残留引用一并清理（`custom/_custom.scss` 空钩子与 `custom.js` 空桩保留）
- **不使用冗余抽象**：单次引用的 CSS 变量直接内联字面量；手调数值不强行用系数表达

## 代码风格

- `font-size` 统一用 `em`；根锚定元素（代码块 `pre`/`.highlight`、404 标题等）用 `rem`；不使用百分比
- 使用 Hugo 0.164 现行 API：`hugo.Data`（非 `site.Data`）、`hugo.Sites`（非 `.Site.Languages`）、`.Site.Language.Locale`（非 `.Site.LanguageCode`）、`.Site.Params.author`（非 `.Site.Author`）；构建保持**零警告**
- 编辑含中文/UTF-8 文件时保持**无 BOM**、不改动无关行

## 构建与验证

- 本地 Hugo extended ≥ 0.164.0；`hugo` 命令默认即 production 环境，`hugo serve` 为 development
- 每次改动后至少跑一次 `hugo --gc --minify --cleanDestinationDir -e production` 确认 0 error
- 大改动前后用 public/ 文件哈希清单或编译 CSS 对比，确认输出差异仅为预期项（注意 feed 文件含 `now` 时间戳属正常波动）

## CHANGELOG 约定

- `themes/memoree/CHANGELOG.md` 从 v1.0.0 起记录；**仅当用户指示时更新**（版本号由用户决定）
- 记录口径：
  - 只记录主题自身的修改；站点配置文件的重命名、死注释清理等卫生操作**不记录**，只记录「为主题新增的配置项」
  - 同一版本内「出现又修复」的问题视为从未发生，**不记录**（不设修复条目）
- 主题渊源表述统一为「基于 hugo-theme-meme 修改」

## 其他约定

- `oss_config.json` 含明文阿里云密钥（已在 .gitignore）：不提交、不修改；若仓库公开需先轮换密钥
- 图片上传使用 `upload-images.bat`（scripts/upload-images.py 上传至 OSS），与 Hugo 构建无关
- 部署由 GitHub Actions 自动完成（推送 master 即构建部署至 guanqr.github.io），无需本地发布
