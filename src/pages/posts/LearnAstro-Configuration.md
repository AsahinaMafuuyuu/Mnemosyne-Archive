---
layout: ../../layouts/MarkdownPostLayout.astro
title: 学习astro-配置文件
pubDate: 2026-02-24T15:40:00
author: AsahinaMafuyu
description: astro配置文件是一个js文件，用来配置启动项目时的一些配置，由于astro是一个启动工具，因此它的各种配置和vite.config.ts类似哦
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/LearnAstro-Configuration-Cover.jpg
  alt:
tags:
  - astro
  - 前端
  - 从零开始学习astro
---
## Astro中配置文件

astro中的配置文件为`astro.config.mjs`，`.mjs` 是 **JavaScript 的 ES Module（ESM）模块文件扩展名**。由于js文件可以有CommonJs和ESM，因此`.mjs`就是用来告诉Node这个文件用ESM来解析

`astro.config.mjs`的基本文件内容如下：

```js astro.config.mjs
import { defineConfig } from "astro/config";
export default defineConfig({
// your configuration options here...
});
```

通常有几个比较重要的配置
1. site: 最终部署的时候的URL，比如我的博客是`asahinamafuyu.top`，那么配置如下：
	```json
	{
		site: "https://asahinamafuyu.top/"
	}
	```
2. base: 由于astro是静态页面，因此构建的时候会统一将所有资源都扔在一个目录下，使用此选项时，所有静态资源导入和 URL 都应添加该基本路径作为前缀。你可以通过 `import.meta.env.BASE_URL` 访问此值。
	```json
	{
		base: '/doc/'
	}
	```
	同时如果此时设置了 `trailingSlash: "always"`，则始终包含末尾斜杠。如果设置了 `trailingSlash: "never"`，即使 `base` 包含末尾斜杠，`BASE_URL` 也不会包含。
	```json
	{
		base: '/docs/',
		trailingSlash: "never" // 此时`import.meta.env.BASE_URL` 和 `config.base` 的值都将是 `/docs`， 若trailingSlash: "always",则`import.meta.env.BASE_URL` 和 `config.base` 的值都将是 `/docs/`
	}
	```
	> 配置`trailingSlash: "ignore"`的话无论URL结尾是否有/都会匹配
	
3. redirect: 指定重定向的映射，其中键是要匹配的路由，值是要重定向到的路径。你可以重定向静态和动态路由，但只能重定向到同一种类型的路由。例如，你不能有 `'/article': '/blog/[...slug]'` 这样的重定向。
	配置例子如下：
	```json
	redirects: {
	   '/old': '/new',
	   '/blog/[...slug]': '/articles/[...slug]',
	   '/about': 'https://example.com/about',
	   '/news': {
		    status: 302,
		    destination: 'https://example.com/news'
	   },
	   // '/product1/', '/product1' // Note, this is not supported
	}
	```
4. output: 这个和第一次讲的服务端渲染相关，是希望页面是静态渲染（SSG）还是服务器渲染（SSR），有两个值"static"和“server”
	```json
	{
		output: 'static'
	}
	```
5. adapter,这个主要是配置适配器，将项目部署到对应的服务器上，不过暂时可以不用考虑
6. integrations，这个**非常重要**，如果项目中包含其他框架（例如vue，react等）、新功能（如站点地图）和新库（如 Partytown）的一站式解决方案，则需要在此声明框架：
	```js 
	import react from '@astrojs/react';
	import mdx from '@astrojs/mdx';
	{
		// Example: Add React + MDX support to Astro
		integrations: [react(), mdx()]
	}
	```
7. vite: 向 Vite 传递额外的配置选项。具体可以参考[配置 Vite | Vite 构建工具](https://vite.org.cn/config/)
	比如我的项目中集成了tailwind，那么：
	```js
	import tailwindcss from "@tailwindcss/vite";
	export default defineConfig({
		vite: {
		    plugins: [tailwindcss()]
	    }
    })
	```
8. devToolbar.enabled: 建议设置为false，后期会用到，但前期用不到，主要是来检查岛屿性能优化方面的
	```json
	{
		devToolbar: {
		    enabled: false
	    }
	}
	```