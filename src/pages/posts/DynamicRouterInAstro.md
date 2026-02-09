---
layout: ../../layouts/MarkdownPostLayout.astro
title: 在Astro中使用动态路由吧
pubDate: 2026-02-07
author: AsahinaMafuyu
description: "最近搭建blog的时候，发现一个很苦恼的问题：如何进行文章分页？也就是如何使用动态路由将文章的list读取出来并且重新构建"
tags: ["前端", "html", "scrollbar"]
---
## 为什么要用静态博客
在考虑如何使用分页的时候，首先思考一个问题：为什么要用静态博客？静态博客的分页通常非常单一化（即不支持自定义个数，不支持自定义排序等等，即使有自定义排序，也只是非自定义的自定义排序**(这句话是一个哲理)**）

这样深入思考以后就可以发现一个非常重要的事实，那就是：**静态博客的分页条，分类，归档等等，都是不需要用到后端的**，直接在构建期直接动态通过`Astro.params`来构建路由，内容其实在构建期已经决定了

## 动态路由的食用方法
动态路由的页面通常是在文件夹中这样创建的：
`src/pages/posts/[post].astro`

动态路由必须导出一个`getStaticPaths()`，它返回一个具有 params 属性的对象数组。
`[dog].astro`在其文件名中定义一个`dog`参数，则`getStaticPaths()`返回的这些对象的`params`中必须包含`dog`。 然后页面可以使用`Astro.params`访问该参数。

```astro
//src/pages/dogs/[dog].astro
---
export function getStaticPaths() {
  return [
    { params: { dog: "clifford" }},
    { params: { dog: "rover" }},
    { params: { dog: "spot" }},
  ];
}

const { dog } = Astro.params;
---
<div>Good dog, {dog}!</div>
```

这将生成三个页面: `/dogs/clifford`、`/dogs/rover`和`/dogs/spot`，每个页面显示相应的狗名。

同时文件名还支持多参数：`src/pages/[lang]-[version]/info.astro`，这样的话需要注入`lang`和`version`参数:

```astro
---
export function getStaticPaths() {
  return [
    { params: { lang: "en", version: "v1" }},
    { params: { lang: "fr", version: "v2" }},
  ];
}

const { lang, version } = Astro.params;
---
...
```
这将生成`/en-v1/info`和`/fr-v2/info`路由。

## 分页生成动态路由
