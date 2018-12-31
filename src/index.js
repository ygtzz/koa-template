const path = require('path');
const Koa = require('koa');
const router = require('./router');
const koaNunjucks = require('koa-nunjucks-2');
const app = new Koa();

const static = require('koa-static');
const gzip = require('koa-gzip');
const config = require('../config');
const envCfg = config[config.env];

if(config.gzip){
   app.use(gzip());
}

//静态文件
app.use(static(envCfg.staticDirectory));

//模板
app.use(koaNunjucks(config.template));

app.use(router.routes())
   .use(router.allowedMethods());


app.listen(envCfg.port);

console.log('app start at port ' + envCfg.port + '...');