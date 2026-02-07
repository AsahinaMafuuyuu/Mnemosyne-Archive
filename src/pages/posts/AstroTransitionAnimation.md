---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Astro中如何制作过渡动画"
pubDate: "2026-02-01"
author: AsahinaMafuyu
description: "想要构建单页面应用，Astro的过渡动画是不得不品的一个环节"
tags: ["astro", "blog", "animation", "前端", "css"]
---
直接大白话讲清楚：首先需要在每一个布局的`<head>`标签当中添加`<ClientRouter>`:
```html
---
import { ClientRouter } from "astro:transitions";
---
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    ...
    <ClientRouter /> 
  </head>
  <body>
    ...
  </body>
</html>
```
让ClientRouter来接管这个页面，接下来就是重点：
> 1. 通过每个页面切换的时候，相同的**transition:name**进行对应的过渡切换,比如两个页面都用到了`BaseLayout.astro`这个组件，并且通过插槽注入，那么我们可以直接给插槽进行动画过渡：
> ```html
>  <!-- 正文博客内容展示 -->
>          <div transition:name="mainContent">
>           <slot name="mainContent" />
>         </div>
> ```
> 此时的话由于两个页面进行过渡的时候，都是共用这一个插槽，因此过渡的话针对这个插槽进行过渡,类似的还有Image，比如普通页面有一个略缩图，而详情页就会放大并且改变位置，那么将这个图片绑定transition:name的话，图片从普通页面过渡到详情页面的时候也是平滑过渡
