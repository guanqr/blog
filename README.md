# <div align="center"><a title="Guanqr's blog repository" href="https://github.com/guanqr/blog"><img align="center" width="75" height="75" src="https://raw.githubusercontent.com/guanqr/blog/master/static/icons/favicon.svg?sanitize=true"></a> 荷戟独彷徨</div>

<div align="center">

[![Home](https://img.shields.io/badge/Home-Guanqr-aa96da)](https://guanqr.com)
[![Generator](https://img.shields.io/badge/Generator-Hugo-ff4088?&logo=hugo)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/Theme-MemE-2a6df4)](https://github.com/reuixiy/hugo-theme-meme)
[![Build](https://github.com/guanqr/blog/workflows/build/badge.svg)](https://github.com/guanqr/blog/actions)

</div>

## 关于

个人博客，基于 [Hugo](https://gohugo.io/) 静态站点生成器和 [MemE](https://github.com/reuixiy/hugo-theme-meme) 主题。所有主题定制均通过外层覆盖实现，不修改主题文件。

关键词：生活、悦读、品影、旅行、幻想、科学、技术、光学、计算机。

## 特性

### 配色
- 亮色 / 暗色双主题，一键切换（仅亮↔暗，无系统跟随模式）
- 金色主色调，其余对比度层级保持 MemE 原版
- `[data-theme]` CSS 选择器控制图标可见性，不依赖 JS 时序

### 归档
- 年份 URL 路由：`/archives/2025/` 等，由 Hugo Content Adapter 自动生成
- 即时切换年份，`pushState` 同步 URL
- 键盘 ← → 导航

### 页面过渡
- 站内链接 SPA 式切换：淡出 → fetch → 替换 → 淡入
- 浏览器前进/后退支持
- `<base href="/">` 确保 pushState 后相对路径正确

### 顶栏
- 纯色半透明背景 + 毛玻璃模糊
- 金色底边线
- 中英文双语

## 结构

```
├── assets/scss/custom/    # SCSS 覆盖（配色、顶栏、归档导航等）
├── content/zh/archives/   # 归档（含 _content.gotmpl 内容适配器）
├── layouts/               # 模板覆盖（section、partials、shortcodes）
│   └── partials/components/dark-mode.html  # 主题切换按钮
├── static/js/             # 自定义 JS
│   ├── page-transition.js # 页面过渡
│   └── archives.js        # 归档年份切换
├── config.toml            # 站点配置
└── themes/meme/           # MemE 主题（git submodule）
```

## 本地运行

```bash
# 克隆（含子模块）
git clone --recursive https://github.com/guanqr/blog.git
cd blog

# 启动开发服务器
hugo serve

# 构建
hugo
```

## 许可

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>

本博客所有文章除特别声明外，均采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
