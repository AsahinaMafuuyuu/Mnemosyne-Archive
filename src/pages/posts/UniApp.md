---
layout: ../../layouts/MarkdownPostLayout.astro
title: UniApp学习笔记
pubDate: 2026-02-14T12:24:00
author: AsahinaMafuyu
description: 前端开发者怎么能够少的了UniApp的学习呢？本文就是针对UniApp的学习做出一定的知识点总结，尽量做到精准而优雅
cover:
  src: 
  alt:
tags:
  - UniApp
  - LearningNote
---
# 开始UniApp

## 创建UniApp

![](/public/images/posts/Pasted%20image%2020260214122724.png)

通过HBuilderX创建以后，只需要在里面安装插件：

![](/public/images/posts/Pasted%20image%2020260214123538.png)

## 目录结构

![](/public/images/posts/Pasted%20image%2020260214141759.png)

通过pages.json来配置路由，标头，底部导航栏等等，说实话，uniapp的开发效率相当高，但几乎就是冲着业务去的，通用性极高

![](/public/images/posts/Pasted%20image%2020260214141922.png)

## 小程序语法

**在组件的属性中使用时，属性前面需增加`:`冒号前缀，属性值仍使用引号包裹，但引号里不是字符串，而是js**。

```vue
<template>
	<view>
		<button size="mini" :disabled="false" hover-start-time=20 >按钮</button>
	</view>
</template>

```

其他的就和`vue`一致了

## 小程序中的内置组件（和原生html不一样的）
##### **视图容器（View Container）：**

| 组件名                                                                                   | 说明                                                      |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [view](https://uniapp.dcloud.net.cn/component/view.html)                              | 视图容器，类似于HTML中的div                                       |
| [scroll-view](https://uniapp.dcloud.net.cn/component/scroll-view.html)                | 可滚动视图容器                                                 |
| [swiper](https://uniapp.dcloud.net.cn/component/swiper.html)                          | 滑块视图容器，比如用于轮播banner                                     |
| [match-media](https://uniapp.dcloud.net.cn/component/match-media.html)                | 屏幕动态适配组件，比如窄屏上不显示某些内容                                   |
| [movable-area](https://uniapp.dcloud.net.cn/component/movable-view.html#movable-area) | 可拖动区域                                                   |
| [movable-view](https://uniapp.dcloud.net.cn/component/movable-view.html#movable-view) | 可移动的视图容器，在页面中可以拖拽滑动或双指缩放。movable-view必须在movable-area组件中 |
| [cover-view](https://uniapp.dcloud.net.cn/component/cover-view#cover-view)            | 可覆盖在原生组件的上的文本组件                                         |
| [cover-image](https://uniapp.dcloud.net.cn/component/cover-view#cover-image)          | 可覆盖在原生组件的上的图片组件                                         |

##### 基础内容

|组件名|说明|
|---|---|
|[icon](https://uniapp.dcloud.net.cn/component/icon.html)|图标|
|[text](https://uniapp.dcloud.net.cn/component/text.html)|文字|
|[rich-text](https://uniapp.dcloud.net.cn/component/rich-text.html)|富文本显示组件|
|[progress](https://uniapp.dcloud.net.cn/component/progress.html)|进度条|

更多组件请查阅[组件使用的入门教程 | uni-app官网](https://uniapp.dcloud.net.cn/component/)

## RPX单位

最初微信小程序设计稿都是以屏幕宽度为`750rpx`为基础，因此在微信小程序中：
写`width=100rpx`意味着:

```css
width: (100rpx / 750rpx) * 100%
```

注意：**这个百分比是针对整个手机的屏幕大小而言的**。

## 小程序中组件事件

| 事件          | 作用   |
| ----------- | ---- |
| @tap        | 点击   |
| @longpress  | 长按   |
| @touchstart | 手指按下 |
| @touchmove  | 移动   |
| @touchend   | 松开   |

## 命令行创建uniapp

![](/public/images/posts/Pasted%20image%2020260214161024.png)

## VSCODE中开发

![](/public/images/posts/Pasted%20image%2020260214161804.png)