let modelKey = 'pet'

module.exports = {
    async find(ctx){
        let {query} = ctx.request;
        let dbModel = global.db.collections[modelKey];
        console.log('=====', query);
        let res = await dbModel.find(query);
        ctx.body = res;
    },
    async findOne(ctx){
        let {query} = ctx.request;
        let dbModel = global.db.collections[modelKey];
        let res = await dbModel.findOne(query);
        ctx.body = res;
    },
    async create(ctx){
        let {body} = ctx.request;
        let dbModel = global.db.collections[modelKey];
        let res = await dbModel.create(body).fetch();
        ctx.body = {
            code: 200,
            msg: `id=${res.id} created`
        }
    },
    async update(ctx){
        let {body} = ctx.request;
        let dbModel = global.db.collections[modelKey];
        let {q,s} = body;
        //查询条件
        q = JSON.parse(q);
        //更新值
        s = JSON.parse(s);
        console.log('======', q, s, typeof q, typeof s);

        let res = await dbModel.update(q).set(s).fetch();
        console.log('======', res);
        ctx.body = {
            code: 200,
            msg: `${res.length} items updated`
        }
    },
    async del(ctx){
        let {body} = ctx.request;
        let dbModel = global.db.collections[modelKey];

        let res = await dbModel.destroy(body).fetch();
        console.log('======', res);
        ctx.body = {
            code: 200,
            msg: `${res.length} items deleted`
        }
    },
    async delOne(ctx){
        let {body} = ctx.request;
        let dbModel = global.db.collections[modelKey];

        let res = await dbModel.destroyOne(body).fetch();
        console.log('======', res);
        ctx.body = {
            code: 200,
            msg: `item id=${res.id} deleted`
        }
    }
}