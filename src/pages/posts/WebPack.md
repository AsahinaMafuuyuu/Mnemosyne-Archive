---
layout: ../../layouts/MarkdownPostLayout.astro
title: 学习WebPack
pubDate: 2026-04-09T15:19:00
author: AsahinaMafuyu
description: 本文针对webpack进行详细的说明，也是本人的一个学习笔记，从最基础的开始讲起，并且深入到打包器的底层思维，这样的话更容易理解现代前端的构建思想，毕竟大部分我们做的都不如现代前端的优化
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/WebPack-Cover.jpg
  alt:
tags:
  - WebPack
  - 前端
  - Bundler
  - 打包工具
---
## 安装

```bash
npm install webpack webpack-cli --save-dev
```

## 基础概念

### 入口

**入口起点(entry point)** 指示 webpack 应该使用哪个模块，来作为构建其内部 [依赖图(dependency graph)](https://www.webpackjs.com/concepts/dependency-graph/) 的开始

默认值是 `./src/index.js`，但你可以通过在 [webpack configuration](https://www.webpackjs.com/configuration) 中配置 `entry` 属性，来指定一个（或多个）不同的入口起点。例如webpack.config.ts：

```ts
export default {
    entry: './src/index.ts',
}
```

### 出口

**output** 属性告诉 webpack 在哪里输出它所创建的 _bundle_，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。

**webpack.config.ts**

```ts
import path from 'node:path'
export default {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    }
}
```


### loader

webpack和原生js一样，只能够理解 JavaScript 和 JSON 文件，而loader则能够让webpack能够去处理其他类型的文件，并将它们转换为有效 [模块](https://www.webpackjs.com/concepts/modules)，以供应用程序使用，以及被添加到依赖图中。

在更高层面，在 webpack 的配置中，**loader** 有两个属性：

1. `test` 属性，识别出哪些文件会被转换。
2. `use` 属性，定义出在进行转换时，应该使用哪个 loader。

**webpack.config.js**

```js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js',
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
};
```

> 请记住，使用正则表达式匹配文件时，你不要为它添加引号。也就是说，`/\.txt$/` 与 `'/\.txt$/'` 或 `"/\.txt$/"` 不一样。前者指示 webpack 匹配任何以 .txt 结尾的文件，后者指示 webpack 匹配具有绝对路径 '.txt' 的单个文件; 这可能不符合你的意图。

### 插件

和大多数框架一样，webpack也有对应的插件入口，直接使用plugins属性进行配置即可：

**webpack.config.js**

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```


