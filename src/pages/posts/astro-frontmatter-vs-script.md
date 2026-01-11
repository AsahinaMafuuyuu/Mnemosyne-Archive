---
layout: ../../layouts/MarkdownPostLayout.astro
title: 我的第四篇博客文章
author: Astro 学习者
description: "我遇到了一些问题，但是在社区里面提问真的很有帮助！"
tags: ["astro", "blogging", "learning in public", "爱派Dancehall"]
---

# Astro 中 `---` 与 `<script>` 的本质区别（核心知识点）

## 1. 执行时机与执行环境（最核心）

| 位置 | 执行时机 | 执行环境 |
|---|---|---|
| `---`（Component Script） | 构建期 / 服务端渲染期 | Node.js |
| `<script>`（HTML Script） | 页面加载后 | 浏览器 |

> **关键结论：`---` 中的代码永远不会进入浏览器，`<script>` 中的代码一定会进入浏览器**

---

## 2. 是否会被发送到浏览器

| 位置 | 是否随 HTML 输出 |
|---|---|
| `---` | ❌ 不会 |
| `<script>` | ✅ 会 |

---

## 3. 能力边界（能做 / 不能做什么）

### `---`（构建期 / 服务端 JS）

✅ 可以：
- `import` TS / JS / JSON
- 数据准备、计算
- 生成 HTML 结构
- 使用 Node API（如 `fs`）

❌ 不能：
- 访问 `window` / `document`
- 操作 DOM
- 添加事件监听

---

### `<script>`（客户端 JS）

✅ 可以：
- DOM 操作
- 事件监听
- 状态切换（如 `aria-expanded`）
- 使用浏览器 API

❌ 不适合：
- 页面结构生成
- 构建期数据处理
- 重计算逻辑

---

## 4. 信息流方向（非常重要）

- `---`：  
  **JS → HTML**（先计算，再输出结构）

- `<script>`：  
  **HTML → JS**（先有 DOM，再附加行为）

---

## 5. 编译层面的本质差异

### `---`（会被 Astro 编译并执行）

```astro
---
const title = "Hello";
---
<h1>{title}</h1>
```

等价于（概念模型）：

```js
// Node.js
return `<h1>Hello</h1>`;
```

---

### `<script>`（原样交给浏览器）

```astro
<script>
  console.log("Hello");
</script>
```

等价于：

```html
<script>
  console.log("Hello");
</script>
```

---

## 6. 使用决策口诀（实战）

- **能在页面加载前确定的内容 → 放 `---`**
- **依赖用户交互 / DOM 的逻辑 → 放 `<script>`**

---

## 7. Astro 的核心设计思想

> **最大化在构建期完成逻辑  
> 最小化发送到浏览器的 JavaScript**
