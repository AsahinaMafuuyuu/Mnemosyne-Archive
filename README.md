

<!-- =====================================================
Mnemosyne-Archive README
===================================================== -->

<p align="center">
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
  <a href="#功能">Features</a>
  ·
  <a href="#待完善的功能">Waiting for Implementation</a>
  ·
  <a href="#写作模板">Writing</a>
  ·
  <a href="#部署">Deploy</a>
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

## 功能

- **Markdown 文章驱动**：文章放在 `src/pages/posts/*.md`，自动参与构建与展示，并且我的博客文章会持续更新在这里。  
- **分页首页**：`src/pages/[page].astro` 做分页与排序（按 `pubDate` 倒序），分页构建的话就会让首页保持简洁，适合长期积累。  
- **主题与观感设置**：暗色模式、背景图切换、模糊强度（CSS 变量驱动）  
- **RSS**：已集成 `@astrojs/rss`，默认路由通常为 `/rss.xml` ，或者点击右上角的图标打开仪表盘，里面会有RSS订阅，点击即可复制链接
- **侧边栏音乐播放器**：沉浸式播放（项目内含 Aside 播放器组件），不过该功能有一个bug，那就是拖动进度条会导致播放进度直接重置，计划未来修复这个问题。
- **轻量但细节控的 UI**：Tailwind v4 + 自定义 utilities / tokens，让样式更“像一个作品”

> 目标：把博客做成「可持续维护的知识仓库」，同时保留一点 ACG 的浪漫感，再加上这个博客是我自己亲手搭建的，基本上99的代码都是自己写的，当然，很多思路也会参考别人的博客，我尽量在上面加一些小的改动，而且对于博客搭建方面也能够对前端技术栈做一个非常好的练习，尤其是本博客后期用到SSR，Astro也是一个不错的框架，未来顺便出相关的教程。

---

## 技术栈

- **Astro 5**（站点框架）
- **Tailwind CSS v4**（含 Vite 插件；项目内有 `watchTailwind` 输出 CSS）
- **Preact**（用于交互型组件）
- **Sass**（样式辅助）

---

## 目录结构（核心）

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

---

## 写作模板

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
  url:
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

> 如果对于obsidian中插入图片有不懂的部分，我的建议是做成相对路径，然后存放到src/assets/images当中，astro在构建的时候通过编译器会把这些图片复制到dist目录下的相应位置。

---

## 主题与样式

- 主题基于 CSS 变量（如 `--font-color`、`--background-color`、`--blur-val`）
- Tailwind v4 的 token / utility 也在 `src/styles/` 中做了封装

本博客支持暗色和亮色的主题切换，未来打算增加更多的主题设置，包括博客的边框特效，装饰等等

---

## 部署

### Cloudflare Workers（静态资源）

仓库自带 `wrangler.jsonc`，指向 `./dist` 作为 assets 目录。典型流程：

```bash
npm run build
wrangler deploy
```

本博客是直接部署在 Cloudflare Workers 上的，利用其静态资源托管功能，部署后会得到一个 Workers 的 URL，访问这个 URL 就能看到博客了，未来可能会打算做一篇关于部署的教程。

---

## Roadmap（想做/可做）

- [x] 文章字数 / 阅读时长自动计算
- [ ] 文章搜索与标签聚合页
- [x] 访问量 / 统计接入（可选：Cloudflare Analytics / 自建 API）
- [ ] 更完善的封面与社交分享图（OG Image）
- [ ] 标签云 / 相关文章推荐
- [ ] 更丰富的主题设置（边框特效、装饰元素等）
- [ ] 文章内的评论功能以及站点的留言板

---

## License

[MIT](https://github.com/AsahinaMafuuyuu/Mnemosyne-Archive?tab=MIT-1-ov-file#readme) © AsahinaMafuyu
