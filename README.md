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
- `[data-theme]` CSS 选择器控制图标可见性

### 归档
- 年份 URL 路由：`/archives/2025/` 等，由 Hugo Content Adapter 自动生成
- 即时切换年份，`pushState` 同步 URL
- 键盘 ← → 导航

### 图床
- 图片托管于阿里云 OSS（`guanqr.oss-cn-hangzhou.aliyuncs.com`）
- `scripts/upload-images.py` 一键增量上传，本地缓存避免重复

### 顶栏
- 纯色半透明背景 + 毛玻璃模糊，金色底边线
- 宽窄屏自适应，`resize` 自动清理菜单状态

## 结构

```
├── assets/scss/custom/    # SCSS 覆盖
│   ├── _colors.scss       # 配色
│   ├── _post-title.scss   # 标题 & 英文副标题
│   └── ...
├── content/zh/archives/   # 归档（含 _content.gotmpl 内容适配器）
├── layouts/               # 模板覆盖
├── static/js/
│   └── archives.js        # 归档年份切换
├── scripts/
│   └── upload-images.py   # OSS 图片上传
├── upload-images.bat      # 一键上传
├── config.toml
└── themes/meme/           # MemE 主题（git submodule）
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
