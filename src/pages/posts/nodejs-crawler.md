---
layout: ../../layouts/MarkdownPostLayout.astro
title: NodeJs中使用爬虫
pubDate: 2026-02-27T11:19:00
author: AsahinaMafuyu
description: 对于nodejs中，若要使用爬虫的话，则需要
cover:
  url:
  alt:
tags: []
---
## 准备工作

若要使用爬虫，则有第三方依赖库`puppeteer`是非常好用的库

```bash
npm install puppeteer
```

以下是Puppeteer的一些主要特性：

1. 自动化浏览器操作：Puppeteer可以以无头模式运行Chrome或Chromium，实现对网页的自动化操作，包括加载页面、点击、表单填写、提交等。它还支持模拟用户行为，如鼠标移动、键盘输入等。
2. 截图和生成PDF：Puppeteer可以对页面进行截图，保存为图像文件，也可以生成PDF文件。这对于生成网页快照、生成报告、进行页面测试等非常有用。
3. 爬虫和数据抓取：Puppeteer可以帮助你编写网络爬虫和数据抓取脚本。你可以通过模拟用户行为来导航网页、提取内容、执行JavaScript代码，并将数据保存到本地或进行进一步的处理。
4. 网页性能分析：Puppeteer提供了一些用于分析网页性能的API，例如测量页面加载时间、网络请求和资源使用情况等。这对于性能优化和监测非常有用。
5. 无头模式与调试模式：Puppeteer可以在无头模式下运行，即在后台运行Chrome或Chromium，无需显示浏览器界面。此外，它还支持调试模式，允许你在开发过程中检查和调试页面。

*(内容来源[Nodejs 第五十六章（爬虫）](https://juejin.cn/post/7345690943075106816))*

同时我们还需要调用`python`来完成对应的操作：

pyhon相关库依赖：

```bash
pip install wordcloud #生成词云图
pip install jieba #中文分词
```

- WordCloud：  
    WordCloud是一个用于生成词云的Python库。它可以根据给定的文本数据，根据词频生成一个美观的词云图像，其中词语的大小表示其在文本中的重要程度或频率。WordCloud库提供了丰富的配置选项，可以控制词云的外观、颜色、字体等属性。你可以根据需求定制词云的样式和布局。WordCloud还提供了一些方便的方法，用于从文本中提取关键词、过滤停用词等。你可以使用pip安装WordCloud库，并参考官方文档进行使用。
- jieba：  
    jieba是一个开源的中文分词库，用于将中文文本切分成单个词语。中文分词是NLP（自然语言处理）中的一个重要任务，jieba库提供了一种有效且灵活的分词算法，可以在中文文本中准确地识别出词语边界。jieba支持三种分词模式：精确模式、全模式和搜索引擎模式。你可以根据需要选择适合的分词模式

*(内容来源[Nodejs 第五十六章（爬虫）](https://juejin.cn/post/7345690943075106816))*

## puppeteer

puppeteer会自动操作你的浏览器，并且输入参数进行各种交互操作等等

> puppeteer的每一个操作都是异步的，因此每一步操作都需要用`await`来等待返回结果

## 代码示例

```ts index.ts
import puppeteer from 'puppeteer'

// 通过命令行传入的参数来筛选关键词
const keyword = process.argv[2]

// 调用python脚本来获取数据
import { spawn } from 'child_process'

// puppeteer的每一个操作都是异步的，因此需要加await

// 1. 创建浏览器
// 默认无头模式（也就是后台运行，这样就可以看到浏览器在做什么），要关闭无头模式
// 注：发布的时候打开就行了
const browser = await puppeteer.launch({ headless: false })

// 2. 搞个页面
const page = await browser.newPage()

// 3. 跳转页面
await page.setViewport({ width: 1920, height: 1080 })
await page.goto('https://www.juejin.cn')

// 4. 为了代码健壮性 等待元素出现再操作
await page.waitForSelector('.side-navigator-wrap')

// 5. 获取元素, $是querySelector的意思，$$是querySelectorAll的意思
const elements = await page.$$('.side-navigator-wrap')

// 收集内容
const collectionFn = async () => {
    const titleList = []
    await page.waitForSelector('.entry-list') // 等待元素出现
    const elements = await page.$$('.entry-list .title-row a') // 获取元素列表
    for await (const element of elements) {
        // 获取元素的文本内容
        const prop = await element.getProperty('innerText')
        const text = await prop.jsonValue()
        titleList.push(text)
    }
    const pyProcess = spawn('python', ['index.py', titleList.join(',')]) // 调用python脚本来获取数据
    pyProcess.stdout.on('data', (data) => {
        console.log(`Python脚本输出: ${data}`)
    })
    pyProcess.stderr.on('data', (data) => {
        console.error(`Python脚本错误: ${data}`)
    })
}

for await (const element of elements) {
    // 获取元素的文本内容
    const prop = await element.getProperty('innerText')
    const text = await prop.jsonValue()

    // 读到内容后，筛选关键词(如果没有传入关键词，就默认筛选前端相关的内容)
    if (text.includes(keyword || '前端')) {
        await element.click() // 点击这个元素
        // 收集内容
        const content = await collectionFn()
        break
    }
}
```

```python index.py
# 接收命令行所传递过来的参数
import sys
import jieba # 导入jieba库来进行中文分词
from wordcloud import WordCloud # 导入WordCloud库来生成词云图
import matplotlib.pyplot as plt # 导入matplotlib库来显示词云图

text = sys.argv[1] # 获取命令行传递过来的参数
wordText = jieba.cut(text) # 对文本进行分词
text = ' '.join(wordText) # 将分词结果用空格连接成一个字符串

# 生成词云图
wordcloud = WordCloud(font_path='font.ttf', background_color='white').generate(text) # 生成词云图，指定字体和背景颜色
plt.imshow(wordcloud, interpolation='bilinear') # 显示词云图
plt.axis('off') # 关闭坐标轴
plt.show() # 显示图像
```


