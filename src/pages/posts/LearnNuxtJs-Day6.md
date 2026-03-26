---
layout: ../../layouts/MarkdownPostLayout.astro
title: 学习NuxtJs
pubDate: 2026-03-01T15:44:00
author: AsahinaMafuyu
description: 学习NuxtJs，本文主要学习...
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/NuxtJs-Cover.png
  alt: NuxtJs Cover
tags:
  - NuxtJs
  - FullStack
  - 学习笔记
---
## 数据获取

Nuxt 提供了两个可组合组件和一个内置库，用于在浏览器或服务器环境中执行数据获取： `useFetch` 、 [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) 和 `$fetch` 。

- [`$fetch`](https://nuxt.com/docs/4.x/api/utils/dollarfetch) 是发出网络请求的最简单方法。
- [`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) 是 `$fetch` 的一个包装器，它在[通用渲染](https://nuxt.com/docs/4.x/guide/concepts/rendering#universal-rendering)中只获取一次数据。
- [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) 与 `useFetch` 类似，但提供了更精细的控制。

如果在 Vue 组件的 setup 函数中使用 [`$fetch` 函数](https://nuxt.com/docs/4.x/api/utils/dollarfetch)来获取数据，则可能导致数据被获取两次：一次在服务器端（用于渲染 HTML），另一次在客户端（HTML 加载完成后）。这可能会导致加载问题、增加交互响应时间，并造成不可预测的行为。

[`useFetch`](https://nuxt.com/docs/4.x/api/composables/use-fetch) 和 [`useAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-async-data) 可组合组件通过确保在服务器上发出 API 调用时，将数据转发到客户端的有效负载中来解决此问题。

> 也就是说在启用SSR的时候，如果在setup内使用`$fetch`的话，由于服务端会进行一次SSR渲染和JS执行，因此在服务端执行一次$fetch，而客户端收到服务端传送过来的js后还会执行一次？

- **SSR 首次请求页面时**
    
    - 服务端会先执行一遍页面的 `setup`，把 HTML 渲染出来。
        
    - 如果你在 `setup` 里直接写：
        
        const dataTwice = await $fetch('/api/item')
        
        那么这次 **服务端会先请求一次**。
        
- **浏览器拿到 HTML + 客户端 JS 后**
    
    - 前端还要进行一次 **hydrate（激活）**，本质上客户端也会重新跑一遍组件逻辑。
        
    - 于是 `setup` 里的这句 `$fetch('/api/item')` **又会在客户端执行一次**。
        
    - 所以就形成了 **服务端一次 + 客户端一次**。Nuxt 官方也明确说明了：在组件里直接用 `$fetch` 会导致 SSR 场景下重复获取数据。
        
- **为什么 `useAsyncData` / `useFetch` 不会重复？**
    
    - 因为它们会把服务端拿到的数据放进 Nuxt 的 **payload** 里，一起传给客户端。
        
    - 客户端 hydrate 时，直接复用这份数据，而不是再请求一次。

`useFetch` 和 `useAsyncData` 具有相同的返回值，如下所示：

- `data` ：传入的异步函数的结果。
- `refresh` / `execute` ：可用于刷新 `handler` 函数返回的数据的函数。
- `clear` ：一个可用于将 `data` 设置为 `undefined` （或提供 `options.default()` 的值）、将 `error` 设置为 `undefined` 、将 `status` 设置为 `idle` 以及将任何当前挂起的请求标记为已取消的函数。
- `error` ：如果数据获取失败，则返回一个错误对象。
- `status` ：表示数据请求状态的字符串（ `"idle"` 、 `"pending"` 、 `"success"` 、 `"error"` ）。

### Suspense

假设你有一个页面：
- 用户信息组件要先请求接口
- 订单列表组件也要请求接口
- 推荐商品组件还是异步组件懒加载出来的
如果不用 Suspense，常见情况就是：
- 上面一个 loading
- 中间一个 loading
- 下面再一个 loading
- 页面东一块西一块陆续出来
而 `<Suspense>` 的思路是：

> “这些异步事情你们先做，我在最外层先给用户看一个统一的 fallback（加载中界面）。等你们都好了，我再把正式页面整体切上来。”

Vue 官方把它定义为：**协调组件树中异步依赖的内置组件**，可以在等待多个嵌套异步依赖完成时渲染一个 loading 状态。并且它目前仍被官方标记为 **experimental feature**。

`Suspense`主要会等两类异步依赖：

1. **带 `async setup()` 的组件**
2. **异步组件（async components）**

另外，`<script setup>` 里用了**顶层 `await`**，本质上也会让这个组件变成 Suspense 可感知的异步依赖。

最小的例子：

子组件：异步 setup

```vue
<!-- UserPanel.vue -->  
<script setup>  
const res = await fetch('/api/user')  
const user = await res.json()  
</script>  
  
<template>  
<div>{{ user.name }}</div>  
</template>
```

父组件：用 Suspense 包起来

```vue
<template>
  <Suspense>
    <template #default>
      <UserPanel />
    </template>

    <template #fallback>
      <div>用户信息加载中...</div>
    </template>
  </Suspense>
</template>
```

这里的执行流程可以理解成：

1. 父组件准备渲染 `UserPanel`
2. 发现 `UserPanel` 里面有异步依赖（顶层 `await`）
3. 于是 Suspense 先不让正式内容上屏
4. 先显示 `fallback`
5. 等 `UserPanel` 的异步完成
6. 再把正式内容替换上去

多个组件形成一个页面的话，可以包成一个总页面组件：

```vue
<Suspense>  
<template #default>  
<Dashboard />  
</template>  
  
<template #fallback>  
<div>页面加载中...</div>  
</template>  
</Suspense>
```

然后 `Dashboard` 里面再放：

```vue
<template>
  <UserPanel />
  <UserInfo />
  <Main />
  <Bottom />
</template>
```

## SEO META

在 [`nuxt.config.ts`](https://nuxt.com/docs/4.x/directory-structure/nuxt-config) 中提供 [`app.head`](https://nuxt.com/docs/4.x/api/nuxt-config#head) 属性，可以静态地自定义整个应用程序的头部。

```ts nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Nuxt', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
```

### useHead

useHead 可以自定义 Nuxt 应用各个页面的头部属性。
`useHead` 可组合组件允许您以编程和响应式的方式管理您的 head 标签，它由 [Unhead](https://unhead.unjs.io/) 提供支持。它允许您自定义 HTML 文档 `<head>` 部分中的 meta 标签、链接、脚本和其他元素。

```vue app.vue
<script setup lang="ts">
useHead({
  title: 'My App',
  meta: [
    { name: 'description', content: 'My amazing site.' },
  ],
  bodyAttrs: {
    class: 'test',
  },
  script: [{ innerHTML: 'console.log(\'Hello world\')' }],
})
</script>
```

关于头部的信息配置，详见[useHead · Nuxt Composables v4](https://nuxt.com/docs/4.x/api/composables/use-head)

```vue
<script setup lang="ts">
useHead({
  title: 'About Us',
  meta: [
    { name: 'description', content: 'Learn more about our company' },
    { property: 'og:title', content: 'About Us' },
    { property: 'og:description', content: 'Learn more about our company' },
  ],
})
</script>
```

添加外部脚本和样式

```vue
<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.example.com/styles.css',
    },
  ],
  script: [
    {
      src: 'https://cdn.example.com/script.js',
      async: true,
    },
  ],
})
</script>
```

其次，script也支持内置：

```vue
<script setup lang="ts">
useHead({
  script: [
    {
      innerHTML: 'console.log("hello, sekai")'
    },
  ],
})
</script>
```

`innerHTML`也就是：

```vue
<script>  
console.log('Hello world')  
</script>
```

style也是，通通使用`innerHTML`

## 生命周期

Nuxt 会渲染页面及其组件，并使用 `useFetch` 和 `useAsyncData` 获取所需的数据(setup时期的组件)。由于服务器端不会进行动态更新或 DOM 操作，因此 Vue 生命周期钩子（例如 `onBeforeMount` 、 `onMounted` 及后续钩子） **不会**在 SSR 期间执行。

生命周期具体可看：[NuxtLoadingIndicator · Nuxt Components v4](https://nuxt.com/docs/4.x/guide/concepts/nuxt-lifecycle#page-and-components)



