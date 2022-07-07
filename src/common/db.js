var Waterline = require('waterline');
var sailsDiskAdapter = require('sails-disk');
var waterline = new Waterline();


var userCollection = Waterline.Collection.extend({
    identity: 'user',
    datastore: 'default',
    primaryKey: 'id',

    attributes: {
        id: {
            type: 'number',
            autoMigrations: { autoIncrement: true }
        },
        firstName: { type: 'string' },
        lastName: { type: 'string' },

        // Add a reference to Pets
        pets: {
            collection: 'pet',
            via: 'owner'
        }
    }
});

var petCollection = Waterline.Collection.extend({
    identity: 'pet',
    datastore: 'default',
    primaryKey: 'id',
  
    attributes: {
        id: {
            type: 'number',
            autoMigrations: { autoIncrement: true }
        },
        breed: { type: 'string' },
        type: { type: 'string' },
        name: { type: 'string' },

        // Add a reference to User
        owner: {
            model: 'user'
        }
    }
});

waterline.registerModel(userCollection);
waterline.registerModel(petCollection);

var config = {
    adapters: {
        'disk': sailsDiskAdapter
    },
    datastores: {
        default: {
            adapter: 'disk'
        }
    }
};

function start(callback){
    waterline.initialize(config, (err, ontology) => {
        if (err) {
            console.error(err);
            return;
        }

        callback(ontology);

        // Tease out fully initialized models.
        var User = ontology.collections.user;
        var Pet = ontology.collections.pet;
    
        // Since we're using `await`, we'll scope our selves an async IIFE:
        (async () => {
            //delete all users and pets
            await User.destroy({id: {'!=': 100}});
            await Pet.destroy({id: {'!=': 100}});

            // First we create a user
            var user = await User.create({
                firstName: 'Neil',
                lastName: 'Armstrong'
            }).fetch();

            console.log('user: ', user)
    
            // Then we create the pet
            await Pet.create({
                breed: 'beagle',
                type: 'dog',
                name: 'Astro',
                owner: user.id
            });

            await Pet.create({
                breed: 'beagle1',
                type: 'cat',
                name: 'lili',
                owner: user.id
            });

    
            // Then we grab all users and their pets
            var users = await User.find().populate('pets');
            console.log(users);
            console.log('db initialized')
        })()
            .then(() => {
                // All done.
            })
            .catch((err) => {
                console.error(err);
            });//_∏_
    
    });
}

module.exports = {
    start
}