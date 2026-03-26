---
layout: ../../layouts/MarkdownPostLayout.astro
title: Blob 与 ArrayBuffer 深度指南：二进制数据、媒体播放器与现代播放策略
pubDate: 2026-03-06T15:21:00
author: AsahinaMafuyu
description: 本文主要是探讨Blob 与 ArrayBuffer的区别，以及在企业当中如何应用，该文章主要是由ai生成，仅供个人用来参考和查漏补缺
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/blob_arraybuffer_media_playback_guide-Cover.jpg
  alt:
tags:
  - AI文章
  - 前端
  - 性能评估
---

> 面向前端/Node/Web 媒体方向的系统整理。本文重点放在 **ArrayBuffer**，并把它和 Blob、Stream、TypedArray、Range、MSE、HLS、DASH、Web Audio 以及现代播放器架构连起来理解。

---

## 1. 一句话先建立直觉

- **Blob**：更像“一个带类型标签的二进制资源包”。适合**传输、展示、下载、上传、播放**。
- **ArrayBuffer**：更像“一块原始字节内存”。适合**读取、解析、修改、重组、编解码、喂给底层 API**。

更准确地说：

- Blob 强调的是 **资源对象化**。
- ArrayBuffer 强调的是 **字节级控制**。

MDN 将 Blob 描述为“不可变的原始数据的类文件对象”；将 ArrayBuffer 描述为“原始二进制数据缓冲区，本质上是一组字节”。`Response.arrayBuffer()` 会把响应体读完并返回一个 ArrayBuffer；而 MSE 的 `SourceBuffer.appendBuffer()` 接收的正是 `ArrayBuffer`、`TypedArray` 或 `DataView`。这已经很直观地反映了两者的定位差异。  
参考：MDN Blob、MDN ArrayBuffer、MDN Response.arrayBuffer、MDN Media Source API、MDN SourceBuffer.appendBuffer。  
- https://developer.mozilla.org/en-US/docs/Web/API/Blob
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
- https://developer.mozilla.org/en-US/docs/Web/API/Response/arrayBuffer
- https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API
- https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/appendBuffer

---

## 2. Blob 到底是什么

### 2.1 Blob 的本质

Blob 可以理解成：

- 一整块二进制数据
- 带有 `size`
- 可选 `type`（MIME 类型）
- **不可变**
- 更适合被浏览器当作“资源”来处理

示例：

```js
const blob = new Blob(['hello'], { type: 'text/plain' })
console.log(blob.size) // 5
console.log(blob.type) // text/plain
```

### 2.2 Blob 为什么适合“拿来用”

Blob 很适合下面这些事：

- 下载文件
- 生成预览 URL：`URL.createObjectURL(blob)`
- 给 `<img>` / `<audio>` / `<video>` 提供资源
- 和 `File` / `FormData` 配合上传
- 把后端返回的一整段二进制当成“一个文件资源”来处理

例如：

```js
const res = await fetch('/music/part.mp3')
const blob = await res.blob()
audio.src = URL.createObjectURL(blob)
```

这里你的关注点不是“第 231 个字节是什么”，而是“给我一段能播的资源”。

### 2.3 Blob 的限制

Blob 并不是为“逐字节编辑”设计的：

- 你不能直接 `blob[0]` 取第一个字节
- 你通常不会拿 Blob 来做协议解析
- Blob 更适合整体使用，不适合频繁细粒度修改

如果你要深入到字节层面，通常会先：

```js
const buffer = await blob.arrayBuffer()
```

也就是把 Blob 转成 ArrayBuffer 后再操作。  
参考：MDN Blob、MDN Blob.arrayBuffer、MDN blob: URL。  
- https://developer.mozilla.org/en-US/docs/Web/API/Blob
- https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer
- https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob

---

## 3. ArrayBuffer 到底是什么

### 3.1 ArrayBuffer 的本质

ArrayBuffer 表示一块**原始二进制内存**。你可以把它想成“裸字节仓库”。

```js
const buffer = new ArrayBuffer(8)
console.log(buffer.byteLength) // 8
```

这里的 8 是 **8 字节**。

### 3.2 它为什么叫 Buffer

因为它就是一段缓冲区：

- 不关心这些字节代表文本、图片还是音频
- 只关心这里有多少字节
- 需要你用别的“视图”去解释这些字节

这也是它和 Blob 最根本的区别之一：

- Blob 已经更偏“资源”语义
- ArrayBuffer 还是“字节”语义

### 3.3 ArrayBuffer 本身不能直接读写

这点非常关键。

你不能直接这样做：

```js
const buffer = new ArrayBuffer(4)
// buffer[0] = 255 // 不行
```

因为 ArrayBuffer 只是**内存本体**，真正负责读写的是：

- `Uint8Array`
- `Int16Array`
- `Float32Array`
- `DataView`

例如：

```js
const buffer = new ArrayBuffer(4)
const bytes = new Uint8Array(buffer)

bytes[0] = 255
bytes[1] = 128

console.log(bytes) // Uint8Array(4) [255, 128, 0, 0]
```

也就是说，更准确的表述不是：

> ArrayBuffer 可以直接操作字节

而是：

> ArrayBuffer 提供底层内存；TypedArray / DataView 负责按某种格式解释和读写这块内存。

参考：MDN ArrayBuffer。  
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

---

## 4. TypedArray 与 DataView：真正的“字节操作层”

这一节非常重要，因为很多人以为 ArrayBuffer 一个人就能完成所有事情，实际上并不是。

### 4.1 TypedArray 是什么

TypedArray 是“类型化数组视图”。

常见的有：

- `Uint8Array`：按无符号 8 位整数看这块内存
- `Int8Array`
- `Uint16Array`
- `Int16Array`
- `Uint32Array`
- `Float32Array`
- `Float64Array`

示例：

```js
const buffer = new ArrayBuffer(8)
const u8 = new Uint8Array(buffer)
const u16 = new Uint16Array(buffer)

u8[0] = 1
u8[1] = 2

console.log(u8)  // 从字节角度看
console.log(u16) // 从 16 位整数角度看
```

注意：它们看到的是**同一块底层内存**，只是解释方式不同。

### 4.2 DataView 是什么

DataView 更灵活，适合处理：

- 文件头
- 网络协议
- 音视频容器头
- 大端序 / 小端序控制

```js
const buffer = new ArrayBuffer(8)
const view = new DataView(buffer)

view.setUint32(0, 0x89504E47, false) // 按大端写入 PNG 签名的一部分
console.log(view.getUint32(0, false).toString(16))
```

### 4.3 什么时候用 TypedArray，什么时候用 DataView

- **连续大批量数值处理**：TypedArray 更自然
- **解析结构化二进制协议 / 控制字节序**：DataView 更合适

例如：

- 处理 PCM 音频采样：常用 `Float32Array` / `Int16Array`
- 解析 MP4 box header：常用 `DataView`
- 看图片文件头：`Uint8Array` 或 `DataView` 都行

---

## 5. Blob 与 ArrayBuffer 的本质区别

### 5.1 语义层面

**Blob 更像文件 / 资源。**  
**ArrayBuffer 更像内存 / 字节仓库。**

### 5.2 是否适合精细操作

- Blob：不适合逐字节修改
- ArrayBuffer：适合，但通常要借助 TypedArray / DataView

### 5.3 是否适合交给浏览器资源系统

- Blob：很适合，比如 `createObjectURL`、上传、下载、预览
- ArrayBuffer：通常先处理，再转 Blob，或者直接喂给底层 API

### 5.4 一个直观比喻

- **Blob**：密封好的文件袋，上面写着“这是 MP3/PNG/ZIP”
- **ArrayBuffer**：裸内存箱子，里面全是字节，你得自己解释每一段是什么意思

---

## 6. 两者如何互转

### 6.1 Blob -> ArrayBuffer

```js
const buffer = await blob.arrayBuffer()
```

### 6.2 ArrayBuffer -> Blob

```js
const blob = new Blob([buffer], { type: 'audio/mpeg' })
```

### 6.3 工程上为什么经常互转

因为实际项目常常是这样的流程：

1. 先以 ArrayBuffer 形式解析或处理字节
2. 再包装成 Blob 给浏览器展示 / 播放 / 下载

或者相反：

1. 先拿到 Blob 资源
2. 再转成 ArrayBuffer 做底层处理

---

## 7. Stream、Blob、ArrayBuffer 三者关系

这个脑图非常关键。

### 7.1 Stream 是“流动中的数据”

例如 `fetch()` 的响应体本质上可以看成一个流。MDN 对 `Response.arrayBuffer()` 的描述是：它会把响应体读到完成，然后返回 ArrayBuffer。也就是说：

- **响应体原本是流**
- `arrayBuffer()` 是把流完整读完，装进一块内存
- `blob()` 是把流完整读完，装成一个 Blob 资源对象

### 7.2 关系图

```text
网络/磁盘上的字节流
        ↓
   ReadableStream / Response.body
        ↓
  读完整 -> ArrayBuffer   （偏底层）
  读完整 -> Blob          （偏资源）
```

### 7.3 为什么这点在媒体里尤其重要

因为媒体文件通常很大：

- 如果你只想“让它播”——更倾向 Blob / 原生 `<audio>` / `<video>`
- 如果你要“分片、解析、拼接、缓冲控制、码率切换”——更倾向 ArrayBuffer + MSE

参考：MDN Response、MDN Response.arrayBuffer。  
- https://developer.mozilla.org/en-US/docs/Web/API/Response
- https://developer.mozilla.org/en-US/docs/Web/API/Response/arrayBuffer

---

## 8. 为什么在媒体场景里 ArrayBuffer 更重要

这是本文的重点。

### 8.1 媒体播放不是只有“播放文件”这一件事

现代播放器通常不仅要完成：

- 播放一个 mp3 / mp4

还要完成：

- 拖动 seek
- 预加载后续片段
- 控制缓冲长度
- 实时切换清晰度 / 码率
- 处理直播
- 做广告插入
- 处理字幕和多音轨
- 做 DRM
- 低延迟播放

这些需求都在推动播放器向“**字节级处理**”演进，而不是只把资源当作一个完整文件。

### 8.2 ArrayBuffer 适合什么媒体操作

#### 读取文件头

例如识别：

- PNG 文件头
- MP3 帧头
- MP4 box / ftyp / moov / mdat
- WAV header

#### 做自定义协议解析

例如：

- WebSocket 二进制消息
- 私有媒体封装格式
- 自定义传输协议

#### 处理 PCM / 采样数据

例如：

- Web Audio 可视化
- 波形分析
- 频谱分析
- 音频特征提取

#### 喂给底层媒体 API

例如：

- `AudioContext.decodeAudioData(arrayBuffer)`
- `SourceBuffer.appendBuffer(arrayBuffer)`

### 8.3 为什么 Blob 在这些地方不够用

Blob 更偏整体资源，不适合：

- 频繁拆分
- 实时拼接
- 字节级校验
- 协议头解析
- 自定义缓冲管理

所以越接近“播放器内核”的地方，越偏向 ArrayBuffer / Uint8Array / DataView。

---

## 9. 在音频播放器中怎么选

### 9.1 场景 A：只想播放一整段音频

最简单的方式其实不是 Blob，而是直接：

```html
<audio src="/music/test.mp3" controls></audio>
```

只要后端支持：

- `Content-Type`
- `Accept-Ranges: bytes`
- `206 Partial Content`
- `Content-Range`

浏览器就能自己处理很多拖动和续播逻辑。

### 9.2 场景 B：拿到一小段音频片段，想直接播放

更适合 Blob：

```js
const res = await fetch('/audio-segment')
const blob = await res.blob()
audio.src = URL.createObjectURL(blob)
```

因为你把这一段当成“一个小文件资源”。

### 9.3 场景 C：你要自己解析、分析、编辑音频数据

更适合 ArrayBuffer：

```js
const res = await fetch('/audio-segment')
const buffer = await res.arrayBuffer()
const bytes = new Uint8Array(buffer)
```

例如你要：

- 识别格式
- 看帧头
- 解码前做预处理
- 生成波形
- 做切片

### 9.4 场景 D：Web Audio 处理

更适合 ArrayBuffer：

```js
const res = await fetch('/audio-file')
const buffer = await res.arrayBuffer()

const audioContext = new AudioContext()
const audioData = await audioContext.decodeAudioData(buffer)
```

因为 Web Audio 是更偏底层的处理路线。

---

## 10. Range 请求与媒体拖动：为什么它本质上是字节问题

### 10.1 Range 的核心

HTTP Range 请求不是按“时间”切，而是按“字节区间”切。

典型头：

```http
Range: bytes=1000-2000
```

意思是：请求第 1000 到 2000 字节。

### 10.2 用户拖到 1:00，为什么服务器还是按字节返回

因为媒体文件里“时间 -> 字节位置”之间通常需要借助：

- 容器索引
- 元数据
- 帧信息
- 播放器解析逻辑

播放器不是直接说“给我一分钟”，而是会根据媒体元数据判断大致要从哪一段字节开始拉。

### 10.3 这也是为什么现代播放器越来越偏向 ArrayBuffer 思维

因为一旦你自己管理：

- segment
- 索引
- 缓冲
- seek
- 码率切换

你管理的已经不是“文件资源”，而是“字节块和时间轴之间的映射关系”。

---

## 11. 现代媒体播放器的主流播放策略

这一节是工程重点。

### 11.1 第一层：最朴素的策略 —— 直接 `src` 播放

```html
<video src="/movie.mp4" controls></video>
```

特点：

- 浏览器内置解码与播放能力
- 简单、稳定、开发成本低
- 对普通点播非常有效
- 服务端只要正确支持 Range，就能实现拖动

适合：

- 简单音频站
- 内部系统
- 小型项目
- 不追求复杂缓冲控制的播放器

### 11.2 第二层：分段流媒体策略

当媒体变大、网络波动更复杂、需要多码率适配时，主流会转向：

- HLS
- MPEG-DASH

Apple 官方将 HLS 定义为一种基于普通 HTTP 服务器和 CDN 的自适应流媒体技术，能根据网络条件动态优化播放。MPEG 官方则把 DASH 描述为一种利用现有 HTTP 基础设施高效流化多媒体的标准。  
参考：Apple HLS、MPEG DASH。  
- https://developer.apple.com/streaming/
- https://www.mpeg.org/standards/MPEG-DASH/

#### 核心思想

1. 把媒体切成很多小片段（segments）
2. 提供一个清单文件（manifest / playlist）
3. 准备多种码率 / 清晰度版本
4. 播放器按网络情况动态选择片段
5. 边下边播，必要时切换到更高或更低码率

这就是 **ABR（Adaptive Bitrate Streaming，自适应码率流）**。

### 11.3 第三层：浏览器侧的关键技术 —— MSE

MDN 把 MSE（Media Source Extensions）定义为“允许通过 JavaScript 创建媒体流并交给 `<audio>` / `<video>` 播放”的 API。  
参考：MDN Media Source API。  
- https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API

MSE 的核心价值在于：

- 你不再只能把一个完整 URL 塞给播放器
- 你可以自己拉取分段
- 自己控制何时把哪些 segment 追加进缓冲区
- 自己管理 seek、清理、预加载、码率切换

示意代码：

```js
const mediaSource = new MediaSource()
video.src = URL.createObjectURL(mediaSource)

mediaSource.addEventListener('sourceopen', async () => {
  const sb = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001E, mp4a.40.2"')

  const res = await fetch('/segment-001.m4s')
  const buffer = await res.arrayBuffer()

  sb.appendBuffer(buffer)
})
```

这里 `appendBuffer()` 接收的就是 ArrayBuffer / TypedArray / DataView。  
参考：MDN SourceBuffer.appendBuffer。  
- https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/appendBuffer

### 11.4 为什么企业级播放器偏向 ArrayBuffer + MSE

因为企业级播放器通常要做到：

- 码率自适应
- 缓冲长度控制
- 快速 seek
- 广告拼接
- 直播与时移
- 多轨道音频与字幕
- 异常网络恢复
- 低延迟播放

这些都更适合管理“片段字节流”，而不是频繁把每个片段转成 Blob 再切 `src`。

从公开文档看：

- **hls.js** 明确说明它是一个 HLS 客户端库，依赖 HTML5 视频和 MSE 来播放。  
- **Shaka Player** 的目标是让现代浏览器中的自适应音视频流变得更容易实现。  
参考：hls.js、Shaka Player。  
- https://github.com/video-dev/hls.js/
- https://github.com/shaka-project/shaka-player

因此，今天主流 Web 视频/音频播放器的工程路线通常是：

```text
Manifest(HLS/DASH)
  -> 选择码率
  -> 拉取一个个 segment
  -> 读成 ArrayBuffer / Uint8Array
  -> 通过 MSE 追加到 SourceBuffer
  -> 浏览器解码播放
```

而不是：

```text
一个个片段 -> 各自转 Blob -> 反复改 video.src
```

后者能做 demo，但不适合复杂播放器内核。

### 11.5 Safari / iOS 的一个现实差异

在工程实践里，经常会遇到这样一种情况：

- 一些浏览器通过 **MSE + hls.js / DASH player** 实现播放
- Safari / iOS 对 HLS 有更强的原生支持，经常直接走原生 HLS 能力

这也是为什么真实项目里常常会做“浏览器能力分支”。hls.js 文档就明确说明它依赖 MSE。  
参考：hls.js。  
- https://github.com/video-dev/hls.js/

### 11.6 直播、低延迟与更复杂的策略

现代媒体平台除了点播，还要面对：

- 直播
- 低延迟直播
- 广告插入
- 时间偏移播放
- DVR 回看

Apple 的 HLS 文档强调了 HLS 对动态适应网络、普通 HTTP 服务器与 CDN 的适配；相关生态也已经发展到低延迟 HLS。DASH 生态也长期围绕直播和低延迟做互操作与标准化推进。  
参考：Apple HLS、DASH-IF、MPEG DASH。  
- https://developer.apple.com/streaming/
- https://dashif.org/
- https://www.mpeg.org/standards/MPEG-DASH/

这类场景进一步说明：

- 媒体播放的核心不只是“把文件下完再播”
- 而是围绕 **分段、缓冲、时间线、码率、自适应策略** 进行持续调度

也因此，播放器内部的数据形态更接近 **ArrayBuffer/TypedArray**，而不是 Blob。

---

## 12. 企业级项目到底如何选 Blob 与 ArrayBuffer

### 12.1 简单结论

#### 用 Blob 的典型情况

- 下载文件
- 临时预览一段资源
- 小型项目中播放一段独立音频
- 后端返回完整文件，前端只负责展示

#### 用 ArrayBuffer 的典型情况

- 解析媒体片段
- 拼接 segment
- 交给 MSE
- 交给 Web Audio
- 协议解析
- 文件头检查
- 波形与频谱分析
- 音视频底层处理

### 12.2 如果是“某一个片段的 audio”

分两种情况：

#### 片段被当作“一个独立小文件”

用 Blob 更自然。

#### 片段是整个流媒体系统中的一个 segment

用 ArrayBuffer 更符合现代播放器架构。

这是理解企业级实践的关键分水岭。

---

## 13. 为什么很多教程会让你误以为 Blob 更常用

因为从“写出一个能跑的例子”来看：

```js
const blob = await res.blob()
audio.src = URL.createObjectURL(blob)
```

非常简单，也非常直观。

但教程里的“能跑”和工业播放器的“可扩展、可控、可恢复、可适配”是两回事。

企业级播放器更关心：

- 缓冲区多长
- 哪个 segment 失败了
- 是否切码率
- 是否需要丢弃旧 buffer
- 直播延迟是否过大
- seek 到某个时间点该请求哪个分段
- 是否要插广告
- 是否有 DRM 限制

这些问题都天然更偏向 ArrayBuffer/MSE/segment 调度模型。

---

## 14. 一个完整的理解框架

### 14.1 从上到下看

#### 最上层：资源语义

- Blob
- File
- URL.createObjectURL
- `<audio src>` / `<video src>`

#### 中间层：流与响应体

- `Response.body`
- `ReadableStream`
- `response.blob()`
- `response.arrayBuffer()`

#### 底层：字节视图与缓冲

- ArrayBuffer
- Uint8Array
- DataView

#### 更底层的媒体控制

- Range
- segment
- MSE
- HLS / DASH
- Web Audio

### 14.2 一条典型企业级播放链路

```text
CDN / Origin
  -> manifest(m3u8 / mpd)
  -> 选择码率
  -> 请求 segment
  -> ArrayBuffer / Uint8Array
  -> MSE SourceBuffer.appendBuffer()
  -> 浏览器解码
  -> 播放
```

### 14.3 一条典型简单项目链路

```text
服务器文件
  -> <audio src="/music/a.mp3">
  -> 浏览器按需发 Range
  -> 浏览器解码
  -> 播放
```

### 14.4 一条典型 demo 链路

```text
fetch('/segment.mp3')
  -> blob()
  -> URL.createObjectURL(blob)
  -> audio.src = url
  -> 播放
```

---

## 15. 实战建议：你项目里该怎么选

### 15.1 如果你现在在做个人音频播放器

优先顺序建议：

#### 第一阶段：先用原生 `<audio>` + 后端 Range

这是收益最高、复杂度最低的方案。

你只要保证后端：

- 正确返回 `Content-Type`
- 支持 `Accept-Ranges: bytes`
- 正确处理 `206 Partial Content`
- 正确返回 `Content-Range`

浏览器就能完成很多本该由播放器做的工作。

#### 第二阶段：如果你需要底层处理

再引入 ArrayBuffer：

- 做波形
- 做音频分析
- 做格式检测
- 做自定义切片
- 接 Web Audio

#### 第三阶段：如果你真要做“平台级播放器”

再考虑：

- MSE
- HLS / DASH
- segment 调度
- ABR
- 更复杂的缓存与缓冲控制

### 15.2 不建议的误区

不要一上来就：

- 所有音频都手动 `fetch`
- 全都转 Blob
- 反复替换 `audio.src`

这样做虽然“看起来自己掌控了数据”，但实际上：

- 会增加复杂度
- 不利于连续播放体验
- 不适合扩展成真正播放器内核

---

## 16. 面试/工程里最值得记住的结论

### 16.1 关于 Blob

- 是“类文件对象”
- 不可变
- 适合资源层操作
- 适合预览、下载、上传、简单播放

### 16.2 关于 ArrayBuffer

- 是原始字节缓冲区
- 本身不能直接读写
- 要配合 TypedArray / DataView
- 适合协议解析、文件头识别、媒体分段处理、Web Audio、MSE

### 16.3 关于媒体播放器

- 简单点播：原生 `<audio>/<video>` + Range 已经足够强
- 分段流媒体：HLS / DASH 是主流协议路线
- 浏览器侧复杂播放内核：MSE 是关键能力
- 真正企业级播放器的数据核心更偏向 **ArrayBuffer / Uint8Array / segment 调度**

---

## 17. 最后做一个总总结

### 最短总结

- **Blob 是资源观。**
- **ArrayBuffer 是字节观。**

### 放到媒体场景里

- 你只是想“把这段东西播出来”——优先考虑 Blob 或直接 `src`
- 你想“理解、解析、拼接、控制这段数据”——优先考虑 ArrayBuffer

### 放到现代播放器里

- 简单播放器：`<audio>/<video>` + Range
- 企业级播放器：`manifest + segment + ArrayBuffer/Uint8Array + MSE + ABR`

所以从工程深度上看，**ArrayBuffer 是更靠近播放器内核的数据形态**；Blob 则更适合资源层、展示层和简单集成层。

---

## 18. 参考资料

1. MDN Blob  
   https://developer.mozilla.org/en-US/docs/Web/API/Blob
2. MDN Blob.arrayBuffer  
   https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer
3. MDN ArrayBuffer  
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
4. MDN Response  
   https://developer.mozilla.org/en-US/docs/Web/API/Response
5. MDN Response.arrayBuffer  
   https://developer.mozilla.org/en-US/docs/Web/API/Response/arrayBuffer
6. MDN Media Source API  
   https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API
7. MDN SourceBuffer.appendBuffer  
   https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/appendBuffer
8. MDN blob: URL  
   https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob
9. Apple HTTP Live Streaming  
   https://developer.apple.com/streaming/
10. MPEG DASH  
    https://www.mpeg.org/standards/MPEG-DASH/
11. DASH Industry Forum  
    https://dashif.org/
12. hls.js  
    https://github.com/video-dev/hls.js/
13. Shaka Player  
    https://github.com/shaka-project/shaka-player

