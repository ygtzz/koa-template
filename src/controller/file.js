const fs = require('fs');
const path = require('path');
const send = require('koa-send');
const archiver = require('archiver');

async function buildZip(base){
    const zipName = 'download.zip';
    const zipStream = fs.createWriteStream(zipName);
    const zip = archiver('zip');
    zip.pipe(zipStream);
    const zipBase = path.join(__dirname,'../..');
    // 打包文件方式
    const list = [
        {path: path.join(zipBase,'/src/controller/file.js'), name: 'file-download.js'},
    ];
    for (let i = 0; i < list.length; i++) {
        zip.append(fs.createReadStream(list[i].path), { name: list[i].name })
    }
    zip.directory('src/downloads/','');
   
    await zip.finalize();

    return zipName;
}

module.exports = {
    async download(ctx) {
        await ctx.render('download');
    },
    async build(ctx) {
        console.log('user build');

        let base = 'downloads';

        const zipName = await buildZip(base);

        ctx.attachment(zipName);

        await send(ctx, zipName);
    },
    async preview(ctx){
        await ctx.render('preview');
    },
    async upload(ctx){
        let file = ctx.request.files.file; // 获取上传文件
        //创建可读流
        const reader = fs.createReadStream(file['path']);
        let filePath = `upload` + `/${file['name']}`;
        let remotefilePath = `http://localhost:3100` + `/${file['name']}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        return ctx.body = {
            url: remotefilePath,
            message: "文件上传成功",
            cc: 0
        }   
    }
}

