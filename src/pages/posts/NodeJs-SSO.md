---
layout: ../../layouts/MarkdownPostLayout.astro
title: NodeJs单点登录SSO
pubDate: 2026-03-05T11:20:00
author: AsahinaMafuyu
description: 学习NodeJsSSO,sso 也就是single-sign-on，单点登录，允许用户使用一组凭据（如用户名和密码）登录到多个应用程序或系统，而无需为每个应用程序单独提供凭据
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/NodeJs-Cover.png
  alt: NuxtJs Cover
tags:
  - NodeJs
  - 前端
  - 学习笔记
---
## 1）“只返回 token，前端保存”当然可以——但它不是真正的 SSO 体验

如果你 `/protected` 直接 `res.json({ token })`：

- 只有**当前这个应用**拿到了 token
    
- 用户再去访问另一个应用（5174）时，另一个应用**不知道你已经登录过**  
    除非你在前端自己做一堆逻辑：拿 SSO token → 再跳另一个应用 → 再把 token 传过去/再换一次 token
    

换句话说：  
**“前端保存 token”更像普通登录**，不是“一次登录，多应用通行”的单点登录体验。

**SSO 服务器要能识别“这个浏览器已经登录过”**（靠 cookie/session 或 SSO 自己的登录态 token）。