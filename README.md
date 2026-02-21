<!-- =====================================================
Mnemosyne-Archive README
===================================================== -->

<p align="center">0-
  <img src="src/assets/images/kanade.png" width="128" alt="Kanade" />
</p>

<h1 align="center">Mnemosyne-Archive</h1>

<p align="center">
  <b>AsahinaMafuyu 的个人知识库 / 博客站</b><br/>
  <sub>Content-driven • ACG flavored • Fast & tidy • Built with Astro</sub>
</p>

<p align="center">
  <a href="https://asahinamafuyu.top">Live Demo</a>
  ·
  <a href="#-功能">Features</a>
  ·
  <a href="#-快速开始">Quick Start</a>
  ·
  <a href="#-写作指南">Writing</a>
  ·
  <a href="#-部署">Deploy</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/AsahinaMafuuyuu/Mnemosyne-Archive?style=flat" />
  <img src="https://img.shields.io/github/last-commit/AsahinaMafuuyuu/Mnemosyne-Archive?style=flat" />
  <img src="https://img.shields.io/badge/Astro-5.x-ff5d01?logo=astro&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Preact-10.x-673ab8?logo=preact&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
</p>

<p align="center">
  <img src="src/assets/images/AiPai.webp" alt="Banner" width="100%"/>
</p>

---

## ✨ 功能

- **Markdown 文章驱动**：文章放在 `src/pages/posts/*.md`，自动参与构建与展示  
- **分页首页**：`src/pages/[page].astro` 做分页与排序（按 `pubDate` 倒序）  
- **主题与观感设置**：暗色模式、背景图切换、模糊强度（CSS 变量驱动）  
- **RSS**：已集成 `@astrojs/rss`，默认路由通常为 `/rss.xml`  
- **侧边栏音乐播放器**：沉浸式播放（项目内含 Aside 播放器组件）  
- **轻量但细节控的 UI**：Tailwind v4 + 自定义 utilities / tokens，让样式更“像一个作品”

> 目标：把博客做成「可持续维护的知识仓库」，同时保留一点 ACG 的浪漫感。

---

## 🧱 技术栈

- **Astro 5**（站点框架）
- **Tailwind CSS v4**（含 Vite 插件；项目内有 `watchTailwind` 输出 CSS）
- **Preact**（用于交互型组件）
- **Sass**（样式辅助）

---

## 📁 目录结构（核心）

```text
.
├─ src/
│  ├─ pages/
│  │  ├─ [page].astro          # 分页首页
│  │  └─ posts/*.md            # Markdown 文章
│  ├─ layouts/
│  │  ├─ BaseLayout.astro
│  │  └─ MarkdownPostLayout.astro
│  ├─ components/              # UI / 播放器 / 博文组件
│  └─ styles/                  # 主题 tokens / markdown 样式等
├─ public/                     # 静态资源（图片等，URL 以 / 开头引用）
├─ dist/                       # astro build 输出
└─ wrangler.jsonc              # Cloudflare Workers 静态资源部署入口
```
## 🚀 快速开始

> Astro 5.x 对 Node.js 有最低版本要求；实际开发建议使用较新的 Node LTS（例如 20 / 22）。  
> 不同小版本可能提高最低 Node 要求，升级时请留意官方说明。

### 1) 安装依赖

```bash
npm install
```

### 2) 开发模式

```bash
npm run dev
```

默认启动在：`http://localhost:4321`

### 3) Tailwind 监听（重要）

本项目使用 `watchTailwind` 将 `src/input.css` 编译到 `src/output.css`，布局会引用该输出文件。

```bash
npm run watchTailwind
```

> 建议：开两个终端，一个跑 `dev`，一个跑 `watchTailwind`。

### 4) 构建与预览

```bash
npm run build
npm run preview
```

---

## ✍️ 写作指南

### 新建文章

在 `src/pages/posts/` 新建一个 `.md` 文件，建议模板如下：

```md
---
layout: ../../layouts/MarkdownPostLayout.astro
title: "文章标题"
pubDate: 2026-02-19T12:00:00
author: "AsahinaMafuyu"
description: "一句话简介（会在列表与详情页展示）"
cover:
  src:
  alt:
tags:
  - tag1
  - tag2
---

# 正文从这里开始
```

### 图片引用建议

把图片放到 `public/images/posts/`，在 Markdown 中这样写：

```md
![](/images/posts/your-image.png)
```

> 小提示：如果你从 Obsidian 迁移，可能会出现 `/public/...` 这种路径，建议统一替换成以 `/` 开头的站点路径。

---

## 🎨 主题与样式

- 主题基于 CSS 变量（如 `--font-color`、`--background-color`、`--blur-val`）
- Tailwind v4 的 token / utility 也在 `src/styles/` 中做了封装

你可以从这两处入手改“气质”：

- `src/styles/theme.runtime.css`：运行时变量（亮/暗色）
- `src/styles/theme.token.css`：语义化 token（字号、权重、颜色映射）

---

## 📦 部署

### Vercel（最省心）

- 直接导入仓库
- Build Command：`npm run build`
- Output：`dist`

### Cloudflare Workers（静态资源）

仓库自带 `wrangler.jsonc`，指向 `./dist` 作为 assets 目录。典型流程：

```bash
npm run build
wrangler deploy
```

---

## 🗺️ Roadmap（想做/可做）

- [ ] 文章字数 / 阅读时长自动计算
- [ ] 文章搜索与标签聚合页
- [ ] 访问量 / 统计接入（可选：Cloudflare Analytics / 自建 API）
- [ ] 更完善的封面与社交分享图（OG Image）

---

## 🤝 Contributing

欢迎提 Issue / PR：

- Bug / 样式建议 / 交互改进
- 组件抽象与工程化优化
- 文档与写作体验增强

---

## 📝 License

当前仓库未放置 LICENSE 文件。  
如果你准备开源复用 / 接受外部贡献，建议补一个（如 MIT / Apache-2.0 / GPL 等）。
