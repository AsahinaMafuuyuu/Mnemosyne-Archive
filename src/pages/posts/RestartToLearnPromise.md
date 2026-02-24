---
layout: ../../layouts/MarkdownPostLayout.astro
title: 重新学习Promise异步编程思想
pubDate: 2026-02-24T17:00:00
author: AsahinaMafuyu
description: 以前对这一块儿的学习还是一知半解，模模糊糊的，这一次从零开始，把Promise一口气讲清楚
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/RestartToLearnPromise-Cover.jpg
  alt:
tags: []
---
## Promise对象

首先，`new Promise`不会导致异步，异步的核心是在`new Promise`的这个对象的**回调函数被放入微队列中而不影响主线程的执行**才叫做异步

> 也就是说，Promise对象本身是**同步**的，真正异步主要是**回调函数被安排在微任务队列当中**

例如：
```js
new Promise((resolve) => {  
	console.log('A'); // 立刻打印  
	resolve();  
	console.log('B'); // 立刻打印  
});  
console.log('C'); // 打印结果均为同步执行
```

Promise 的状态只在 `resolve/reject` 被调用时改变；一旦改变，就把 then/catch/finally 对应的回调排进微任务队列；微任务仍由同一个 JS 主线程在每个宏任务结束后执行。

### resolve和reject

`resolve`和`reject`都会将Promise对象的状态设置为npPending，且在resolve和reject函数中可以添加value:

```js
const a = new Promise ((resolve) => {
	resolve('111')
})
a.then((value) => {
	console.log(value) // 此处的value就是'111'
})
```

reject也是同理
