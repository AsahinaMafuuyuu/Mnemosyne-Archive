---
layout: ../../layouts/MarkdownPostLayout.astro
title: Git工程规范以及重学git的版本控制
pubDate: 2026-04-06T10:19:00
author: AsahinaMafuyu
description: 本文针对git中的一些知识进行查漏补缺，仅针对个人的不足进行相关补充，若有纰漏纯属笔者是个懒狗或者考虑不够到位
cover:
  url: 
  alt:
tags:
  - git
  - 学习笔记
---


## Git提交的批准规范

最常用的是这些：

### 1. feat

新增功能

feat: add dark mode toggle  
feat(order): support order cancellation

### 2. fix

修复 bug

fix: prevent duplicate form submission  
fix(cache): avoid null pointer when cache misses

### 3. docs

文档修改

docs: update README with setup steps  
docs(api): clarify token refresh behavior

### 4. refactor

重构，但不改变功能

refactor: split large service into smaller methods  
refactor(user): simplify profile validation logic

### 5. style

代码格式、空格、分号、lint 修正，不涉及逻辑变化

style: format code with prettier  
style(css): align button spacing rules

### 6. test

测试相关

test: add unit tests for payment service  
test(auth): cover invalid token cases

### 7. chore

杂项、工程维护、依赖更新、构建脚本等

chore: upgrade TypeScript to 5.8  
chore(ci): update GitHub Actions workflow

### 8. perf

性能优化

perf: reduce unnecessary re-renders in tree component  
perf(redis): optimize hot key lookup path

### 9. build

构建系统或依赖构建流程变更

build: update Vite config for alias resolution  
build: enable source maps in production

### 10. ci

持续集成相关

ci: add test step for pull requests  
ci: cache pnpm dependencies

### 11. revert

回滚某次提交

revert: remove experimental caching strategy
