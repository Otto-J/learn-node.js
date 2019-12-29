import test from "ava"
import supertest from "supertest"
const Koa = require("koa")
// const app = new Koa()

// const app = koa.cal

test("get 测试", t => {
  supertest(app)
    .get("http://api.wangxiao.cn/zhuanti/new.aspx")
    .expect(200, (err, res) => {
      t.ifError(err)
      let d = res.data.listActivity
      t.is(d.length, 4)
    })
})
// test("foo", t => {
//   t.pass()
// })

// test("bar", async t => {
//   const b = Promise.resolve("bar")
//   t.is(await b, "bar")
// })
