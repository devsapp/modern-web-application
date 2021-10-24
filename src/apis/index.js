const { http } = require('@serverless-devs/dk');

const { searchApp, getAppDetail, getSpecialDetail, getSpecialApp, getCategorys, getTags } = require('./services');

http
  .get("/appCenter/getSpecial", async (ctx) => {
    const data = await getSpecialApp(ctx);
    ctx.body = data;
  })
  .post("/appCenter/getSpecialDetail", async (ctx, next) => {
    const data = await getSpecialDetail(ctx);
    ctx.body = data;
  })
  .post("/appCenter/getAppDetail", async (ctx) => {
    const data = await getAppDetail(ctx);
    ctx.body = data;
  })
  .get("/appCenter/getCategory", async (ctx) => {
    const data = await getCategorys();
    ctx.body = data;
  })
  .get("/appCenter/getTags", async (ctx) => {
    const data = await getTags();
    ctx.body = data;
  })
  .post("/appCenter/getApps", async (ctx) => {
    const data = await searchApp(ctx);
    ctx.body = data;
  })
  .get("/", async (ctx, next) => {
    let result = "Hello ServerlessDevs";
    ctx.body = result;
  })

http.app.use(http.routes());

exports.handler = http();