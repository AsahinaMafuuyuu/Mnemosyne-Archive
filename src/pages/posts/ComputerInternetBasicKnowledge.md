---
layout: ../../layouts/MarkdownPostLayout.astro
title: 计算机网络基础知识补全（摘自小满ZS）
pubDate: 2026-02-11T12:04:00
author: AsahinaMafuyu
description: 补全了前端知识，因此还需要对网络知识进行额外的补充，用来更加深刻的了解网络协议，以及端口通信等等
cover:
  src:
  alt:
tags: []
---
# 1. 基础介绍
## 1.1 七层模型
![](/images/posts/OSI%20seven%20layers%20model%2020260211120714.png)

### 物理层

主要用来传输010101这样的比特流，

### 数据链路层

这一层的话主要是将比特流来拼接起来，其中MAC地址在硬件层是唯一的

![](/images/posts/20260211121425.png)

### 网络层

网络层是最复杂的一层，在这一层就定义了我们的IP，220.xxx.xxx.xxx。

**该层控制数据链路层与传输层之间的信息转发，建立、维持和终止网络的连接**。具体地说，数据链路层的数据在这一层被转换为数据包，然后通过路径选择、分段组合、顺序、进/出路由等控制，将信息从一个网络设备传送到另一个网络设备

1.寻址：对网络层而言使用IP地址来唯一标识互联网上的设备，**网络层依靠IP地址进行相互通信（类似于数据链路层的MAC地址）**

2.路由：在同一个网络中的内部通信并不需要网络层设备，仅仅靠数据链路层就可以完成相互通信，对于不同的网络之间相互通信则必须借助路由器等三层设备。

有了网络层以后，计算机就有了两种地址：MAC和IP地址。**两种地址之间没有任何联系**，**MAC**地址是**绑定在网卡上**的，**网络地址**则是**管理员分配**的，它们只是随机组合在一起。

> **网络地址帮助我们确定计算机所在的子网络，MAC地址则将数据包送到该子网络中的目标网卡**。因此，从逻辑上可以推断，必定是先处理网络地址，然后再处理MAC地址。

### 传输层

传输层主要是定义我们的端口号，一台计算机都有很多端口，并且拥有两个熟知的协议**TCP和UDP**
~~(这一块先跳过，不代表不重要，相反非常重要)~~

### 会话层

会话层，是在发送方和接收方之间进行通信时创建、维持、之后终止或断开连接的地方，与电话通话有点相似。

会话层定义了一种机制，允许发送方和接收方启动或停止请求会话，以及当双方发生拥塞时仍然能保持对话。

会话层包含了一种称为**检查点（Checkpoint）** 的机制来维持可靠会话。检查点定义了一个最接近成功通信的点，并且定义了当发生内容丢失或损坏时需要回滚以便恢复丢失或损坏数据的点，即**断点下载**的原理

这一层就开始叫做报文了

### 表示层

表示层主要做了几件重要的事情 安全，压缩，也是程序在网络中的一个翻译官。

1. 安全 在你的数据发送之前进行加密，在接受者的表示层进行解密。

2. 表示层还会对图片文件等格式进行解码和编码 例如 JPEG、ASCll 图片是人类能读懂的计算机需要转换成计算机能读懂的编码。

> 说白了，这一层的作用就是保护数据的安全以及对数据进行加密解密和编码解码等过程。
### 应用层

应用层就是我们使用最多的一层，例如ajax调用接口发送http请求，再比如域名系统DNS，邮件协议SMTP，webSocket长连接，SSH协议

![](/images/posts/20260211123125.png)

# TCP UDP协议详解
##  TCP三次握手

TCP是面向`连接`的 什么是面向连接，**面向连接就是数据通讯的时候需要进行`三次握手`，断开通信的时候进行`四次挥手`**


![](/images/posts/TCP%2020260211133203.png)

上面这张图就是三次握手的协议

**名词描述**

- seq（sequence number），序列号随机生成的
- ack（acknowledgement number）确认号 ack = seq + 1
- ACK （acknowledgement）确定序列号有效
- SYN（synchronous）发起新连接
- FIN （FINISH）完成

## 四次挥手

1.断开连接服务端和客户端都可以主动发起我们拿客户端举例，客户端进行断开操作先发送`FIN`包生成客户端的`seq`序列号随后进入`wait1状态` ,这是第一次挥手。

2.服务端收到FIN包表示自己进入了关闭等待状态，然后向客户端使用ack验证，验证成功打上ACK标记，随后生成服务端的`seq值`发送给客户端，这是第二次挥手，服务端此时还可以发送未完成的数据。

3.等待服务端所有任务操作完成之后服务端开始进入最后确认状态，向客户端发送`FIN包`,并且验证ack，使用客户端第一次的`seq + 1`去验证，验证成功打上ACK标记，并且生成一个新的序列号seq发送给客户端，这是第三次挥手。

4.客户端收到之后进入超时等待状态`2MSL（1-4分钟）`，经过等到后客户端关闭连接，而服务端收到信息验证完成ack成功之后打上`ACk`标记随后将关闭连接。

为什么需要超时等待时间?

`这是为了保证服务端收到ACK包，假设如果没有2MSL的等待时间，ACK包丢失了，那服务端将永远不会断开连接，有了2MSL，如果一旦发生丢包将会进行超时重传，实现可靠连接。`

![](/images/posts/20260211135612.png)

第三次挥手才是真正要结束的状态

# URL

通常url由三部分组成：
1. 访问协议：例如http,https
2. 域名Domain：例如www.baidu.com,www.xiaoxie.com等等
3. 请求文件的资源路径名：/dist/index.html(后面同样的可以跟上参数等等)

![alt text](/images/posts/URL%2020260211154424.png)

DNS查询的话，也有四种：

![DNS查询顺序](/images/posts/DNS%20Search%2020260211154617.png)

DNS查找规则就是：
- 根域名：告诉你去找哪个顶级域
- 顶级域名：告诉你去找哪个权威服务器
- 权威域名：真正告诉你IP地址

# 缓存

缓存通常分为**强缓存和协商缓存**
##### 强缓存

![Strong Cache](/images/posts/Strong%20cache%2020260211160059.png)

其实判别强缓存特别简单，直接看是否有（from disk cache）或者（from memory cache）这两个即可

##### 协商缓存

![contact cache](/images/posts/contact%20cache%2020260211160924.png)

HTML解析

当客户端通过网络7层模型得到资源以后，浏览器就开始解析HTML

![HTML Parsing](/images/posts/HTML%20Parsing%2020260211161325.png)

下一步就是css的解析（首要的就是对于css语法进行转换，尤其是tailwind之类的）

![Css parsing](/images/posts/CSS%20Parsing%2020260211161500.png)

浏览器绘制的时候，还会碰到**回流**和**重绘**

![Reflow and Repaint](/images/posts/Reflow%20and%20Repaint%2020260211161719.png)

经过这些变化后，就要经过Javascript
![](/images/posts/V8%20JS%2020260211162042.png)

# CDN（内容分发网络）

之前了解到DNS解析的时候，就有权威域名解析（也就是通过权威域名来得到真正的IP），如果配置了CDN的话，那么DNS的最终域名解析权都交给CNAME了

![](/images/posts/CDN%2020260211162631.png)

# 跨域详解

1. jsonp解决跨域：jsonp的核心原理在于script中的资源请求不会受到CORS的限制问题，但是缺点在于script的src只能使用get请求，而无法使用post请求等等，更详细一点：
>	
	**同源策略限制的是 XHR/fetch 读取跨域响应**，而 **`<script src>` 属于“资源引入并执行”**，浏览器允许跨域加载并执行脚本，所以绕过去了.
	相关代码如下：

```html
	<body>

    <script>

  

        const jsonp = (name) => {

            let script = document.createElement('script')

            script.src = 'http://localhost:3000/api/jsonp?callback=' + name

            document.body.appendChild(script)

            return new Promise ((resolve) => {

                window[name] = (data)=> {

                    resolve(data)

                }

            })

        }

  

        jsonp(`callback${new Date().getTime()}`).then(res => {

            console.log(res)

        })

    </script>

</body>
```

2. 纯前端解决跨域问题（使用vite）:
直接在`vite.config.ts`中配置即可：

```typescript
import { defineConfig } from 'vite'

export default defineConfig({

    server: {

        port: 5173,

        proxy: {

            '/api': {

                target: 'http://localhost:3000', // 代理到后端服务

            }

        }

    }

})
```

然后就能解决跨域了：

![](/images/posts/Resolve%20CORS%2020260211170621.png)

3. 纯后端解决跨域：非常非常非常简单，直接在`res.setHead('Access-Control-Allow-Origin', '\*')`即可
4. nginx解决：nginx的话就用proxy_pass 来进行反向代理即可

# AJAX

## 概念

Ajax（Asynchronous JavaScript And XML）即异步 JavaScript 和 XML，是一组用于在网页上进行异步数据交换的Web开发技术，可以在不刷新整个页面的情况下向服务器发起请求并获取数据，然后将数据插入到网页中的某个位置。这种技术能够实现增量式更新页面，提高用户交互体验，减少响应时间和带宽的消耗。

## 核心API

1.需要创建xhr实例 通过 `XMLHttpRequest` 使用 `XMLHttpRequest` 可以通过 JavaScript 发起HTTP请求，接收来自服务器的响应，并动态地更新网页中的内容。这种异步通信方式不会阻塞用户界面，有利于增强用户体验。

2.我们需要使用 open() 方法打开一个请求，该方法会初始化一个请求，但并不会发送请求。它有三个必填参数以及一个可选参数

- method：请求的 HTTP 方法，例如 GET、POST 等。
- url：请求的 URL 地址。
- async：是否异步处理请求，默认为 true，即异步请求。

3.onreadystatechange 一个回调函数，在每次状态发生变化时被调用。

- readyState 0：未初始化，XMLHttpRequest 对象已经创建，但未调用 open 方法。
- readyState 1：已打开，open 方法已经被调用，但 send 方法未被调用。
- readyState 2：已发送，send 方法已经被调用，请求已经被服务器接收。
- readyState 3：正在接收，服务器正在处理请求并返回数据。
- readyState 4：完成，服务器已经完成了数据传输。

4.send 向后端传递参数 例如 xhe.send(params)

5.通过xhr实例对象可以监听progress事件来监听进度

示例代码如下：
```html
<body>

    <button id="btn">点击发送请求</button>

    <button id="stopbtn">中断请求</button>

    <div>进度条 <span id="progress"></span></div>

    <script>

  

        const btn = document.getElementById('btn')
        const progressBar = document.getElementById('progress')
        const stopBtn = document.getElementById('stopbtn')
        
        // send ajax的方法就是这样的
        btn.addEventListener('click', () => {sendAjax()})

  

        const sendAjax = () => {
            const xhr = new XMLHttpRequest()  // 返回xhr对象

            xhr.addEventListener('progress', (event) => {
                console.log(event.loaded, event.total)
                progressBar.innerText = `${(event.loaded / event.total * 100).toFixed(2)}%`
            })

            xhr.timeout = 3000
            
            xhr.addEventListener('timeout', () => {
                console.log('请求超时')
            })

            // open三个参数(请求方式，请求地址，是否异步(默认为true，同步的话会阻塞我们的代码))
            // xhr.open('get', 'http://localhost:3000/api/txt', true)
            xhr.open('post', 'http://localhost:3000/api/postData')

            // post传递json的话还要设置请求头,注意，一定要放在open的下面
            xhr.setRequestHeader('Content-Type', 'application/json')

            // 此时可以启用
            EnabledStopBtn()

            // 通过onreadystatechange来监听
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText)
                }
            }

            // 只有点击按钮以后才能够中断请求
            stopBtn.addEventListener('click', () => {
                xhr.abort()
                // 中断请求以后必须禁用
                DisabledStopBtn()
            })
            
            // send方法
            // post的参数就是在send方法中传递的
            xhr.send(JSON.stringify({name: "小满"}))
            // xhr.send(null)
        }

        function DisabledStopBtn () {
            stopBtn.style.cursor = 'not-allowed'
            stopBtn.style.pointerEvents = 'none'
        }
        
        function EnabledStopBtn () {
            stopBtn.style.cursor = 'pointer'
            stopBtn.style.pointerEvents = 'auto'
        }
    </script>
</body>
```

# Fetch

`fetch`相对于`XMLHttpRequest(XHR)`而言，更加的直观且更加的简单
`fetch`相比于`XHR`而言的话，没有超时时间，需要自己手动实现
`fetch`只支持`get`和`post`请求，其他的一概不支持，而`XHR`支持所有标准`HTTP`请求方法

##### fetch 返回格式

1. `text()`: 将响应体解析为纯文本字符串并返回。
2. `json()`: 将响应体解析为`JSON`格式并返回一个`JavaScript`对象。
3. `blob()`: 将响应体解析为二进制数据并返回一个Blob对象。
4. `arrayBuffer()`: 将响应体解析为二进制数据并返回一个`ArrayBuffer`对象。
5. `formData()`: 将响应体解析为`FormData`对象。

相关示例代码如下：
```typescript
// fetch 实现这些接口

        const sendFetch = ()=> {

            // 第一个参数：URL 默认请求方式get, 返回Promise

            fetch('http://localhost:3000/api/txt').then((res) => {

                console.log(res)

  

                // 指定返回的方式

                // 注意:res.text() 、 res.json()等等返回的是一个新的Promise

                // 因为需要浏览器去解析响应体

                return res.text()

            }).then((res) => {

                console.log(res)

            })

        }

  

        btn.addEventListener('click', sendFetch)
```

同样的，可以直接在第二个参数中指定请求方式和请求头：

```ts
fetch('http://localhost:3000/api/post',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({
        name:'zhangsan',
        age:18
    })
}).then(res => {
    console.log(res);
    return res.json()
}).then(res => {
    console.log(res);
})

```

对于进度条，这里有一个隐患：
```ts
 fetch('http://localhost:3000/api/txt').then((res) => {
                const reader = res.body.getReader() // 返回一个流
                const totalLength = res.headers.get('Content-Length')
                let loaded = 0
                IntervalA = setInterval(async()=> {
                    // done 如果结束，说明为true,如果为false，说明还有数据
                    // value返回的是一个unit8Array
                   const { done, value } = await reader.read()
                    if(done) {
                        loaded = totalLength
                        progressBar.innerText = '100.00%'
                        
                        // 结束掉这个Interval
                        clearInterval(IntervalA)
                    }
                    loaded += value.length // 当前的进度
                    progressBar.innerText = `${(loaded / totalLength * 100).toFixed(2)}%`
                }, 100)
                return res.text()
            }).then((res) => {
                console.log(res)
            })
```

![](/images/posts/Read%20stream%2020260212113821.png)

也就是说需要clone一个新的流，让`res.text()`来读取新的流就可以了：

```ts
const response = res.clone()
... // 其他的关于进度条的代码正常使用res的数据流就行了
return response.text()
```

上述代码有一点非常容易错的就是：**如果设置定时器每次读取的话，它只会固定读取一块`chunk`**，因此的话设置快慢通常都会影响读取速率，因此还是用`while`循环吧

```ts
const response = res.clone()
                const reader = res.body.getReader() // 返回一个流
                const totalLength = res.headers.get('Content-Length')
                let loaded = 0
                while (true) {
                    // done 如果结束，说明为true,如果为false，说明还有数据
                    // value返回的是一个unit8Array
                    const { done, value } = await reader.read()
                    if (done) {
                        loaded = totalLength
                        progressBar.innerText = '100.00%'
                        break
                    }
                    loaded += value.length // 当前的进度
                    progressBar.innerText = `${(loaded / totalLength * 100).toFixed(2)}%`
                }
                return response.text()
```

##### 中断请求

使用 `AbortController` 的 `abort`方法中断：

```ts
const abort = new AbortController()
fetch('http://localhost:3000/api/post',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    signal:abort.signal,
    body:JSON.stringify({
        name:'zhangsan',
        age:18
    })
}).then(res => {
    console.log(res);
    return res.json()
}).then(res => {
    console.log(res);
})

document.querySelector('#stop').addEventListener('click', () => {
        console.log('stop');
        abort.abort()
})
```

中断掉后会走reject


##### 超时处理

超时的话直接使用`setTimeout`配合，在`setTimeout`中将`abort.abort`调用即可

# SSE

## 概述

> SSE（Server-Sent Events）是一种用于实现服务器主动向客户端推送数据的技术，也被称为“事件流”（Event Stream）。它基于 HTTP 协议，利用了其长连接特性，在客户端与服务器之间建立一条持久化连接，并通过这条连接实现服务器向客户端的实时数据推送。

## SSE 和 Socket 区别

SSE（Server-Sent Events）和 WebSocket 都是实现服务器向客户端实时推送数据的技术，但它们在某些方面还是有一定的区别。

1. 技术实现
SSE 基于 HTTP 协议，利用了其长连接特性，通过浏览器向服务器发送一个 HTTP 请求，建立一条持久化的连接。而 WebSocket 则是通过特殊的升级协议（HTTP/1.1 Upgrade 或者 HTTP/2）建立新的 TCP 连接，与传统 HTTP 连接不同。

2. 数据格式
SSE 可以传输文本和二进制格式的数据，但**只支持单向数据流**，即只能由服务器向客户端推送数据。**WebSocket 支持双向数据流**，客户端和服务器可以互相发送消息，并且没有消息大小限制。

3. 连接状态
SSE 的连接状态仅有三种：已连接、连接中、已断开。连接状态是由浏览器自动维护的，客户端无法手动关闭或重新打开连接。而 WebSocket 连接的状态更灵活，可以手动打开、关闭、重连等。

4. 兼容性
SSE 是标准的 Web API，可以在大部分现代浏览器和移动设备上使用。但如果需要兼容老版本的浏览器（如 IE6/7/8），则需要使用 polyfill 库进行兼容。而 WebSocket 在一些老版本 Android 手机上可能存在兼容性问题，需要使用一些特殊的 API 进行处理。

5. 安全性
SSE 的实现比较简单，都是基于 HTTP 协议的，与普通的 Web 应用没有太大差异，因此风险相对较低。WebSocket 则需要通过额外的安全措施（如 SSL/TLS 加密）来确保数据传输的安全性，避免被窃听和篡改，否则可能会带来安全隐患。

总体来说，SSE 和 WebSocket 都有各自的优缺点，适用于不同的场景和需求。如果只需要服务器向客户端单向推送数据，并且应用在前端的浏览器环境中，则**SSE 是一个更加轻量级、易于实现和维护的选择。而如果需要双向传输数据、支持自定义协议、或者在更加复杂的网络环境中应用，则 WebSocket 可能更加适合**。

## API 用法

`EventSource` 对象是 HTML5 新增的一个客户端 API，用于通过服务器推送实时更新的数据和通知。在使用 `EventSource` 对象时，可以通过以下方法进行配置和操作：

### 1. 构造函数EventSource()：
`const eventSource = new EventSource(url, options);`接收url与服务器进行连接，并开始接收服务器所发送过来的数据
- `url`：String 类型，表示与服务器建立连接的 URL。**必填**，且这里只能够填入`GET`请求。
    
- `options`：Object 类型，表示可选参数。常用的可选参数包括：
    
    - `withCredentials`：Boolean 类型，表示是否允许发送 Cookie 和 HTTP 认证信息。默认为 false。
    - `headers`：Object 类型，表示要发送的请求头信息。
    - `retryInterval`：Number 类型，表示与服务器失去连接后，重新连接的时间间隔。默认为 1000 毫秒。
### EventSource.readyState 属性
`readyState` 属性表示当前 `EventSource` 对象的状态，它是一个只读属性，它的值有以下几个：

- `CONNECTING`：表示正在和服务器建立连接。
- `OPEN`：表示已经建立连接，正在接收服务器发送的数据。
- `CLOSED`：表示连接已经被关闭，无法再接收服务器发送的数据。

示例代码如下：
```html
<body>

    <div id="message"></div>

    <script>

        const messageDiv = document.getElementById('message')

        // 监听回车事件，一旦回车就创建一个sse的事件

        document.addEventListener('keyup', (e) => {

            if (e.keyCode == 13) {
            
                const sse = new EventSource('http://localhost:3000/api/sse')

                // 需要监听sse所返回的后端数据

                // 事件默认为message

                sse.addEventListener('message', (e) => {

                    messageDiv.innerText += e.data

                })

            }

        })

    </script>

</body>
```

**注意：此时按下一次Enter就会触发，如果按下多次，就会有多个SSE数据返回**，

后端部分代码：

```ts
// SSE请求

app.get('/api/sse', (req, res) => {

    res.writeHead(200, {

        'Content-Type': 'text/event-stream', // 设置响应头为SSE,核心代码

    });

    const txt = fs.readFileSync('./naiyexiang.txt', 'utf-8');

    const arr = txt.split(''); // 将文本分割成单个字符的数组

    let currntIndex = 0;

    let timer = setInterval(() => {

        if (currntIndex < arr.length) {

            res.write(`event: lol\n`); // 发送事件类型

            res.write(`data: ${ arr[currntIndex]}\n\n`); // 发送单个字符到客户端

            currntIndex++;

        } else {

            clearInterval(timer); // 发送完所有字符后清除定时器

        }

    }, 300);

  

});
```

注意：```
```res.write(`event: lol\n`)就会将type改成lol，因此在前端就需要使用
```ts
sse.addEventListener('lol', (e) => {

                    messageDiv.innerText += e.data

                })
```

来进行接收

# WebSocket

## 概述

WebSocket 是一种在单个 TCP 连接上进行全双工通信的网络协议。它是 HTML5 中的一种新特性，能够实现 Web 应用程序和服务器之间的实时通信，比如在线聊天、游戏、数据可视化等。

相较于 HTTP 协议的请求-响应模式，使用 WebSocket 可以建立持久连接，允许服务器主动向客户端推送数据，避免了不必要的轮询请求，提高了实时性和效率。同时，WebSocket 的连接过程也比较简单，可以通过 JavaScript 中的 WebSocket API 进行创建和管理，并且可以和现有的 Web 技术如 HTML、CSS 和 JavaScript 无缝集成。

WebSocket 协议是基于握手协议（Handshake Protocol）的，它在建立连接时使用 HTTP/HTTPS 发送一个初始握手请求，然后服务器响应该请求，建立连接后就可以在连接上进行数据传输了。

总之，WebSocket 提供了一种快速、可靠且灵活的方式，使 Web 应用程序能够实现实时通信，同时也提高了网络性能和用户体验。

## API以及代码讲解

首先需要安装对应的库

```bash
npm i ws
npm i @types/ws -D
```

后端服务需要用到`WebSocketServer`这个API：

```ts
import {WebSocketServer} from 'ws'
```

然后编写简单的连接代码：

```ts
const wss = new WebSocketServer({ port: 8080 }, () => {
    console.log('socket服务启动成功：8080')
})

// 监听客户端的连接
wss.on('connection', (socket) => {
    console.log("客户端连接成功")
})
```

这样后端部分就处理完毕了，前端的话，就需要用到h5的`new WebSocket`

```js
<script>
        // WebSocket 协议有 ws:// wss:// 和 http:// https:// 的区别一样
        const ws = new WebSocket('ws://localhost:8080');
        
        // open 连接成功
        ws.addEventListener('open', (event) => {
            console.log("连接成功")
        })
    </script>
```

##### 前端发送后端接收
前端发送用`ws.send(text)`,后端接收使用`socket.on('message')`,示例代码如下：
```ts
// 前端部分
sendBtn.addEventListener('click', () => {
            // 发送消息使用send方法
            if (input.value) {
                ws.send(input.value)
            }
        })
```

```ts
// 后端部分
// 监听客户端的连接
wss.on('connection', (socket) => {
    console.log("客户端连接成功")

    // 通过socket来监听
    socket.on('message', (e)=> {
        console.log(e)
    })
})
```

前端发送123，获取到的是Buffer：

![](/images/posts/send%20ws%2020260212144759.png)

![](/images/posts/receive%20ws%2020260212144732.png)

所以可以将`e.toString()`进行处理即可。

##### 后端发送前端接收

后端的话可以将字符进行处理，然后再回调给前端，使用`socket.send()`发送即可：

```ts
// 后端
wss.on('connection', (socket) => {

    // 通过socket来监听
    socket.on('message', (e)=> {
        console.log(e.toString())
        socket.send(`处理后的字符串：~~${e.toString()}~~`)
    })
})
```

前端一样的，通过`message`事件监听进行接收：

```ts
let showArea = document.getElementById('show-content')
ws.addEventListener('message', (e) => {
    showArea.innerText = e.data
})
```

当然，这种方式只是点对点的方式，并不是广播的方式去推送
后端的`wss.clients`是一个set，用来存放所有已经连接的用户，通过forEach就能实现群发：

```ts
 // 群发消息
wss.clients.forEach((websocket) => {
     websocket.send(`处理后的字符串：~~${e.toString()}~~`)
})
```

##### 心跳检测

![](/images/posts/heart%20break%2020260212151258.png)

# # navigator.sendBeacon

## 使用 `navigator.sendBeacon` 实现高效的数据上报

在 web 开发中，我们经常需要将用户行为或性能数据上报到服务器。为了不影响用户体验，开发者通常会在页面卸载时进行数据上报。然而，传统的数据上报方式，如 `XMLHttpRequest` 或 `Fetch API`，容易受到页面卸载过程中的阻塞，导致数据丢失。为了解决这个问题，`navigator.sendBeacon` API 被引入，它可以在页面卸载时安全、可靠地发送数据。

#### `navigator.sendBeacon` 对比 Ajax fetch

###### 优点

1. 不受页面卸载过程的影响，确保数据可靠发送。
2. 异步执行，不阻塞页面关闭或跳转。
3. 能够发送跨域请求。

##### 缺点

1. fetch 和 ajax 都可以发送任意请求 而 sendBeacon 只能发送POST
2. fetch 和 ajax 可以传输任意字节数据 而 sendBeacon 只能传送少量数据（64KB 以内）
3. fetch 和 ajax 可以定义任意请求头 而 sendBeacon 无法自定义请求头
4. sendBeacon 只能传输 [`ArrayBuffer`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArrayBuffer "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer")、[`ArrayBufferView`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FTypedArray "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray")、[`Blob`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FBlob "https://developer.mozilla.org/zh-CN/docs/Web/API/Blob")、[`DOMString`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FString "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String")、[`FormData`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FFormData "https://developer.mozilla.org/zh-CN/docs/Web/API/FormData") 或 [`URLSearchParams`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FURLSearchParams "https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams") 类型的数据
5. `如果处于危险的网络环境，或者开启了广告屏蔽插件 此请求将无效`

  相关代码如下：
  
  ```ts
  // 后端
  app.post('/api/beacon', (req, res) => {
    console.log(req.body)
    res.send('ok')
})
  ```

```ts
// 前端
 let json = JSON.stringify({name:'Asahina Mafuyu'})
        let blob = new Blob([json], {type: 'applicaion/json'})
        send.addEventListener('click', () => {
            navigator.sendBeacon("http://localhost:3000/api/beacon", blob)
        })
```

# HTTPS

## HTTPS概述

HTTPS，全称为 Hypertext Transfer Protocol Secure，是一种通过加密通道传输数据的安全协议。它是 HTTP 协议的安全版本，用于在 Web 浏览器和 Web 服务器之间进行安全的数据传输。HTTPS 在传输过程中使用了 SSL（Secure Sockets Layer）或 TLS（Transport Layer Security）协议来加密数据，确保敏感信息在传输过程中不会被窃取或篡改。

##### http 缺点
- 通信使用明文(不加密)，内容可能会被盗用
- 不验证通信方的身份，因此有可能遭遇伪装
- 无法证明报文的完整性，所以有可能已遭篡改

##### https优点
- 信息加密
- 完整性校验
- 身份验证

**HTTPS = http + TLS/SSL**

## TLS SSL
TLS（Transport Layer Security）和 SSL（Secure Sockets Layer）是用于保护网络通信的安全协议。它们都提供了加密和认证机制，用于确保数据传输的机密性和完整性。

SSL 是最早的安全协议，而 TLS 是在 SSL 的基础上发展起来的。目前广泛使用的版本是 TLS 1.2 和 TLS 1.3。TLS 1.3 是最新的协议版本，在安全性、性能和功能方面有一些改进。

TLS 和 SSL 主要用于以下两个方面：
1. 加密通信：TLS/SSL 使用加密算法来对数据进行加密，防止第三方截获和窃听通信内容。它可以确保数据在传输过程中的隐私性。
2. 身份认证：TLS/SSL 还提供了身份验证机制，用于确认通信双方的身份，并确保数据只发送到正确的接收方。这可以防止恶意用户冒充其他用户或服务器。

SSL 是最早的用来做https
TLS 是SSL升级版 提高了安全性 并解决了SSL存在的一些安全性问题

SSl/TLS 工作原理类似的
HTTP TLS/SSL 安全层 TCP


## 加密

##### 对称加密

常见的算法有 `AES DES` 加密
举例 `麒麟->星月`发消息 但是他们的消息不想被别人知道，采用了对称加密，于是他们两个协商了一段密钥，`今生永相随`

麒麟：`AES算法 + 密钥（今生永相随）+明文（吃面） = XMZSXMZS==`
星月：`使用AES + 密钥（今生永相随）+密文（ XMZSXMZS==） = 吃面`

非对称加密
常见算法有RSA DSA 加密
举例 `麒麟->星月`发消息，这次使用的是非对称加密，生成了公钥和私钥，公钥可以对外公开，私钥必须只能麒麟知道不能泄露。

星月：`RSA + 公钥 + 明文（吃面） = XMZS==`
麒麟：`RSA + 私钥 + 密文（XMZS==） = 吃面`

## openSSL 生成私钥

windows: [OpenSSL](https://www.openssl.org/source/)

## 常用命令

##### 1. `openssl genpkey -algorithm RSA -out private-key.pem -aes256`
生成私钥.pem文件
- openssl: OpenSSL 命令行工具的名称。
- genpkey: 生成私钥的命令。
- algorithm RSA: 指定生成 RSA 私钥。
- out private-key.pem: 将生成的私钥保存为 private-key.pem 文件。
- aes256: 为私钥添加 AES 256 位加密，以保护私钥文件不被未经授权的人访问。
然后下一步终端就会跳出：
```bash
Enter PEM pass phrase:
```
 可以填入类似于`xiaoxie` 密码短语生成pem文件的时候需要 
 这个密码短语也就是所有要使用私钥的时候都要输入这个密码

##### 2. openssl req -new -key private-key.pem -out certificate.csr
该命令用于生成.csr证书文件
1. “req”: 表示使用 X.509 证书请求管理器 (Certificate Request Management) 功能模块。
2. “-new”: 表示生成新的证书签名请求。
3. “-key private-key.pem”: 表示使用指定的私钥文件 “private-key.pem” 来加密证书签名请求中的密钥对。
4. “-out certificate.csr”: 表示输出生成的证书签名请求到文件 “certificate.csr” 中。该文件中包含了申请者提供的一些证书请求信息，例如公钥、授权主体的身份信息等。
##### 3. openssl x509 -req -in certificate.csr -signkey private-key.pem -out certificate.pem
该命令用于生成.pem证书文件
1. “x509”: 表示使用 X.509 证书管理器功能模块。
2. “-req”: 表示从输入文件（这里为 “certificate.csr”）中读取证书签名请求数据。
3. “-in certificate.csr”: 指定要读取的证书签名请求文件名。
4. “-signkey private-key.pem”: 指定使用指定的私钥文件 “private-key.pem” 来进行签名操作。一般情况下，签名证书的私钥应该是和之前生成 CSR 的私钥对应的。
5. “-out certificate.pem”: 表示将签名后的证书输出到文件 “certificate.pem” 中。该文件中包含了签名后的证书信息，包括签名算法、有效期、公钥、授权主体的身份信息等。

然后就可以启一个`HTTPS`的后端服务
代码示例如下：
```ts
// 引入https服务
import https from 'https'
import fs from "node:fs"

// https默认为443
https.createServer({
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem'),
    // 密码短语，当时配置的是什么，这里就要写什么
    passphrase: 'xiaoxie'
}, (req, res) => {
    res.writeHead(200)
    res.end('success')
}).listen(443, () => {
    console.log("https server start success, https://localhost:443")
})
```

## Nginx中配置HTTPS

如果在windows使用nginx配置https 私钥不能设置密码

1. openssl genrsa -out nginx.key 2048 （生成私钥）
2. openssl req -new -key nginx.key -out nginx.csr（生成签名文件）
3. openssl x509 -req -in nginx.csr -signkey nginx.key -out nginx.crt（生成证书）

在Nginx中配置：
```nginx
    server {
       listen       443 ssl;
       server_name  localhost;

       ssl_certificate      nginx.crt;
       ssl_certificate_key  nginx.key;

       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

       location / {
           root   html;
           index  index.html index.htm;
       }
    }

```

# JWT TOKEN

##### JWT是三部分组成的

1. 头部（Header）：头部通常由两部分组成：令牌的类型（即 “JWT”）和所使用的签名算法。头部通常采用 JSON 对象表示，并进行 Base64 URL 编码。
	- alg：代表所使用的签名算法，例如 [HMAC](https://so.csdn.net/so/search?q=HMAC&spm=1001.2101.3001.7020) SHA256（HS256）或 RSA 等。  
	- typ：代表令牌的类型，一般为 “JWT”。
```JSON
{
  "alg": "HS256",
  "typ": "JWT"
}

```

2.  负载（Payload）：负载包含所要传输的信息，例如用户的身份、权限等。负载也是一个 JSON 对象，同样进行 Base64 URL 编码。
	- iss：令牌颁发者（Issuer），代表该 JWT 的签发者。
	- exp：过期时间（Expiration Time），代表该 JWT 的过期时间，以 Unix 时间戳表示。
	- sub：主题（Subject），代表该 JWT 所面向的用户（一般是用户的唯一标识）。
	- 自定义声明：可以添加除了预定义声明之外的任意其他声明。

```json
{
  "iss": "example.com",
  "exp": 1624645200,
  "sub": "1234567890",
  "username": "johndoe"
}

```

3. 签名（Signature）：签名是使用私钥对头部和负载进行加密的结果。它用于验证令牌的完整性和真实性。

```js
    HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secretKey
    )

```

用到的依赖
1. passport passport是一个流行的用于身份验证和授权的Node.js库
2. passport-jwt Passport-JWT是Passport库的一个插件，用于支持使用JSON Web Token (JWT) 进行身份验证和授权
3. jsonwebtoken 生成token的库

# 前端网络状态

`online` 和 `offline` 事件是浏览器自带的两个事件，可以通过添加事件监听器来检测当前网络连接状态。当浏览器的网络连接发生变化，比如从在线状态切换到离线状态，或者从离线状态切换到在线状态时，这两个事件就会被触发。以下是示例代码：

```js
window.addEventListener('online', () => {
            console.log("当前为在线状态")
        })
        window.addEventListener('offline', () => {
            console.log("噢哦，当前没有网络！！！")
        })
```

`navigator.connection` 是 Web API 中提供的一种获取网络连接相关信息的接口。该接口返回的是一个 `NetworkInformation` 对象，包含了多个关于用户设备网络连接状况的属性，如网络类型、带宽、往返时间等。

```js
console.log(navigator.connection)
```

![](/images/posts/Network%20Info%2020260212203136.png)

- `downlink`: 当前网络连接的估计下行速度（单位为 Mbps）
- `downlinkMax`: 设备网络连接最大可能下行速度（单位为 Mbps）
- `effectiveType`: 当前网络连接的估计速度类型（如 slow-2g、2g、3g、4g 等）
- `rtt`: 当前网络连接的估计往返时间（单位为毫秒）
- `saveData`: 是否处于数据节省模式

# XSS攻击

![](/images/posts/Reflect%20XSS%2020260212203557.png)

![](/images/posts/Storage%20XSS%2020260212203714.png)

存储型XSS的攻击原理就是：**如果评论没有进行script脚本过滤，那么这条评论的script就会被写入到数据库当中，当每个访问这个帖子的用户从数据库拉取这条评论的时候，都会被XSS攻击**。

![](/images/posts/DOM%20XSS%2020260212204200.png)

![](/images/posts/XSS%20TOOLS%2020260212211129.png)

![](/images/posts/Prevent%20XSS%2020260212211345.png)

预防XSS则可以使用第三方库: [xss - npm](https://www.npmjs.com/package/xss)

# TCP实现HTTP服务

使用原生的`net`来实现这个应用服务

```ts
import * as net from 'net'
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log(data.toString())
    })
})

server.listen(8080, () => {
    console.log("server is started at ", server.address())
})
```

从控制台可以看到请求数据如下：

```HTTP Request Headers
GET / HTTP/1.1
Host: localhost:8080
Connection: keep-alive
sec-ch-ua: "Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
```

通过截取这些数据可以得到GET、POST请求等等