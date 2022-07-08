const modelKey = 'pet';

class PetService{
    constructor() {
        this.db = global.db;
    }
    async find(params){
        let res = await this.db.collections[modelKey].find(params);
        return res;
    }
    async findOne(ctx){
        let res = await this.db.collections[modelKey].findOne(query);
        return res;
    }
    async create(ctx){
        let res = await this.db.collections[modelKey].create(body).fetch();
        return res;
    }
    async update({query,set}){
        let res = await this.db.collections[modelKey].update(query).set(set).fetch();
        return res;
    }
    async del(ctx){
        let res = await this.db.collections[modelKey].destroy(body).fetch();
        return res;
    }
    async delOne(ctx){
        let res = await this.db.collections[modelKey].destroyOne(body).fetch();
        return res;
    }
}

module.exports = PetService