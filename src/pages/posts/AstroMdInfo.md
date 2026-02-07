---
layout: ../../layouts/MarkdownPostLayout.astro
title: Astro中关于Md工作机理
pubDate: 2026-02-01
author: AsahinaMafuyu
description: "对于astro中的md来说，可以自定义任何信息，绝对没错"
tags: ["astro", "blog", "markdown"]
---
首先我们的md可以通过frontmatter中的属性`layout`来指定该md所要渲染到哪个页面当中去，当我们在写类似的属性时，比如：
```md
---
layout: ../../layouts/MarkdownPostLayout.astro
title: ...
pubDate: ...
author: ...
description: ...
...
---
```
此时在`MarkdownPostLayout.astro`中可以通过`const { frontmatter } = Astro.props as { frontmatter: Frontmatter };`来接收，然后用`frontmatter.title`来获取到对应的信息

而且还需要注意一点（非常重要也容易忽略）: **属性的冒号后面需要加一个空格！**
正确写法`title: "啊哈哈哈哈"`， 错误写法`title:"啊哈哈哈"`

## 关于如何导入MD正文
Astro中的props会传递以下信息：
```typescript
Astro.props = {
  file: "/home/user/projects/.../file.md",
  url: "/en/guides/markdown-content/",
  frontmatter: {
    /** 从博客文章中获取的 Frontmatter */
    title: "Astro 0.18 Release",
    date: "Tuesday, July 27 2021",
    author: "Matthew Phillips",
    description: "Astro 0.18 is our biggest release since Astro launch.",
  },
  getHeadings: () => [
    {"depth": 1, "text": "Astro 0.18 Release", "slug": "astro-018-release"},
    {"depth": 2, "text": "Responsive partial hydration", "slug": "responsive-partial-hydration"}
    /* ... */
  ],
  rawContent: () => "# Astro 0.18 Release\nA little over a month ago, the first public beta [...]",
  compiledContent: () => "<h1>Astro 0.18 Release</h1>\n<p>A little over a month ago, the first public beta [...]</p>",
}
```
