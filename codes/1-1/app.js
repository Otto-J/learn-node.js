const Koa = require("koa")
const app = new Koa()

app.use(async (ctx, next) => {
  const start = new Date()
  console.log(`日志开始记录`)
  await next()
  console.log(`日志记录结束`)
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async ctx => {
  console.log(`do sth..`)
  ctx.body = "hello."
})

app.listen(3000, () => {
  console.log("port start.")
})
