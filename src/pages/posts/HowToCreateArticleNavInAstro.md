---
layout: ../../layouts/MarkdownPostLayout.astro
title: 如何优雅的在astro的文章页面当中生成导航nav
pubDate: 2026-02-27T12:23:00
author: AsahinaMafuyu
description: 之前一直留着这个bug没有去做，现在的话好好的研究一下如何去做
cover:
  url:
  alt:
tags:
  - 前端
  - 心得
  - 工程规范
---
## 前言

首先我们需要知道：对于一个规范的markdown文章而言，主标题只能有一个（用h1）就是文章标题，其余的每个章节标题（前言这种）用h2，而且一个页面按理来说，最多递归三层（h2,h3,h4）

## Astro中自动生成目录递归树(该文案已废弃)

在官方文档中([在 Astro 中使用 Markdown | 文档 - Astro 文档](https://docs.astro.js.cn/en/guides/markdown-content/#importing-markdown))，就介绍了markdown有一个导出的属性：
	**`getHeadings()`** - 一个异步函数，它返回文件中所有标题（`<h1>` 到 `<h6>`）的数组，类型为：`{ depth: number; slug: string; text: string }[]`。每个标题的 `slug` 对应于为该标题生成的 ID

示例如下：

```json
Astro.props = {
	getHeadings: () => [
		{"depth": 1, "text": "Astro 0.18 Release", "slug": "astro-018-release"},
		{"depth": 2, "text": "Responsive partial hydration", "slug": "responsive-partial-hydration"}
		/* ... */
	],
}
```

## 构建期生成nav

构建期的话，通过 **`compiledContent()`** 可以拿到页面的html字符串，然后再用正则表达式获取到h标题，然后生成对应的嵌套目录表即可




