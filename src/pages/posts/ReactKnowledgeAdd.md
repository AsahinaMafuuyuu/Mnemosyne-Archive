---
layout: ../../layouts/MarkdownPostLayout.astro
title: 相关React知识点补充
pubDate: 2026-04-05T10:19:00
author: AsahinaMafuyu
description: 针对之前学习到的react知识点，这里补充一些可能用得上的额外的知识点进行深度补充，这些知识点比较零碎，但是能够对前端工程的项目有一个更加充分的认知。
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/ReatKnowledge-Cover.jpg
  alt:
tags:
  - React
  - 前端工程
---
## SWC

### 编译器

首先需要明确一点：SWC属于编译器的范畴，也就是说他把 TS / JSX / 新语法 转成浏览器能跑的 JS，主要有以下作用：

#### （1）把 TypeScript 变成 JavaScript

例如：

```ts
const add = (a: number, b: number): number => a + b;
```


浏览器不认识 `: number` 这种类型标注，所以编译器会把它去掉：

const add = (a, b) => a + b;


#### （2）把 JSX / TSX 变成 JS

例如：

```jsx
<App title="hello" />
```

#### （3）把新语法降级

例如箭头函数、可选链、空值合并等，有些旧浏览器不支持：

```js
const name = user?.profile?.name ?? "default";
```

编译器可以把它转成兼容旧环境的写法。

#### （4）做语法级别的优化

比如：

- 删除类型信息
- 常量折叠
- 一些简单的 dead code 处理
- JSX 自动引入运行时

> vue的SFC也需要通过编译器进行转换（.vue），同理，astro扩展的文件名也需要用编译器进行转换

常见的编译器有：

- **Babel**
- **SWC**
- **TypeScript 编译器（tsc）**
- **esbuild** 的 transform 能力

### 打包器Bundler

bundler 的核心任务是：

> **把分散的模块和资源，整理成浏览器可以高效加载和运行的产物**

#### 为什么需要打包

当我们在写项目的时候，不可避免的就会使用到：

```js
import React from "react";
import App from "./App";
import "./styles.css";
import logo from "./logo.png";
```

这样的导入语法，这只是开发时的模块化表达。
但浏览器上线运行时，会涉及很多问题：

- 模块之间依赖关系怎么处理
- 多个文件如何组织
- CSS、图片、字体怎么纳入
- 第三方库怎么合并
- 怎么减少请求数量
- 怎么做代码分割
- 怎么给文件加 hash 防缓存

这些都属于 bundler 的工作范畴。

> **包管理工具解决“包从哪里来、怎么装、装哪个版本”**  
**bundler 解决“这些包和你的源码装好以后，运行时怎么组织起来”**

通俗易懂一点就是：
npm等包管理工具来解决各个module之间的版本和依赖冲突等关系，如果满足的话，他就会将这些包安装到node_modules当中去，而我们的bundle就会解析我们在js文件中写的各种import等导入，

关系图如下：

```
package.json 声明依赖
   ↓
npm / pnpm / yarn 安装依赖
   ↓
依赖进入 node_modules / 虚拟依赖系统
   ↓
bundler 读取你的源码 import
   ↓
bundler 去依赖系统里找到对应包
   ↓
bundler 构建模块图并输出产物
```

包管理工具更多的是在关心：

- 模块依赖图
- 构建入口
- 输出策略
- 分包策略
- tree-shaking
- HMR 所需的模块关系

#### bundler的工作机理

例如导入图片：

```ts
import logo from '@/assets/logo.png'
```

首先浏览器根本不认识@，因此构建器会将@转换成项目级别的URL：

```ts
import logo from "/src/assets/logo.png";
```

其次js文件中导入照片是使用地址URL：

```html
<img src="/src/assets/logo.png">
```

或者使用命令式编程：

```ts
const image = document.createElement('img');
image.src = "/src/assets/logo.png"
```

通常我们就写成：

```ts
image.src = logo
```

此时的logo就相当于这个URL，因此import语句在经过bundler之后就会从：

```ts
import logo from '@/assets/logo.png'
```

变成：

```ts
const logo = "/src/assets/logo.png"
```

同理，css，各种js，ts甚至第三方框架的模块导入都需要用bundler来进行解决

#### 开发环境

开发环境同样要做这些事：

- 解析 `import`
- 解析路径别名
- 转换 TS / JSX / Vue SFC
- 处理 CSS
- 处理图片、字体等静态资源
- 维护模块依赖图
- 支持 HMR

只是它的方式通常是：

**按需处理、边访问边转换、不一次性打成最终包**

#### 开发环境和打包区别

可以这样记：

 `dev`

目标是：**让你尽快开发起来**

特点是：

- 不追求最终产物最优
- 不一定把所有文件一次性都处理完
- 往往是浏览器请求哪个模块，就即时转换哪个模块
- 更强调启动快、更新快、HMR 快

 `build`

目标是：**生成可以上线的最终产物**

特点是：

- 要把整个项目完整分析一遍
- 做代码分割
- 做压缩混淆
- 提取 CSS
- 处理资源指纹
- 消除无用代码
- 输出最终部署文件

### 构建工具

构建工具的职责更“上层”一些。

它不只是管编译或打包，而是：

> **把开发、调试、打包、预览、插件、环境配置等整套工程流程组织起来**

主要做的事有

（1）启动开发服务器

例如：

- 本地开一个端口
- 提供页面访问
- 监听文件变化
- 自动刷新浏览器

（2）提供 HMR

你改了一个组件，只更新那个模块，不整页刷新。

 （3）协调底层工具

比如：

- 用 SWC/esbuild/Babel 做编译
- 用 Rollup/Webpack 做生产构建
- 用 PostCSS 处理 CSS
- 用插件处理图片、环境变量、别名等

（4）区分开发和生产环境

开发时关注：

- 启动快
- 调试方便
- 热更新快

生产时关注：

- 包体积小
- 加载性能好
- 缓存友好
- 代码压缩

构建工具会把这两套流程统一管理。

（5）提供统一配置入口

例如：

- 路径别名
- 环境变量
- 插件系统
- 代理配置
- 构建输出目录
- 资源处理规则

## 加载动画

### 路由级别切换

使用路由层的loading，通常做法是使用全局守卫加全局进度条来进行，更多可以查看[小满Router（第八章-导航守卫）-CSDN博客](https://xiaoman.blog.csdn.net/article/details/123699583)

> 路由级别的切换需要用到`useNavigation`，`const navigation = useNavigation();`然后用`navigation.state`来判断路由是否切换成功，一般有以下的状态：
> - `idle` 空闲状态
> - `submitting` 提交状态
> - `loading` 加载状态

案例：实现一个路由切换级别的加载动画，加载条也行，过场图也行：

## useSyncExternalStore补充

用法再回忆一下：`const res = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`

> 首先，res也就是`getSnapshot`快照中的返回值，而subscribe就类似于一个订阅中心，可以用来订阅相关事件：
> `const subscribe = (callback: () => void) => { // 订阅 callback() return () => { // 取消订阅 } }`，其中这个`callback`就是用来通知`getSnapshot`
> 外部 store 的值就算真的变了，只要 React 没有被“通知到”，组件通常就不会自动重新渲染。
> 也就是说如果当不触发callback函数的话，那么res的值不会发生改变，且视图也不会进行渲染

思路也就非常清晰了：

```
subscribe: 订阅事件，在事件触发的时候处理逻辑，并且执行callback()

 |
 v
 
getSnapshot: 返回值为res的接收值
```

本质上就是一个发布订阅模式，因此的话非常适合用于做外部事件触发，然后重新渲染本组件

> 这里还需要注意一点：getSnapshot不是每一次都返回一个新的对象，不然的话就会不停的更新视图，应当是需要更改数据的时候返回新对象，而数据不变的时候返回原来值即可，因此需要进行数据对比：如果和之前的快照数据一样，就返回源对象，如果不一样，就新建一个对象，此时的话，就需要保存两个：`let lastUrl = window.location.href`
> `let lastSnapshot = { url: lastUrl }`
> 然后在getSnapshot当中进行判断：
> const getSnapshot = () => {  
> 	const currentUrl = window.location.href  
> 	if (currentUrl !== lastUrl) {  
> 		lastUrl = currentUrl  
> 		lastSnapshot = { url: currentUrl }  
> 	}  
> 	return lastSnapshot  
> }
> 这样的话就可以做到数据不变就不用进行更新

## useEffect和useLayoutEffect

useEffect和useLayoutEffect用法几乎一样，但是他们两个的作用不一样：

|区别|useLayoutEffect|useEffect|
|---|---|---|
|执行时机|浏览器完成布局和绘制`之前`执行副作用|浏览器完成布局和绘制`之后`执行副作用|
|执行方式|同步执行|异步执行|
|DOM渲染|阻塞DOM渲染|不阻塞DOM渲染|

因此在开发的时候，`useLayoutEffect`可以立刻调整css样式，例如如果将一个组件的opacity从0设置成1，如果用useEffect修改的话，由于是异步，并且在浏览器绘制结束以后才会执行，因此会有一个闪屏，如果设置transition的话就会有过渡，而如果是用`useLayoutEffect`的话，他会在浏览器绘制之前就修改成opacity1，并且设置`transition`也没有任何作用

