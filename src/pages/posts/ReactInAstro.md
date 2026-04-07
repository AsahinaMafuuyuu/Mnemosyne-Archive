---
layout: ../../layouts/MarkdownPostLayout.astro
title: 学习在Astro中构建React
pubDate: 2026-04-07T21:24:00
author: AsahinaMafuyu
description: 最近学习了React，想着要练习一下React，正好也要将我之前的那份前端工程进行重构，也就是AudioPlayer，趁此正好也能深入练习版本控制
cover:
  url:
  alt:
tags:
  - React
  - astro
  - 前端
  - 前端工程
---
## 安装

```bash
npm install @astrojs/react
```

同时还要安装相对应的依赖：

```bash
npm install react react-dom @types/react @types/react-dom
```

然后，使用 `integrations` 属性将此集成应用到你的 `astro.config.*` 文件中：

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
	// ...
	integrations: [react()],
});
```

然后添加下面的代码到 `tsconfig.json` 文件中。

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```