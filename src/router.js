const Router = require('koa-router');
const router = new Router();
const path = require('path');
const fs = require('fs');

const routeMap = {
    '/': {
        redirect: '/user/profile'
    },
    '/user/login':{
        method: 'post'
    },
    '/file/upload':{
        method: 'post'
    }
}

const postKeys = ['create','update','del','delOne'];

// 注册项中有配置redirect，先注册跳转路由
Object.keys(routeMap).forEach(function(item){
    const routeItem = routeMap[item];
    if(routeItem.redirect){
        console.log('route ',item,routeItem.redirect);
        router.redirect(item,routeItem.redirect);
    }
});

// controller方法默认注册为get请求
// routeMap声明的注册为post等其他类型请求
const files = fWalk(path.join(__dirname,'./controller'));
files.forEach(function(item){
    item = path.basename(item);
    const ext = path.extname(item);
    const fileName = item.replace(new RegExp(ext+'$'),'');
    const controller = require('./controller/' + item);
    //默认使用controller的文件名，作为路由的中段
    Object.keys(controller).forEach(function(method){
        const key = '/' + fileName + '/' + method;
        const routeItem = routeMap[key];
        //配置项中有对应的项，则添加配置项中对应的方法
        if(routeItem){
            if(routeItem.method){
                router[routeItem.method](key, controller[method]);
            }
        }
        else if(postKeys.includes(method)){
            router.post(key, controller[method]);
        }
        //配置项中没有，则默认注册为get方法，此处有缺陷，不能在方法上指明是那种类型的方法，需要装饰器写法支持
        else{
            router.get(key, controller[method]);
            //index的action同时注册为短路由，例如: /user/index, /user 为同一个地址
            if(method == 'index'){
                router.get(`/${fileName}`, controller[method]);
            }
        }
    });
});


function fWalk(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}

module.exports = router;