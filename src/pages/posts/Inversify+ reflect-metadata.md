---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Inversify+ reflect-metadata插件学习'
pubDate: 2026.01.31
description: '通过对Inversify+ reflect-metadata的深入理解更能了解语法概念'
author: 'Astro 学习者'
image:
tags: ["NodeJs", "前端", "插件"]
---
> **注: 要使用此库，请确保在 tsconfig.json 中启用 Experimental decorators 和 Emit Decorator Metadata 选项**。

```typescript
import { Container, inject, injectable } from 'inversify';

@injectable()
class Katana {
  public readonly damage: number = 10;
}

@injectable()
class Ninja {
  constructor(
    @inject(Katana)
    public readonly katana: Katana,
  ) {}
}

const container: Container = new Container();

container.bind(Ninja).toSelf();
container.bind(Katana).toSelf();

const ninja: Ninja = container.get(Ninja);

console.log(ninja.katana.damage);
```
@injectable 装饰器允许将 Katana 和 Ninja 类用作容器绑定。 @inject 装饰器提供有关 Ninja 依赖项的元数据，以便容器知道应该将 Katana 对象作为 Ninja 构造函数的第一个参数提供。