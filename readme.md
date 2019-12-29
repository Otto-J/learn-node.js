# 缘起

已经拿到了《狼书 2：Node.js Web 应用开发》，在这里做一个读书笔记。

昨晚快速翻阅了一遍，觉得对内容比较满意，koa 从零到入门到源码实现原理、有 MongoDB 的入门到深入使用，还有 redis，还有 http 原理，node 开发历史发展历程，docker 和 egg.js 等等，大而全，内容足够新，足够了。

目测豆瓣评分会比第一卷有提升。

那就开始吧。

# 项目结构

有一个 `codes`文件夹，用来放 代码

默认你已经安装了 `editorconfig` 和 `prettier` 插件。

# Koa

## 了解 Koa

看我 `codes/1-1/` 文件夹

```shell
node app.js
```

为什么增加了 `ctx` 参数？
实现 koa 时候使用了 async 箭头函数，会把 this 指向箭头函数外部，而不是运行时对象。

koa2 源码导出的是 一个 class ，所以需要用 new 来实例化。

### koa 优点

- async 异步流程控制
- 异常容易处理，借用 async promise 都能捕获异常
- 洋葱模型，对响应进行拦截
- 小巧，核心代码少
- 生态完善
- 有 `egg.js` `MidwayJS` 企业级框架生态

## koa-generator

### 基础使用

看 1-2

```shell
npm i -g koa-generator
koa2 -h # 查看帮助
koa2 helloworld
cd helloworld
yarn
yarn start # port 3000
```

自动生成模板，根据模板继续编写代码

阅读这些文件：

- `bin/www`
- `public/*`
- `routes/*.js`
- `views/*`
- `app.js`

针对静态资源，模板中提供的做法是写入全局。作者后面提到，把 public 放入全局，每次都要判断是不是静态资源，影响 `QPS(queries-per-second)` 每秒查询率。

```js
app.use(require("koa-static")(__dirname + "/public"))
```

他建议结合路由，按需挂载

```js
router.get(
  "/public/*",
  async (ctx, next) => {
    ctx.url = path.basename(ctx.url)
    await next()
  },
  staticServer(resolve("./public"), { gzip: true })
)
```

在实际中， public 一般会放到 cdn 上

视图模板也有很多种：

- `ejs` 最常见容易理解
- `pug` jade 缩进式写法
- `nunjecks` 形式向 ejs，功能向 pub 强大

### 中间件

async 写法，观察下面写法：

```js
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`耗时 ${ms}ms`)
})
```

### 路由

`koa-router`

建立`routes/index.js`

```js
const router = require("koa-router")()
router.get("/", async (ctx, next) => {
  // do.
})

module.exports = router
```

app.js 里进行挂载

```js
const router = require("koa-router")()
const index = require("./router/index.js")

router.use("/", index.routes(), index.allowedMethods()a)
```

## web 框架发展演进

翻开历史的迷雾，发现 koa 的简洁之道。

## 测试

### 测试框架

这里推荐使用了 `ava` 测试框架。

中文介绍在此:

[AVA 中文文档](https://github.com/avajs/ava-docs/blob/master/zh_CN/readme.md)

```shell
npm i ava -D
```

看`1-3AVA`

```shell
npx ava a.test.js
ava -- --watch # 观察
ava -- --tap # 输出tap报告

```

如果是真正的 tdd 或 bdd，都是测试优先，先写测试，然后写功能代码。

### 接口测试

http 接口测试，使用 `superTest`

## 中间件

这一章内容包含 中间件 路由 视图 静态服务器

形式如下，拜 async 所赐，内容比较简单。

```js
app.use(async (ctx, next) => {
  await next()
})
```

### ctx

上下文对象

- ctx.request
- ctx.response

是 koa 内置的对象。

ctx.res ctx.req 是原生内置的对象。

# koa 练习

## 基础知识

`lib/request.js` 包含 30 个方法，很多。分类讲。

一个 url 包含很多结构

https://www.ijust.cc/tech/?v=23#path

在 koa 里，通过 ctx 上下文能够获取以下信息：

- ctx.href ctx.path ctx.url ctx.protocol ctx.hostname ctx.secure ctx.origin
- ctx.search ?开头的参数
- ctx.querystring 没有？的参数
- ctx.query 对象形式的参数

里面没有 port 没有 hash，咋办，还是通过 `parserurl` 模块进行处理。

要获取 请求头信息，可以通过

- ctx.header 或 ctx.headers 获取所有的头部信息
- ctx.get 获取特定的头部信息

缓存
浏览器如何处理换粗

- 通过 cache-control 判断是否有缓存。如果缓存已过期，看 etag
- 响应头中 etag 表示资源版本。发送请求头会 If-None-Match 的请求头字段。
