const path = require('path');
const Koa = require('koa');
const router = require('./router');
const koaNunjucks = require('koa-nunjucks-2');
const app = new Koa();
const db = require('./common/db');
const static = require('koa-static');
const gzip = require('koa-gzip');
const koaBody = require('koa-body');
const config = require('../config');
const envCfg = config[config.env];

if(config.gzip){
   app.use(gzip());
}

//静态文件
app.use(static(envCfg.staticDirectory));
app.use(static(envCfg.uploadDirectory));

//模板
app.use(koaNunjucks(config.template));

//koa2 使用 koa-body 代替 koa-bodyparser 和 koa-multer
app.use(koaBody({
   multipart: true,
   formidable: {
       maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
   }
}));

app.use(router.routes())
   .use(router.allowedMethods());


app.listen(envCfg.port);

//数据库初始化
db.start((dbInstance) => {
   global.db = dbInstance;
});

console.log('app start at http://localhost:' + envCfg.port + '...');