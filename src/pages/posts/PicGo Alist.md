---
layout: ../../layouts/MarkdownPostLayout.astro
title: 使用PicGo或者AList上传图片
pubDate: 2026-02-16T17:20:00
author: AsahinaMafuyu
description: 这篇博客主要用来介绍PicGo和AList的用处，笔者曾经很容易弄混淆这两种不同的东西
cover:
  url:
  alt:
tags: []
---
对于这两个软件的定位，首先Alist看起来更像服务器，用来管理CF等等对象存储的可视化等管理，方便统一管理，对于图床而言，**AList更是核心**，而PicGo更像是上传工具，它用来自动化将图片上传到图床服务器，而管理的话用AList管理，**PicGo主要是用于.md或者其他的应用**，通过上传本地图片，然后将图片的公网URL得到以后交给用户，再写入到.md当中去

|工具|角色|
|---|---|
|PicGo|上传入口|
|AList|浏览/管理界面|
