const sleep = async (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        },ms)
    })
}

module.exports = {
    login(ctx){
        ctx.body = {
            username: ctx.request.body.username
        }
    },
    async index(ctx){
        await ctx.render('user',{
            title: 'user template',
            name: '游客'
        });
    },
    async profile(ctx){
        // await sleep(1000);
        ctx.body = {
            usename: '相学长',
            sex: 'man',
            age: '999'
        }
    },
}
