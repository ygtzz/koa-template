const PetService = require('../service/petService');

module.exports = {
    async find(ctx){
        let {query} = ctx.request;
        let res = await new PetService().find(query);
        ctx.body = res;
    },
    async findOne(ctx){
        let {query} = ctx.request;
        let res = await new PetService().findOne(query);
        ctx.body = res;
    },
    async create(ctx){
        let {body} = ctx.request;
        let res = await new PetService().create(body).fetch();
        ctx.body = {
            code: 200,
            msg: `id=${res.id} created`
        }
    },
    async update(ctx){
        let {body} = ctx.request;
        let {q,s} = body;
        //查询条件
        q = JSON.parse(q);
        //更新值
        s = JSON.parse(s);
        console.log('======', q, s, typeof q, typeof s);

        let res = await new PetService().update({
            query: q,
            set: s
        });
        console.log('======', res);
        ctx.body = {
            code: 200,
            msg: `${res.length} items updated`
        }
    },
    async del(ctx){
        let {body} = ctx.request;
        let res = await new PetService().del(body);
        ctx.body = {
            code: 200,
            msg: `${res.length} items deleted`
        }
    },
    async delOne(ctx){
        let {body} = ctx.request;
        let res = await new PetService().delOne(body);
        ctx.body = {
            code: 200,
            msg: `item id=${res.id} deleted`
        }
    }
}