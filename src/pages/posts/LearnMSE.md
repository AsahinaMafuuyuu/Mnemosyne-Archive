---
layout: ../../layouts/MarkdownPostLayout.astro
title: MSE技术
pubDate: 2026-02-10T11:19:00
author: AsahinaMafuyu
description: 媒体源扩展 API（MSE）提供了实现无插件且基于 Web 的流媒体的功能。使用 MSE，媒体串流能够通过 JavaScript 创建，并且能通过使用 <audio> 和 <video> 元素进行播放。
cover:
  url:
  alt:
tags:
  - 前端
  - 学习笔记
  - 音频开发
---
## 前言

MSE 使我们可以把通常的单个媒体文件的 `src` 值替换成引用 `MediaSource` 对象（一个包含即将播放的媒体文件的准备状态等信息的容器），以及引用多个 `SourceBuffer` 对象（代表多个组成整个串流的不同媒体块）的元素。MSE 让我们能够根据内容获取的大小和频率，或是内存占用详情（例如什么时候缓存被回收），进行更加精准地控制。它是基于它可扩展的 API 建立自适应比特率流客户端（例如 DASH 或 HLS 的客户端）的基础。

