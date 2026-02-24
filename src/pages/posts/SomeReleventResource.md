---
layout: ../../layouts/MarkdownPostLayout.astro
title: 相关阅读资料(测试中)
pubDate: 2026-02-10T11:19:00
author: AsahinaMafuyu
description: 这是个人测试博客，主要是查看这些资料是否有阅读的意义
cover:
  url:
  alt:
tags: []
---
## 1) SPA 概念与“导航接管”基础  
  
- **MDN：SPA 词条（概念基座）**  
https://developer.mozilla.org/en-US/docs/Glossary/SPA  
  
- **MDN：Working with the History API（pushState/replaceState/popstate）**  
https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API  
  
- **W3C / HTML5：Session history（规范层，理解浏览器必须遵守的规则）**  
https://www.w3.org/TR/2011/WD-html5-20110113/history.html  
  
- **Chrome for Developers：Navigation API（新一代 SPA 路由 API）**  
https://developer.chrome.com/docs/web-platform/navigation-api  
  
> 建议阅读顺序：MDN History API → Navigation API → W3C 规范（需要时再深入）  
  
---  
  
## 2) DOM 更新与渲染管线（Layout / Paint / Composite）  
  
- **web.dev：Rendering on the Web（CSR/SSR/渲染路径与权衡）**  
https://web.dev/articles/rendering-on-the-web  
  
- **web.dev：Rendering performance（主线程、渲染性能与卡顿来源）**  
https://web.dev/articles/rendering-performance  
  
> 读法建议：配合 DevTools 的 Performance 面板，观察 DOM 改动如何引发 style recalculation / layout / paint。  
  
---  
  
## 3) 框架如何做 DOM Diff / 调度（以 React 为例理解“渲染分离”）  
  
- **React（legacy docs）：Reconciliation（diff 思想与原则）**  
https://legacy.reactjs.org/docs/reconciliation.html  
  
- **React Fiber Architecture（调度、可中断渲染、reconcile vs render）**  
https://github.com/acdlite/react-fiber-architecture  
  
> 重点：理解“为什么 SPA 不需要整页重绘”“为什么能优先级调度/时间切片”。  
  
---  
  
## 4) JS 执行、事件监听与“卸载/清理”（工程里最容易踩坑的部分）  
  
### 导航层（与 SPA 生命周期强相关）  
- **MDN：History API（导航事件 popstate 等）**  
https://developer.mozilla.org/en-US/docs/Web/API/History_API  
  
- **MDN：Navigation API（更贴合 SPA 的导航拦截与生命周期）**  
https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API  
  
> 提示：在 SPA 里“卸载”通常意味着：  
> - 移除事件监听（removeEventListener）  
> - 停止计时器（clearInterval/clearTimeout）  
> - 取消请求（AbortController）  
> - 释放与 DOM 关联的引用（避免内存泄漏）  
> 这些通常由框架的生命周期钩子（unmount/destroy）或自定义路由器的切换流程承接。  
  
---  
  
## 5) SPA 的 SEO 与可抓取性（为什么 History API / SSR / 预渲染重要）  
  
- **Google Search Central：JavaScript SEO basics（SPA 可抓取与注意事项）**  
https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics  
  
> 关键词：可索引性、渲染预算、路由（History API）、SSR/预渲染策略。  
  
---  
  
## 6) 非框架/原生实现路由（把“框架魔法”还原成浏览器能力）  
  
- **HTML5 Doctor：History API（经典教程，理解 popstate 行为）**  
https://html5doctor.com/history-api/  
  
- **CSS-Tricks：Using the HTML5 History API（更偏工程实践）**  
https://css-tricks.com/using-the-html5-history-api/  
  
---  
  
## 7) SPA vs MPA / PWA 视角（架构取舍）  
  
- **web.dev Learn PWA：Architecture（SPA vs MPA，架构选择）**  
https://web.dev/learn/pwa/architecture  
  
---  
  
# 推荐学习路线（可实操）  
  
1. **路由与导航：**  
MDN SPA → MDN History API →（进阶）Navigation API  
  
2. **渲染与性能：**  
web.dev Rendering on the Web → web.dev Rendering performance → DevTools Performance 实测  
  
3. **框架实现思想：**  
React Reconciliation → React Fiber Architecture（理解 diff + 调度）  
  
4. **工程落地：**  
Google JS SEO basics（抓取/索引/SSR/预渲染）  
  
  
# 附：建议你后续继续检索的关键词（自学非常好用）  

- `event delegation`, `addEventListener removeEventListener`  
- `microtask macrotask`, `requestAnimationFrame`, `requestIdleCallback`  
- `style recalculation`, `layout thrashing`, `paint`, `composite`  
- `bfcache`, `soft navigation`, `performance.navigation`, `PerformanceObserver`  
- `AbortController cleanup`, `memory leak detached DOM`  
- `History API popstate`, `Navigation API intercept`  
- 