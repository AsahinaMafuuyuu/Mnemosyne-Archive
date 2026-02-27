---
layout: ../../layouts/MarkdownPostLayout.astro
title: 学习SocketIo
pubDate: 2026-02-26T10:41:00
author: AsahinaMafuyu
description: socket io可以用来进行服务器和客户端的通讯的第三方库，由于实际开发并不需要一直使用websocket进行原生态的开发，因为这样也很复杂
cover:
  url:
  alt:
tags:
  - NodeJs
  - 前端
  - 后端
  - WebSocket
---
## 概述

socket io 官方地址：[Socket.IO](https://socket.io/zh-CN/)

安装：

```bash
npm i socket.io
```

简易聊天室

```html index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class="room">
        <div class="left">
            <div class="groupList">
                <!-- groupList items -->
            </div>
        </div>
        <div class="right">
            <header class="header">聊天室</header>
            <main class="main">
                <!-- main content -->
            </main>
            <footer class="footer">
                <div class="ipt" contenteditable=""></div>
            </footer>
        </div>
    </div>
    <style>
        * {
            padding: 0px;
            margin: 0px;
            box-sizing: border-box;
        }
        .room{
            display: flex;
            margin: 0 auto;
            width: 80%;
            max-width: 80%;
            height: 100vh;
            background-color: #000;
            border: 1px solid orange
        }
        .left {
            width: 20%;
            height: 100%;
            border: 1px solid green
        }
        .right {
            display: flex;
            flex-direction: column;
            width: 80%;
            height: 100%;
            border: 1px solid yellow
        }
        .header {
            width: 100%;
            height: 50px;
            border-bottom: 1px solid green;
            padding-left: 16px;
            color: green;
            line-height: 50px;
        }
        .main {
            width: 100%;
            flex: 1 0 0;
            border-bottom: 1px solid white;
        }

        .footer {
            height: 30%;
            width: 100%;
            color: white;
        }
        .footer div {
            height: 100%;
            width: 100%;
            padding: 16px;
        }
        .groupList-item {
            width: 100%;
            height: 50px;
            line-height: 50px;
            background-color: #fff;
            color: blueviolet;
            padding-left: 24px;
        }
        .main-chat {
            width: 100%;
            height: 40px;
            line-height: 40px;
            padding-left: 24px;
            color:#ccc;
        }
    </style>
    <script type="module">
        let name = prompt('请输入名字')
        let room = prompt('请输入房间号')
        // 获取聊天室
        const group = document.querySelector('.groupList') // 左侧列表
        const main = document.querySelector('.main') // 右侧内容展示
        const ipt = document.querySelector('.ipt') // 右侧输入框

        // 在本页中添加这个DOM元素
        const addChat = (msg) => {
            let item = document.createElement('div')
            item.className = 'main-chat'
            item.innerHTML = `${msg.name}: ${msg.message}`
            main.appendChild(item)
        }
        import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
        const socket = io('ws://localhost:3000'); // ws的地址
        socket.on("connect", () => {
            // 1. 加入房间
            socket.emit('join', { name, room})

            // 2.接收发送过来的浏览器渲染
            socket.on("groupMap", (data) => {
                group.innerHTML = ''
                Object.keys(data).forEach((roomId) => {
                    const item = document.createElement('div')
                    item.className = 'groupList-item'
                    item.innerHTML = `房间号：${roomId} 房间人数：${data[roomId].length}`
                    console.log(item)
                    group.appendChild(item)
                })
            })

            // 3. 接收发送过来的message
            socket.on('message', (data) => {
                addChat(data)
            })

            // 4. 监听回车事件
            document.addEventListener('keyup', (e) => {
                if(e.key === 'Enter') {
                    const message = ipt.innerText
                    
                    // 派发这个事件
                    socket.emit('message', { name, message, room})
                    addChat({name, message})
                    ipt.innerText = ''
                }
            })
        })
    </script>
</body>
</html>
```

```ts server.ts
import http from 'node:http'
import { Server } from 'socket.io'

const server = http.createServer()

const io = new Server(server, {
    cors: { origin: "*" } // 允许跨域
})

interface GroupMap {
    [key: string]: Array<{ name: string, id: number, roomid:number}>
}
const groupMap: GroupMap = {}

/*
groupMap 数据类型如下：
{
    1: [{name, id, roomid}, {name, id, roomid}]
    2: [{name. id, roomid}, {name, id, roomid}]
    ...
}
*/

// 事件模型驱动
io.on('connection', (socket) => {
    // 连接的时候要求输入房间号，加入房间等操作
    // 要输入名字和房间号
    // 组装一个格式，因为前端要渲染
    socket.on('join', ({ name, room }) => { // 创建一个房间（如果有的话就加入）
        socket.join(room)
        if (!groupMap[room]) {
            groupMap[room] = []
        }
        groupMap[room].push({ name, id: groupMap[room].length + 1, roomid: room}) // 把用户信息放到房间里

        // 派发给前端渲染
        socket.emit('groupMap', groupMap)

        // 由于浏览器需要每个人都能看见，因此需要广播
        socket.broadcast.to(room).emit('groupMap', groupMap)


        // 管理员发个消息
        socket.broadcast.to(room).emit('message', {
            name:"管理员",
            message: `欢迎${name}进入聊天室`
        })
    })

    // 监听message事件
    socket.on('message', ({name, message, room}) => {
        socket.broadcast.to(room).emit('message', {
            name,
            message
        })
    })
})

server.listen(3000, () => {
    console.log('server is running at 3000')
})
```

*（该笔记内容摘自小满zs）*

