---
layout: ../../layouts/MarkdownPostLayout.astro
title: 自定义你的ScrollBar
pubDate: 2026-01-27
author: AsahinaMafuyu
description: "当你想做炫酷的主题的时候但苦恼于滚动条丑陋，可以看看这篇文章"
tags: ["前端", "html", "scrollbar"]
---
这篇文章很短，简而言之吧，介绍一下滚动条的相关属性：
> ::-webkit-scrollbar    //滚动条整体部分
::-webkit-scrollbar-button   //滚动条两端的按钮
::-webkit-scrollbar-track   // 外层轨道
::-webkit-scrollbar-track-piece    //内层轨道，滚动条中间部分（除去）
::-webkit-scrollbar-thumb //滚动条里面可以拖动的那个
::-webkit-scrollbar-corner   //边角
::-webkit-resizer   ///定义右下角拖动块的样式

其次呢，这些通常可以当作浏览器的私生伪元素看，因此也可以用嵌套css：

更多可参考这篇文章[css scrollbar样式设置](https://zhuanlan.zhihu.com/p/139664176)
