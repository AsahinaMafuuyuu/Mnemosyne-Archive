---
layout: ../../layouts/MarkdownPostLayout.astro
title: 使用PicGo或者AList上传图片
pubDate: 2026-02-16T17:20:00
author: AsahinaMafuyu
description: 这篇博客主要用来介绍PicGo和AList的用处，笔者曾经很容易弄混淆这两种不同的东西
cover:
  url:
  alt:
tags: []
---
对于这两个软件的定位，首先Alist看起来更像服务器，用来管理CF等等对象存储的可视化等管理，方便统一管理，对于图床而言，**AList更是核心**，而PicGo更像是上传工具，它用来自动化将图片上传到图床服务器，而管理的话用AList管理，**PicGo主要是用于.md或者其他的应用**，通过上传本地图片，然后将图片的公网URL得到以后交给用户，再写入到.md当中去

|工具|角色|
|---|---|
|PicGo|上传入口|
|AList|浏览/管理界面|
## PicGo使用

其实也非常简单，我这里单纯的讲一下操作方法：
点开插件 -> 搜索s3 -> 下载即可：

![](../../assets/images/posts/PicGo%20Alist.png)

然后图床设置就多了一个Amazon s3，点开，然后新建（我这里之前已经建好了）：

![](../../assets/images/posts/PicGo%20Alist-1.png)

大致的填写方式可以这么填：

![](../../assets/images/posts/PicGo%20Alist-2.png)
(图片来源[Cloudflare R2 + PicGo 免费图床教程 - 资源荟萃 - LINUX DO](https://linux.do/t/topic/193442))

这里说一下CF配置的几个注意点：
1. 上传文件路径是基于你的存储桶的路径，比如我现在需要存放到`img-board`存储桶下的`astro-covers`文件夹下，那么就应该这么配置：
	![](../../assets/images/posts/PicGo%20Alist-3.png)
这里的{fileName}和{extName}是分开的，分别代表文件名和扩展名
2. 自定义输出URL模板最好填写你的存储桶的自定义域名加上资源路径：https://**{your-bucket-domain**}/astro-covers/**{fileName}**，分别解释一下bucket-domain:
	- 首先需要自定义你的bucket-domain:
		![](../../assets/images/posts/PicGo%20Alist-4.png)
		点击`添加`，然后添加自定义域名，然后这个自定义域名也就是 **{your-bucket-domain}** ，填入以后就代表着你的图片的根路径，再看你想存放到哪里（比如我这里想存放到的就是根路径下的astro-covers），然后再填入 **{fileName}** 即可（注：这里的 **{fileName}** 也就是文件的文件名+扩展名，不要以为单单只是文件名）
> 这样输出URL的好处就是：可以通过URL直接访问该图片路径，对应的就是公共网络上的URL

## 测试

将这个`kanade`上传一下：

![](../../assets/images/posts/PicGo%20Alist-5.png)

在相册中发现上传成功了

![](../../assets/images/posts/PicGo%20Alist-6.png)

按照我们的配置，它的路径应该是https://your-bucket-domain/astro/kanade%20(5).png也是对的且可以访问的，复制域名并访问，发现是没问题的：

![](../../assets/images/posts/PicGo%20Alist-7.png)

在存储桶中，我们的文件也应当是`kanade (5).png`：

![](../../assets/images/posts/PicGo%20Alist-8.png)

路径存放没有一点问题，且输出的URL也是可以访问的，就此，PicGo配置完毕。
