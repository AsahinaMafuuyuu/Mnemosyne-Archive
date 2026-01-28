---
layout: ../../layouts/MarkdownPostLayout.astro
title: 关于前端字体工程的设计概念
pubDate: 2026-01-26
author: AsahinaMafuyu
description: "字体设计是一门学问（本文章由AI总结）"
tags: ["前端", "字体工程设计", "设计学", "AI文章"]
---

# Typography Design System（工程化字体系统）

> 适用于：技术博客 / UI 系统 / Astro + Tailwind v4  
> 目标：**从“写字号”升级为“设计信息层级”**

---

## 0. 设计理念（Why）

字体系统不是：
- font-family + px

而是：
- **角色（Role）**
- **尺度（Scale）**
- **语境（Context）**

核心原则：

> **组件只关心“语义角色”，不关心具体字号**

---

## 1. 字体系统总体结构（Overview）

```
Typography System
├─ Font Family（字体家族）
├─ Type Roles（语义角色）
├─ Scale System（比例级数）
├─ Weight Strategy（字重策略）
├─ Line Height（行高体系）
├─ Letter Spacing（字距）
└─ Engineering Mapping（工程映射）
```

---

## 2. Font Family（字体家族）

### 2.1 Sans Serif（UI / 正文）

```css
--font-sans: ui-sans-serif, system-ui, -apple-system,
             BlinkMacSystemFont, "Segoe UI",
             "PingFang SC", "Microsoft YaHei", sans-serif;
```

推荐原因：
- 中文友好
- 各平台一致性高
- 工程风险最低

---

### 2.2 Monospace（代码）

```css
--font-mono: ui-monospace, SFMono-Regular,
             Menlo, Consolas, monospace;
```

---

## 3. Type Roles（字体语义角色）

### 3.1 标准角色定义

| Role | 使用场景 |
|----|----|
| display | Hero / 首页大标题 |
| headline | 页面主标题 |
| title | 卡片 / 模块标题 |
| body | 正文内容 |
| meta | 时间 / 作者 / 次要信息 |
| caption | 注释 / footnote |

**注意：这里没有 px / rem**

---

## 4. Scale System（比例级数）

### 4.1 选择比例

推荐比例：

- 1.25（阅读友好）
- 1.2（偏技术 / 紧凑）

本系统使用 **1.25**

---

### 4.2 尺寸映射（Base = 16px）

| Role | rem | px |
|----|----|----|
| display | 1.95rem | 31px |
| headline | 1.56rem | 25px |
| title | 1.25rem | 20px |
| body | 1rem | 16px |
| meta | 0.875rem | 14px |
| caption | 0.75rem | 12px |

---

## 5. CSS Tokens（核心变量）

```css
:root {
  --font-size-display: 1.95rem;
  --font-size-headline: 1.56rem;
  --font-size-title: 1.25rem;
  --font-size-body: 1rem;
  --font-size-meta: 0.875rem;
  --font-size-caption: 0.75rem;
}
```

---

## 6. Weight Strategy（字重策略）

| Role | Font Weight |
|----|----|
| display / headline | 600–700 |
| title | 500–600 |
| body | 400 |
| meta / caption | 300–400 |

**注意：正文不要使用 500+**

---

## 7. Line Height System（行高体系）

| Role | Line Height |
|----|----|
| display | 1.2–1.3 |
| headline | 1.3 |
| title | 1.4 |
| body | 1.6–1.75 |
| meta | 1.4 |

推荐正文：

```css
--line-height-body: 1.65;
```

---

## 8. Letter Spacing（字距系统）

| Role | Letter Spacing |
|----|----|
| display / headline | -0.01em ~ -0.02em |
| body | 0 |
| meta / caption | +0.02em |

👉 时间信息拉开，层级立刻清晰

---

## 9. Tailwind v4 工程映射

### 9.1 Token Bridge

```css
@theme {
  --font-size-display: var(--font-size-display);
  --font-size-title: var(--font-size-title);
  --font-size-body: var(--font-size-body);
  --font-size-meta: var(--font-size-meta);

  --line-height-body: 1.65;
}
```

---

### 9.2 使用方式

```html
<h1 class="text-display font-semibold">
  文章标题
</h1>

<p class="text-body leading-body">
  正文内容……
</p>

<span class="text-meta tracking-wide text-text-muted">
  2026-01-26 · 作者
</span>
```

---

## 10. 工程自检清单（Checklist）

- [ ] 是否完全避免 px 思维？
- [ ] 是否所有文本都有 Role？
- [ ] 是否正文行高 ≥ 1.6？
- [ ] 是否 meta 与 body 有明显区分？
- [ ] 是否支持主题切换而无需改组件？

---

## 11. 工程美学判断标准

❌ 不成熟：
> “这里用 14px 好像还行”

✅ 成熟：
> “这是 meta 角色”

---

## 12. 结语

> **字体系统的价值，不在于复杂，而在于稳定**  
> **变化，只发生在 Token 层**

这套系统适合长期演进，可无痛支持：
- 多主题
- 多终端
- 多组件库

