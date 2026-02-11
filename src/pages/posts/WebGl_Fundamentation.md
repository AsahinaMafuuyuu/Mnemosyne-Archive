---
layout: ../../layouts/MarkdownPostLayout.astro
title: WebGl的相关基础知识
pubDate: 2026-02-10T11:56:00
author: AsahinaMafuyu
description: WebGl也是前端不得不品的一个环节，所以也算开一个坑，来研究WebGl的一些基础的内容和知识点
cover:
  src: /images/posts/WebGl_cover 20260210131309.png
  alt: WebGl封面
tags:
  - 前端
  - WebGl
  - Learning
---
# WebGl的基础知识
## canvas
通过canvas，我们可以得到一块画布：
canvas.getContext() (参数为2d或者webgl)
## 数据类型
canvas具有这些类型化数组：
![[Array_category 20260210131104.png]]
为什么要用这些数据类型呢?因为画图是用坐标来画的：
![[vertical image 20260210132253.png]]
这些坐标用来绘图
## GLSL 
glsl也就是OpenGl Shading Language,也就是着色器编程语言，一个图形具有无数个点，**而每一个点都具有其单独的颜色**。
着色器包含：
![[GLSL TYPE 20260210132758.png]]
## 着色器语法
![[GLSL Grammer 20260210133021.png]]