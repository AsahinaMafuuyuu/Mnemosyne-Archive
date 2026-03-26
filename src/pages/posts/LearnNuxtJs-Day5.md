---
layout: ../../layouts/MarkdownPostLayout.astro
title: 学习NuxtJs
pubDate: 2026-03-16T20:30:00
author: AsahinaMafuyu
description: |-
  学习NuxtJs，本篇介绍了 Nuxt 的 server 目录结构，包括 server/api、server/routes 和 server/middleware，以及它们如何自动生成服务端接口与中间件。
  同时讲解了 请求数据处理方式，如 body、query、cookie 的解析，以及 $fetch 与 fetch 在 Nuxt 中的使用区别。
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/NuxtJs-Cover.png
  alt: NuxtJs Cover
tags:
  - NuxtJs
  - FullStack
  - 学习笔记
---
## server

> 注： server文件夹放在项目的根目录下，和`app`要平级

### api

nuxtJs会自动扫描这些目录当中的文件，具体目录结构如下：

```
-| server/
---| api/
-----| hello.ts      # /api/hello
---| routes/
-----| bonjour.ts    # /bonjour
---| middleware/
-----| log.ts        # log all requests
```

每个文件都应该导出一个使用 `defineEventHandler()` 或 `eventHandler()` （别名）定义的默认函数。

处理程序可以直接返回 JSON 数据、 `Promise` ，或者使用 `event.node.res.end()` 发送响应。

```ts server/api/hello.ts
export default defineEventHandler((event) => {
  return {
    hello: 'world',
  }
})
```

现在您可以在页面和组件中普遍调用此 API：

```vue app/pages/index.vue
<script setup lang="ts">
const { data } = await useFetch('/api/hello')
</script>

<template>
  <pre>{{ data }}</pre>
</template>
```

### route

要添加不带 `/api` 前缀的服务器路由，请将它们放入 `~~/server/routes` 目录中(比如下面例子中，创建`server/routes/hello.ts`)。

```ts server/routes/hello.ts
export default defineEventHandler(() => 'Hello World!')
```

以上述示例为例， `/hello` 路由将可通过 [http://localhost:3000/hello](http://localhost:3000/hello) 访问。

### middleware

Nuxt 会自动读取 `~~/server/middleware` 中的任何文件，为您的项目创建服务器中间件。

中间件处理程序会在任何其他服务器路由之前对每个请求运行，以添加或检查标头、记录请求或扩展事件的请求对象。

例如，在`server/middleware/log.ts`中：

```ts server/middleware/log.ts
export default defineEventHandler((event) => {
  console.log('New request: ' + getRequestURL(event))
})
```

在`auth.ts`中写下：

```ts server/middleware/auth.ts
export default defineEventHandler((event) => {
  event.context.auth = { user: 123 }
})
```

就可以看到中间件依次执行，执行顺序为文件名称顺序，所以建议使用序号：

```
server/
  middleware/
    1.logger.ts <-- 第一个
    2.auth.ts <-- 第二个
    3.... <-- 第三个
```

>请记住，文件名按字符串排序，因此例如如果您有 3 个文件 `1.filename.ts`、`2.filename.ts` 和 `10.filename.ts`，则 `10.filename.ts` 将在 `1.filename.ts` 之后出现。为避免这种情况，前缀 `1-9` 时使用 `0`，如 `01`，如果您在同一目录中有超过 10 个中间件。

### body, query解析

可以创建一个实例：

```ts server/api/submit.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body: ", body)
  return { body }
})
```

然后发送后端请求

```vue app/app.vue
<script setup lang="ts">
async function submit () {
  const { body } = await $fetch('/api/submit', {
    method: 'post',
    body: { test: 123 },
  })
}
</script>
```

如果是query的话，则使用`getQuery`：

```ts server/api/query.get.ts
export default defineEventHandler((event) => {
  const query = getQuery(event)

  return { a: query.foo, b: query.baz }
})
```

> 请求外部接口时：`fetch` 能用，`$fetch` 往往更顺手；请求 Nuxt 自己的服务端接口时：`$fetch` 优势更明显。

`$fetch` 会更省事
`$fetch` 基于 `ofetch`，默认会更智能地处理响应，比如自动解析 JSON；而原生 `fetch` 一般还要自己写：

```ts
const res = await fetch(url)  
const data = await res.json()
```

而 `$fetch` 通常直接就是返回解析后的数据。`ofetch` 官方 README 也明确写了它会智能解析 JSON 响应。
### cookie

```ts
export default defineEventHandler((event) => {
  const cookies = parseCookies(event)

  return { cookies }
})
```

处理服务器请求时，您可能需要执行一些异步任务，这些任务不应阻塞客户端的响应（例如，缓存和日志记录）。您可以使用 `event.waitUntil` 在后台等待 Promise 完成，而不会延迟响应。

`event.waitUntil` 方法接受一个 Promise 对象，该 Promise 对象会在处理程序终止前等待其完成，从而确保即使服务器在发送响应后立即终止处理程序，任务也能最终完成。该方法与运行时提供程序集成，利用其原生功能在发送响应后处理异步操作。

```ts server/api/background-task.ts
const timeConsumingBackgroundTask = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
}

export default eventHandler((event) => {
  // schedule a background task without blocking the response
  event.waitUntil(timeConsumingBackgroundTask())

  // immediately send the response to the client
  return 'done'
})
```

> 也就是说将这些异步方法压入微任务或者宏任务当中，不影响当前阻塞，返回响应之后仍然在服务器端处理这些任务
## Nitro

这里需要补充一些Nitro的知识

>Nitro 支持基于文件的 API 路由（文件会自动映射到 [h3 路由](https://h3.zhcndoc.com/guide/basics/routing)）。定义路由就像在 `server/api/` 或 `server/routes/` 目录内创建一个文件一样简单。

每个文件只能定义一个处理程序，您可以 [将 HTTP 方法附加](https://nitro.zhcndoc.com/docs/routing#specific-request-method) 到文件名，以定义特定的请求方法。

```
routes/
  api/
    test.ts      <-- /api/test
  hello.get.ts   <-- /hello (仅限 GET)
  hello.post.ts  <-- /hello (仅限 POST)
vite.config.ts

```

服务器路由可以在文件名中使用括号内的动态参数，例如 `/api/hello/[name].ts` ，并且可以通过 `event.context.params` 访问。

```
routes/
  api/
    [org]/
      [repo]/
        index.ts   <-- /api/:org/:repo
        issues.ts  <-- /api/:org/:repo/issues
      index.ts     <-- /api/:org
package.json
```

### 带参数的路由

要定义带参数的路由，请使用 `[<param>]` 语法，其中 `<param>` 是参数的名称。该参数将在 `event.context.params` 对象中可用，或使用 [`getRouterParam`](https://h3.zhcndoc.com/utils/request#getrouterparamevent-name-opts-decode) 工具。`routes/hello/[name].ts`

```ts routes/hello/[name].ts
import { defineHandler } from "nitro/h3";

export default defineHandler((event) => {
  const { name } = event.context.params;

  return `Hello ${name}!`;
});
```

如果是多个参数，您可以通过使用 `[<param1>]/[<param2>]` 语法在路由中定义多个参数，其中每个参数都是一个文件夹。您 **不能** 在单个文件名的文件夹中定义多个参数。：

```ts routes/hello/[name]/[age].ts
import { defineHandler } from "nitro/h3";

export default defineHandler((event) => {
  const { name, age } = event.context.params;

  return `Hello ${name}! You are ${age} years old.`;
});
```

默认路由可以使用`routes/[...].ts`,匹配未被任何其他路由匹配的所有路由。这对于创建默认路由非常有用。

## 渲染模式（Rendering Mode）

之前我们学过SSR和CSR这两种渲染模式，Nuxt 默认是 SSR，如果要关闭SSR渲染的话，则需要在`nuxt.config.ts`使用：

```ts nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
})
```

### 混合渲染

混合渲染允许使用**路由规则**为每个路由设置不同的缓存规则，并决定服务器应如何响应给定 URL 上的新请求。

以前，Nuxt 应用和服务器的每个路由/页面都必须使用相同的渲染模式，即通用渲染或客户端渲染。在某些情况下，一些页面可以在构建时生成，而另一些页面则需要客户端渲染。例如，考虑一个包含管理后台的内容网站。每个内容页面都应该是静态的，并且只生成一次，但管理后台需要注册，其行为更像一个动态应用。

Nuxt 包含路由规则和混合渲染支持。使用路由规则，您可以为一组 Nuxt 路由定义规则，更改渲染模式或根据路由分配缓存策略！

`nuxt.config.ts`配置示例如下：

```ts nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
    // Products page generated on demand, revalidates in background, cached until API response changes
    '/products': { swr: true },
    // Product pages generated on demand, revalidates in background, cached for 1 hour (3600 seconds)
    '/products/**': { swr: 3600 },
    // Blog posts page generated on demand, revalidates in background, cached on CDN for 1 hour (3600 seconds)
    '/blog': { isr: 3600 },
    // Blog post page generated on demand once until next deployment, cached on CDN
    '/blog/**': { isr: true },
    // Admin dashboard renders only on client-side
    '/admin/**': { ssr: false },
    // Add cors headers on API routes
    '/api/**': { cors: true },
    // Redirects legacy urls
    '/old-page': { redirect: '/new-page' },
  },
})
```

1. `'/': { prerender: true }`

作用  
首页在 **构建阶段 (build)** 就提前生成 HTML 文件。
也就是说：
- `npm run build` 时就会生成 `/index.html`
    
- 用户访问 `/` 时直接返回这个静态 HTML
    
- 不需要服务器再实时渲染

适合页面

- 首页
    
- About
    
- 联系我们
    
- 几乎不变化的营销页面
    

优点

- 首屏加载非常快
    
- SEO 友好
    
- 几乎没有服务器压力
    

注意

如果首页依赖实时数据（例如库存、实时价格、在线人数），  
`prerender` 可能不适合，因为它是 **build 时的快照**。

---

2. `'/products': { swr: true }`
    

作用  
这个页面使用 **SWR（stale-while-revalidate）缓存策略**。

流程可以理解为：

1 用户请求页面  
2 如果缓存存在 → 直接返回旧页面  
3 同时后台重新生成新的页面  
4 下一次用户访问 → 可能拿到更新后的页面

`swr: true` 与 `swr: 3600` 的区别

- `true` → 开启 SWR，但不指定缓存时间
    
- `3600` → 缓存 3600 秒
    

适合页面

- 商品列表
    
- 新闻列表
    
- 博客列表
    
- 更新频率中等的页面
    

理解方式

可以理解成：

> 先用旧页面顶着，同时后台更新。

---

3. `'/products/**': { swr: 3600 }`
    

作用  
所有 `/products/xxx` 页面启用 **SWR 缓存 1 小时**。

例如：

- `/products/1`
    
- `/products/iphone`
    
- `/products/category/a`
    

都会匹配。

`**` 的含义

表示 **匹配所有子路径**。

流程

1 第一次访问某商品页面  
→ Nuxt 按需生成 HTML

2 页面生成后缓存

3 1 小时内访问  
→ 直接返回缓存

4 缓存过期  
→ 后台重新生成

适合页面

- 商品详情页
    
- 商品数量很多的站点
    
- SEO 要求高的页面
    

原因

商品详情页可能有几万条，  
**不适合 build 时全部 prerender**。

---

4. `'/blog': { isr: 3600 }`
    

作用  
使用 **ISR（Incremental Static Regeneration）**。

逻辑：

1 页面生成一次  
2 缓存 3600 秒  
3 到时间后重新生成

可以理解为：

> 静态页面 + 定期更新

SWR vs ISR

SWR

- 返回旧页面
    
- 同时后台刷新
    

ISR

- 页面作为静态页
    
- 到时间重新生成
    

适合页面

- 博客列表
    
- 文档列表
    
- 内容型网站
    

原因

博客列表：

- 需要 SEO
    
- 不需要每个请求重新 SSR
    
- 每小时更新一次就够
    

---

5. `'/blog/**': { isr: true }`
    

作用  
所有博客详情页使用 ISR。

但 `true` 表示：

- 页面只生成一次
    
- 一直缓存
    
- 直到 **下一次部署**
    

流程

1 第一次访问 `/blog/xxx`  
2 Nuxt 生成 HTML  
3 之后所有用户都使用同一个 HTML  
4 部署后重新生成

适合页面

- 博客文章
    
- 文档详情页
    
- 发布后基本不改的内容
    

例如

第一次访问：

/blog/hello-nuxt

Nuxt 会生成这个页面。

之后所有访问都复用这份 HTML。

---

6. `'/admin/**': { ssr: false }`
    

作用  
关闭 SSR，只使用 **CSR（客户端渲染）**。

流程

1 服务器只返回 JS  
2 浏览器加载 JS  
3 前端渲染页面

适合页面

- 后台管理系统
    
- 用户中心
    
- 需要登录的页面
    

原因

后台系统通常：

- 不需要 SEO
    
- 依赖浏览器 API
    
- 交互复杂
    

好处

- 避免 SSR 兼容问题
    
- 可以直接使用 `window` / `localStorage`
    

缺点

首屏会比 SSR 慢一点。

但后台系统一般无所谓。

---

7. `'/api/**': { cors: true }`
    

作用  
给 `/api` 路由自动添加 **CORS 跨域头**。

CORS 是什么

浏览器默认不允许：

a.com  
去请求  
b.com

CORS 允许服务器声明：

Access-Control-Allow-Origin

表示：

> 这个跨域请求是允许的。

适合场景

- 前端和 API 不在同一域名
    
- 本地开发跨域
    
- 对外提供 API
    

注意

`cors: true` 是简单配置。

生产环境通常需要：

- 限制 origin
    
- 限制 method
    
- 限制 headers
    

---

8. `'/old-page': { redirect: '/new-page' }`
    

作用  
重定向旧地址到新地址。

访问

/old-page

会自动跳转到

/new-page

适合场景

- 页面路径修改
    
- SEO 迁移
    
- 保持旧链接可访问
    

好处

- 用户不会看到 404
    
- 搜索引擎可以继承权重

> 上面太长的话看这个就行了：
> - `redirect : string` - 定义服务器端重定向。
> - `ssr : boolean` - 禁用应用程序部分 HTML 的服务器端渲染，使其仅在浏览器中渲染（ `ssr: false`
> - `cors : boolean` - 如果 `cors: true` 则自动添加 CORS 标头 - 您可以通过覆盖 `headers` 来自定义输出
> - `headers : object` - 为网站的各个部分添加特定的标头，例如，您的资源。
> - `swr : number | boolean` - 向服务器响应添加缓存头，并将其缓存在服务器或反向代理上，缓存时间 (TTL) 可配置。Nitro 的 `node-server` 预设能够缓存完整的响应。当 TTL 过期时，将发送缓存的响应，同时在后台重新生成页面。如果设置为 true，则会添加一个不带 MaxAge 的 `stale-while-revalidate` 标头。
> - `isr : number | boolean` - 其行为与 `swr` 相同，区别在于我们可以将响应添加到支持此功能的平台（目前为 Netlify 或 Vercel）的 CDN 缓存中。如果设置为 `true` ，则内容将保留在 CDN 中，直到下次部署。
> - `prerender : boolean` - 在构建时预渲染路由，并将其作为静态资源包含在构建中。
> - `noScripts : boolean` - 禁用网站部分 Nuxt 脚本和 JS 资源提示的渲染。
> - `appMiddleware: string | string[] | Record<string, boolean>` - 允许您定义中间件，该中间件应该或不应该在应用程序的 Vue 应用部分（即，不是您的 Nitro 路由）中的页面路径上运行。

### 边缘渲染

当用户请求页面时，请求不会直接发送到原始服务器，而是会被最近的边缘服务器拦截。该边缘服务器会生成页面的 HTML 代码并将其发送回用户。这个过程最大限度地缩短了数据传输的物理距离， **从而降低了延迟，加快了页面加载速度** 。

目前您可以使用 ESR 的平台包括：

- [Cloudflare Pages](https://pages.cloudflare.com/): 使用 git 集成和 `nuxt build` 命令，无需任何配置[即可创建 Cloudflare Pages。](https://pages.cloudflare.com/)
- [Vercel Cloud](https://vercel.com/home): 使用 `nuxt build` 命令和 `NITRO_PRESET=vercel-edge` 环境变量[构建 Vercel Cloud](https://vercel.com/home)
- [Netlify Edge Functions](https://www.netlify.com/platform/#netlify-edge-functions): 使用 `nuxt build` 命令和 `NITRO_PRESET=netlify-edge` 环境变量来[配置 Netlify Edge Functions](https://www.netlify.com/platform/#netlify-edge-functions)

