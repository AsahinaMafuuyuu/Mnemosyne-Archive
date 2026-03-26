---
layout: ../../layouts/MarkdownPostLayout.astro
title: Fastify全面知识点
pubDate: 2026-02-10T11:19:00
author: AsahinaMafuyu
description: 本文主要学习Fastify（为什么学fastify呢？因为express的吞吐量和延迟性能远不及fastify，因此学习fastify是作为NodeJs后端服务最后的倔强）
cover:
  url: https://image-bucket.asahinamafuyu.top/astro-covers/LearnFastify-Cover.jpg
  alt:
tags:
  - Fastify
  - FullStack
  - 学习笔记
---
## 概述
### 安装

```bash
npm i fastify
```

### 相关工程

本项目使用的是`type: module`，因此导入使用ESM的方式进行导入

```js index.js
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
```

声明路由的话和`express`一样：

```js index.js
// 声明一个路由，访问 http://localhost:3000/ 时会返回 { hello: 'world' }
fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})

// 启动服务器，监听 3000 端口
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

    // :: 1 = IPv6 版本的本机地址
    //  127.0.0.1 = IPv4 版本的本机地址
    //  3000 = 端口号
    console.log(`Server is now listening on ${address}`)
})
```

### 数据库相关

#### MySql:

```bash
npm i @fastify/mysql
```

```js
import fastifySql from '@fastify/mysql';
// 注册 MySQL 插件，连接到本地的 MySQL 数据库
fastify.register(fastifySql, {
    connectionString: 'mysql://root:password@localhost:3306/my_sql'
})
```

user表是这样的：

![](../../assets/images/posts/LearnFastify.png)

编写相关代码如下：

```js
// 定义一个路由，访问 http://localhost:3000/user/:id 时会查询数据库中的 user 表，并返回结果
fastify.get('/user/:id', function(req, res) {
  fastify.mysql.query(
    'SELECT id, email, name FROM user WHERE id=?', [req.params.id],
    function onResult (err, result) {
      res.send(err || result)
    }
  )
})
```

结果如下

![](../../assets/images/posts/LearnFastify-1.png)

#### Redis

```bash
npm i @fastify/redis
```

```js
import fastifyRedis from '@fastify/redis';
// 注册 Redis 插件，连接到本地的 Redis 服务器
fastify.register(fastifyRedis, {
    host: "127.0.0.1"
})

// 定义一个路由，访问 http://localhost:3000/foo 时会向 Redis 服务器存储一个键值对，并返回结果
fastify.get('/foo', async function (req, res) {
    const { redis } = fastify
    const result = await redis.set('foo', 'bar')
    res.send(result)
})
```

##  NestJs

安装

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

启动

```bash
npm run start
```

创建好的工程结构如下：

![](../../assets/images/posts/LearnFastify-2.png)

![](../../assets/images/posts/LearnFastify-3.png)

其中`app.controller.ts`是配置路由规则的：

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 这里可以添加基础路由
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // 这里也可以添加路由，和spring一样的
  getHello(): string {
    return this.appService.getHello();
  }
}
```

`controller`、`service`和springboot的如出一辙

快速创建目录结构

```
nest g resource [name]
```

这样就创建好了`demo`

![](../../assets/images/posts/LearnFastify-4.png)

注入也是自动的，不过方法需要自己亲手实现

### 使用Fastify

安装依赖

```bash
npm i @nestjs/platform-fastify
```

`main.ts`中需要进行修改：

```ts main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

#### 1. 如果你代码里直接用了 Express 类型

例如：
```ts
import { Request, Response } from 'express';
```

或者：
```ts
@Get()  
test(@Req() req: Request, @Res() res: Response) {}
```

那切 Fastify 后，最好改成 Fastify 的类型，或者尽量少直接依赖底层平台。

Fastify 对应的是：
```ts
import { FastifyRequest, FastifyReply } from 'fastify';
```


比如：

```ts
import { Controller, Get, Req, Res } from '@nestjs/common';  
import { FastifyRequest, FastifyReply } from 'fastify';  
  
@Controller()  
export class AppController {  
  @Get()  
  test(@Req() req: FastifyRequest, @Res() res: FastifyReply) {  
    res.send({ hello: 'world' });  
  }  
}
```

### 版本控制

版本控制允许你在同一个应用程序中运行**不同版本**的控制器或路由。应用程序经常变更，因此经常会遇到需要进行重大更改，同时又需要支持先前版本的应用程序的情况。

有4种版本类型控制：

|    URI Versioning     |        版本信息将包含在请求的 URI 中（默认）。         |
| :-------------------: | :-----------------------------------: |
|  Heading Versioning   |              自定义请求头将指定版本              |
| Media Type Versioning |         请求的 `Accept` 标头将指定版本          |
|   Custom Versioning   | 请求中的任何信息都可用于指定版本。我们提供了一个自定义函数来提取所述版本。 |

####  [URI 版本控制类型](https://docs.nestjs.com/techniques/versioning#uri-versioning-type)

URI 版本控制使用请求 URI 中传递的版本，例如 `https://example.com/v1/route` 和 `https://example.com/v2/route` 。

> 启用 URI 版本控制后，版本号将自动添加到 URI 中， [位于全局路径前缀](https://docs.nestjs.com/faq/global-prefix) （如果存在）之后，以及任何控制器或路由路径之前。

开启URI版本控制，只需要在`main.ts`中开启即可：

```ts main.ts
typescript
const app = await NestFactory.create(AppModule);
// or "app.enableVersioning()"
app.enableVersioning({
  type: VersioningType.URI,
});
await app.listen(process.env.PORT ?? 3000);
```

> URI 中的版本号默认会自动加上 `v` 前缀，但是可以通过将 `prefix` 键设置为所需的前缀或 `false` 如果希望禁用该功能）来配置前缀值。

使用的话就在`Controller`中使用Version：

```ts controller.ts
@Controller({ path: 'demo', version: '1' }) // 这里的话就指定路由版本
export class DemoController {
}
```

此时访问`http://localhost:3000/v1/demo`才能访问该路径下的各种方法

同样的还可以指定方法版本：

```ts
@Get('')
@Version('2')
findAll() {
return this.demoService.findAll();
}
```

> 如果方法和controller层都指定了版本，方法优先.

这两种写法是等价的：

```ts
export class DemoController {  
	private readonly demoService: DemoService;  
	  
	constructor(demoService: DemoService) {  
		this.demoService = demoService;  
	}  
}
```

```ts
export class DemoController {  
	constructor(private readonly demoService: DemoService) {}  
}
```

和springboot一样，支持动态参数解析：

```ts
 @Get('')
  findAll(
    @Query('name') name: string,
    @Query('age') age: number,
    @Response() res: FastifyReply,
  ) {
    console.log(name, age);
    res.send({
      code: 200,
      message: '成功',
      data: {
        name: 'Asahina Mafuyu',
        age: 17,
        team: 'nightcord in 25',
      },
    });
  }
```

### session插件

需要一起安装cookie

```bash
npm i @fastify/cookie @fastify/session
```

然后在main.ts当中配置：

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cookie from '@fastify/cookie';
import session from '@fastify/session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableVersioning({ type: VersioningType.URI });
  await app.register(cookie);
  await app.register(session, {
    secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    cookieName: 'captcha_sid', // 自定义 cookie key
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false, // 本地 http 开发先关掉；上线 https 再改 true
      maxAge: 24 * 60 * 60 * 1000, // 1 天
    },
    saveUninitialized: false,
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  });
}
bootstrap();
```

这样的话存入session中的就有`captcha_sid`：

![](../../assets/images/posts/LearnFastify-5.png)

具体关于验证码什么的可以查看：

[小满nestjs（第九章 nestjs Session）-CSDN博客](https://xiaoman.blog.csdn.net/article/details/126327047)

关于依赖注入（Inject和Injectable），可以查看[NestJS 中文文档](https://docs.nestjs.cn/fundamentals/dependency-injection)来得到更深的认知

其实总结下来就两句话：

1. 在`xxx.module.ts`(这个xxx是任意的套组，可以是app)中规定，比如我在`demo.module.ts`中写入：
	```ts
	import { Module } from '@nestjs/common';
	import { DemoService } from './demo.service';
	import { DemoController } from './demo.controller';
	const test_obj = {
	  name: '中华第一剑',
	  age: '18',
	};
	
	@Module({
	  controllers: [DemoController],
	  providers: [
	    DemoService,
	    {
	      provide: 'test_obj',
	      useValue: test_obj,
	    },
	  ],
	})
	export class DemoModule { }
	```
	这里的`providers`也就是需要注入的依赖容器中的bean，额可以类似于这么理解
2. 在需要注入的地方，可以直接用@Inject进行注入即可:
	```ts
	@Controller({ path: 'demo' })
	export class DemoController {
	  constructor(
	    private readonly demoService: DemoService,
	    @Inject('test_obj') private testObj: object,
	  ) { }
	  @Get('obj')
	  Test_Obj() {
	    return this.testObj;
	  }
	}
	```

![](../../assets/images/posts/LearnFastify-6.png)

>- **是 class，并且想让 Nest 帮你创建实例** → 往往要 `@Injectable()`
>	
>- **只是普通对象、配置、数组、字符串、数字** → 用 `useValue`，不用 `@Injectable()`

## 共享模块

共享模块也十分常见，首先我创建两个Module：

![](../../assets/images/posts/LearnFastify-7.png)

例如一个`UserController`中需要用到`ShoppingCartService`以及`UserService`，而`ShoppingCartService`是其他组件里的service，那么此时我们需要用到共享模块，并且需要进行导出，此时首先需要导出`UserService`，在`user.module.ts`中配置:

```ts user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 这一步最关键，需要导出Service
})
export class UserModule {}
```

然后在`shopping-cart.module.ts`中导入：

```ts
import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { UserModule } from '../user/user.module'; 

@Module({
  imports: [UserModule], // 导入提供 ShoppingCartService 的模块
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule { }
```

然后在`shopping-cart.controller.ts`中编写以下代码：

```ts shopping-cart.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { UserService } from '../user/user.service';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body() createShoppingCartDto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(createShoppingCartDto);
  }

  @Get()
  findAll() {
    // return this.shoppingCartService.findAll();
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingCartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingCartDto: UpdateShoppingCartDto) {
    return this.shoppingCartService.update(+id, updateShoppingCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingCartService.remove(+id);
  }
}
```

![](../../assets/images/posts/LearnFastify-8.png)

### 中间件

创建一个`middlewares/logger.middleware.ts`文件：

```ts middlewares/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(
        req: FastifyRequest['raw'],
        res: FastifyReply['raw'],
        next: () => void,
    ) {
        console.log('中华第一剑来了...');
        next(); // 不阻塞路由运行
    }
}
```

然后将中间件注入到`UserModule`当中（user.module.ts）：

```ts user.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggerMiddleware } from '../middlewares/logger.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('user') // 对于user路由通通使用这个中间件
  }
}
```

测试一下：

![](../../assets/images/posts/HelloAlgorithm-Day2-7.png)

![](../../assets/images/posts/HelloAlgorithm-Day2-8.png)

并且只在访问`http://localhost:3002/user`的时候才会触发，对于user的子路由，一律不触发！

路由通配符也可以进行修改：

```ts
forRoutes({
  path: 'user/*',
  method: RequestMethod.ALL,
});
```

或者如果想要拦截所有controller中的地址，则可以直接：

```ts
import { UserController } from './user.controller';
export class AppModule implements NestModule {
 configure(consumer: MiddlewareConsumer) {
   consumer
     .apply(LoggerMiddleware)
     .forRoutes(UserController); // 直接塞进去controller即可
 }
}
```

排除路由：

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/{*splat}'
  )
  .forRoutes(CatsController);
```

若要使用多个中间件，则：

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

### 全局中间件

全局中间件的话，就是将类替换成了函数：

> middleware 拿到的是 **raw req / raw res**，不是 Fastify 的 wrapper；原因是它底层用的是 `middie` 这套 middleware 机制

创建一个`global.middleware.ts`文件：

```ts global.middleware.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export function BlockDemoRoute(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    if (req.url?.includes('demo')) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('你已经被拦截了')
    } else {
        next()
    }
}
```

此时导出了这样一个中间件函数，需要在`main.ts`中全局注册：

```ts main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { BlockDemoRoute } from './middlewares/global.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 使用全局中间件
  app.use(BlockDemoRoute)
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(process.env.PORT ?? 3002, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3002}`);
  });
}
bootstrap();
```

然后发现就可以拦截到我们的router了：

![](../../assets/images/posts/HelloAlgorithm-Day2-9.png)

user呢，其实是对的：

![](../../assets/images/posts/HelloAlgorithm-Day2-10.png)

### 测试文件

由nestJs创建的一整个完整的目录当中，可以看到有.spec之类的文件，这些文件就是测试文件（后面再学习，先暂时可以扔下）

![](../../assets/images/posts/HelloAlgorithm-Day2-11.png)

去掉这些测试文件，也是没有任何问题的（但是首先还是建议保留）

如果是要单独生成controller或者service，则：

```bash
nest g controller [name]
nest g service [name]
```

> 注意：如果在项目的默认目录下，就会默认注册到src目录下，如果在src的某一级目录下，则默认注册到该目录下，此时注册的是user目录下，因此需要进入user目录下

```bash
PS D:\web_project\nest-demo> cd .\src\user\
PS D:\web_project\nest-demo\src\user> nest g controller UserInfoController
CREATE user-info-controller/user-info-controller.controller.ts (131 bytes)
CREATE user-info-controller/user-info-controller.controller.spec.ts (596 bytes)
UPDATE user.module.ts (742 bytes)
```

此时注册完毕：

![](../../assets/images/posts/HelloAlgorithm-Day2-12.png)

可以看到多出了一个目录`user-info-controller`

并且此时也会默认添加到当前目录下的.module.ts文件当中：

![](../../assets/images/posts/HelloAlgorithm-Day2-13.png)

GPT给出的推荐目录结构为：

```
src  
├─ user  
│ ├─ user-info  
│ │ ├─ user-info.controller.ts  
│ │ ├─ user-info.service.ts  
│ │ ├─ dto  
│ │ └─ entities  
│ ├─ user-setting  
│ │ ├─ user-setting.controller.ts  
│ │ ├─ user-setting.service.ts  
│ │ ├─ dto  
│ │ └─ entities  
│ └─ user.module.ts
```

## 文件上传

```bash
npm i @fastify/multipart
```

`main.ts`中注册：

```ts main.ts
// ...
import fastifyMulter from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(fastifyMulter);
  await app.listen(process.env.PORT ?? 3002, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3002}`);
  });
}
bootstrap();
```

首先定义controller，controller层我们打算首先接住这个文件，然后转发到service层，在service层中进行逻辑处理，`upload.controller.ts`相关代码如下：

```ts upload.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { UploadService } from './upload.service';
import { UploadDto } from './dto/create-upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('files')
  async upload(@Req() req: FastifyRequest) {
    const data = await req.file()
    // 将数据传递给service
    return this.uploadService.upload(new UploadDto(data))
  }
}
```

然后我们还要用类封装起来，就用`UploadDto`:

```ts
import type { MultipartFile } from '@fastify/multipart'
export class UploadDto {
    file: MultipartFile | undefined;
    constructor (file: MultipartFile | undefined) {
        this.file = file
    }
}
```

`upload-service.ts`:

> 记住：上传的对象是`MultipartFile`类型的

```ts upload-service.ts
import { Injectable } from '@nestjs/common';
import { UploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
import path from 'node:path';

@Injectable()
export class UploadService {
  async upload(uploadFile: UploadDto) {
    // 创建文件目录
    if (!uploadFile.file) {
      throw new Error('未上传文件');
    }

    const fileInfo = uploadFile.file

    // 存储位置
    const uploadDir = path.join(process.cwd(), 'src', 'assets', 'uploads')

    // 2. 确保目录存在
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // 3. 生成文件名
    const ext = path.extname(fileInfo.filename || '');
    const baseName = path.basename(fileInfo.filename || 'unknown', ext);
    const uploadDate = Date.now()
    const safeName = `${baseName}-${uploadDate}${ext}`;

    // 4. 最终路径
    const filePath = path.join(uploadDir, safeName);

     // 5. 把上传流写入磁盘 (关键)
    await pipeline(fileInfo.file, fs.createWriteStream(filePath));

    // 上传成功：
    return {
      code: 200,
      message: '上传成功',
      data: {
        path: filePath,
        date: uploadDate,
      }
    }
  }
}
```

可以看到结果：

![](../../assets/images/posts/LearnFastify-9.png)

![](../../assets/images/posts/LearnFastify-10.png)

### 下载文件

下载文件非常简单：设置请求头即可，然后用fs.createReadStream即可：

```ts
  download(filename: string): fs.ReadStream {
    const filePath = path.join(this.uploadDir, filename)
    const stream = fs.createReadStream(filePath)
    return stream;
  }
```

controller层：

```ts
  @Get('download/:filename')
  download(@Param('filename') filename: string, @Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const stream = this.uploadService.download(filename)
    res
    .header('Content-Type', 'application/octet-stream')
    .header('Content-Disposition', `attachment; filename="${filename}"`)
    .send(stream)
  }
```

前端测试页面如下：

```html
<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
 <a href="http://localhost:3002/upload/download/loveOrlie-1773921843807.jpg" target="_blank">下载色图</a>
</body>
<script>
</script>
</html>
```

点击就能下载，具体可以看以前的文章: [学习NodeJs中如何点击标签下载文件](https://asahinamafuyu.top/posts/NodeJs-DownloadFile)

### 拦截器

当一个请求进来的时候，大致流程如下：

`请求 -> 中间件 -> 守卫 -> 拦截器(前) -> 管道 -> 控制器方法 -> 拦截器(后) -> 响应`

所以拦截器能做两类事：
1. 在方法执行前做点事
	比如：
	
	- 记录开始时间
	    
	- 打日志
	    
	- 判断是否要继续
	    
	- 给后续流程挂一些上下文信息
	
2. 在方法执行后处理返回结果
	比如：
	
	- 统一包装返回格式
	    
	- 修改响应数据
	    
	- 统计耗时
	    
	- 处理异常
	    
	- 做缓存

定义拦截器`responseInterceptor.ts`：

```ts
import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

interface Data<T> {
    data:T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler):Observable<Data<T>> {
        return next.handle().pipe(map(data => {
            return {
                data,
                status: 0,
                message: '嚯嚯嚯，夸脏哦'
            }
        }))
    }
}
```

然后需要在`main.ts`中进行注册：

```ts main.ts
// ...
import { ResponseInterceptor } from './responseInterceptor';

//... 
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  // ...
  
  // 使用拦截器
  app.useGlobalInterceptors(new ResponseInterceptor()) 
  
  //...(监听端口号啥的一系列操作)
}
bootstrap();
```

此时我们访问网站的时候，就会将data填入进去，返回这种标准的json格式：

![](../../assets/images/posts/LearnFastify-11.png)

也就是实现了统一包装结果这个拦截器，就不用再手写了

关于拦截前和拦截后，GPT给出了相关答复：

![](../../assets/images/posts/LearnFastify-12.png)

![](../../assets/images/posts/LearnFastify-13.png)

### 异常过滤器

默认情况下，这个功能由内置的**全局异常过滤器**实现，它能处理 `HttpException` 类型（及其子类）的异常。当遇到**无法识别**的异常（既不是 `HttpException` 也不是其继承类）时，内置异常过滤器会生成以下默认 JSON 响应：

```json
{ 
	"statusCode": 500, 
	"message": "Internal server error" 
}
```

具体的异常可以查看: [异常过滤器 - NestJS 中文文档](https://docs.nestjs.cn/overview/exception-filters#%E5%86%85%E7%BD%AE-http-%E5%BC%82%E5%B8%B8)

设置异常过滤器的话如下(Express version)：

```ts http-exception.filter.ts
import { ExceptionFilter, Catch, HttpException, ArgumentsHost } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    // 需要实现catch方法
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp() // 获取http上下文
        const response = ctx.getResponse<FastifyReply>() // 获取response对象
        const request = ctx.getRequest<FastifyRequest>() // 获取request对象
        const status = exception.getStatus() // 获取异常状态码
        
        // 发送异常响应
        response.status(status).send({
            // 这里可以根据需要自定义响应结构
            code: status, // 业务状态码，可以和HTTP状态码不同
            message: exception.message || 'An error occurred', // 错误信息
            statusCode: status, // HTTP状态码
            timestamp: new Date().toISOString(), // 错误发生的时间
            data: exception..getResponse(), // 错误详情
            path: request.url, // 请求路径,可以知道哪个接口发生了错误
        })
    }
}
```

然后在main.ts当中进行注册即可：

```ts main.ts
// ...
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter'; // 导入自定义的异常过滤器

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  // ...
  
  // 使用全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  
  // 启动服务器
  await app.listen(process.env.PORT ?? 3002, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3002}`);
  });
}
```
试一下访问不存在的页面：

![](../../assets/images/posts/LearnFastify-14.png)


### NestJs管道

 管道转换很简单，主要是两件事：
 1. 转换，可以将前端传入的数据转成成我们需要的数据
 2. 验证 类 似于前端的rules 配置验证规则

```ts
import { ParseIntPipe } from '@nestjs/common';
  @Get('test/:id')
  getTest(@Param('id', ParseIntPipe) id: number): void {
  
    // 解析以后就是整数类型
    console.log(typeof id);

  }
```

### 守卫

NestJs中守卫就相当于门禁，只有通过和不通过，下面是示例代码：

```ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'; 
import { Observable } from 'rxjs'; 
@Injectable() export class AuthGuard implements CanActivate { 
	canActivate( context: ExecutionContext, ): boolean | Promise<boolean> | Observable<boolean> { 
		const request = context.switchToHttp().getRequest(); 
		return true; // 表示通过
	 } 
}
```

主要是使用`CanActivate`这个接口，并且还要实现canActive这个方法，来表示通过和不通过

GPT给出的流程是这样的：

```
请求
  ↓
中间件
  ├─ 中间件直接结束响应 → 响应结束
  └─ 放行
      ↓
守卫
  ├─ 返回 false / 抛异常 → 异常过滤器/异常响应
  └─ 通过
      ↓
拦截器(前)
  ├─ 拦截器前置直接抛异常 → 异常过滤器/异常响应
  └─ 调用 next.handle()
      ↓
管道
  ├─ 参数转换/校验失败 → 异常过滤器/异常响应
  └─ 通过
      ↓
控制器方法
  ├─ 抛异常 → 可先被拦截器后置 catchError 处理，再进异常过滤器/异常响应
  └─ 正常返回
      ↓
拦截器(后)
  ├─ 加工返回值
  └─ 记录日志/耗时等
      ↓
响应
```

### 接口文档

这个主要是给前端查询

```bash
npm install --save @nestjs/swagger
npm i @fastify/swagger 
```

main.ts:

```ts main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 导入 Swagger 的 DocumentBuilder

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
    // 安装swagger
  const option = new DocumentBuilder().setTitle('HexCss\'s API').setDescription('HexCss API description').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, option); //  生成 Swagger 文档
  SwaggerModule.setup('/api-docs', app, document); // 设置 Swagger UI 的访问路径
  
   // 启动服务器
  await app.listen(process.env.PORT ?? 3002, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT ?? 3002}`);
  });
}

bootstrap();
```

访问http://localhost:3002/api-docs即可出现接口文档：

![](../../assets/images/posts/LearnFastify-15.png)

和springboot一样，可以分组自定义，比如我在`shopping-cart.controller.ts`中：

```ts shopping-cart.controller.ts
// ...
import { ApiTags } from '@nestjs/swagger';


@ApiTags('shopping-cart相关接口')
@Controller('shopping-cart')
// ...
```

![](../../assets/images/posts/LearnFastify-16.png)

对于方法，也有相关api:

```ts
// ...
import { ApiOperation } from '@nestjs/swagger';

// ...
@Post()
  @ApiOperation({ summary: '创建购物车' })
  create(@Body() createShoppingCartDto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(createShoppingCartDto);
  }
```

还可以加入description：

```
@ApiOperation({ summary: '创建购物车', description: '创建一个新的购物车' })
```

![](../../assets/images/posts/LearnFastify-17.png)

相关文档教程详见：[小满nestjs（第二十三章 nestjs swagger接口文档）_小满 nestjs-CSDN博客](https://xiaoman.blog.csdn.net/article/details/127181578)

### sql

```
npm i --save @nestjs/typeorm typeorm mysql2
```

然后在`app.module.ts`中进行配置：

```ts app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './demo/demo.module';
import { UserModule } from './user/user.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { UploadModule } from './upload/upload.module';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [DemoModule, UserModule, ShoppingCartModule, UploadModule, TypeOrmModule.forRoot(
    {
      type: "mysql", //数据库类型
      username: "root", //账号
      password: "123456", //密码
      host: "localhost", //host
      port: 3306, //
      database: "portal", //库名
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10,//重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    })],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
```

当然可以自动加载实体，比如此时配置`shopping-cart.entity.ts`:

```ts shopping-cart.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShoppingCart {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userId: number;

    @Column()
    email: string;
}
```

但是需要在`shopping-cart.module.ts`中注册：

```ts shopping-cart.module.ts
import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { UserModule } from '../user/user.module';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ShoppingCart])], // 导入 TypeOrmModule 并注册 ShoppingCart 实体
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})

export class ShoppingCartModule { }
```

此时刷新数据库可以发现：实体已经关联到了数据库的表：

![](../../assets/images/posts/LearnFastify-18.png)

对于实体，还应该更完善一些：

```ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Generated } from 'typeorm';

@Entity()
export class ShoppingCart {

    @PrimaryGeneratedColumn() // 主键，自动生成
    id: number;
    
    @Column({type: 'varchar', length: 255}) // 指定列类型为 varchar，长度为 255
    name: string;

    @Column({type: 'int'}) // 指定列类型为 int
    userId: number;

    @Column({type: 'varchar', length: 255}) // 指定列类型为 varchar，长度为 255
    email: string;

    @CreateDateColumn({ type: 'timestamp' }) // 自动设置创建时间，类型为 timestamp
    createdAt: Date;

    @Generated('uuid') //自动生成的 UUID 字段
    uuid: string;

    @Column('simple-array') // 使用 simple-array 类型来存储字符串数组
    items: string[];
}
```

#### 实现CURD

```ts 
import { Injectable } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShoppingCartService {
  constructor(@InjectRepository(ShoppingCart)private readonly shoppingCartRepository: Repository<ShoppingCart>) {} // 注入 ShoppingCart 实体的 Repository
  create(createShoppingCartDto: CreateShoppingCartDto) {
    // 创建一个新的购物车实例
    const data = new ShoppingCart();
    data.name = createShoppingCartDto.name;
    data.email = createShoppingCartDto.email;
    data.userId = createShoppingCartDto.userId;
    data.items = createShoppingCartDto.items;

    // 将数据保存到数据库
    return this.shoppingCartRepository.save(data);
  }
}
```

这样就实现了简单的CURD



