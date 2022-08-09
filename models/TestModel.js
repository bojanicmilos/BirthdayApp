const getDb = require('../mongo').getDb;
const mongoDb = require('mongodb')

class TestModel {
    constructor(firstName, lastName, id){
        this.firstName = firstName;
        this.lastName = lastName;
        this._id = id ? mongoDb.ObjectId(id) : null
    }

    save(){
        const db = getDb();
        return db.collection('TestModels').insertOne(this).then(()=> {console.log('Inserted')}).catch(error => console.log('Not Inserted'))
    }

    static getAll() {
        const db = getDb();

        return db.collection('TestModels')
                 .find()
                 .toArray().then(results => results).catch(error => console.log(error))
    }

    static getById(testModelId) {
        const db = getDb();

        return db.collection('TestModels')
                 .find({_id: new mongoDb.ObjectId(testModelId)})
                 .next()
                 .then(product => product)
                 .catch(error => console.log(error))
    }

    
}

module.exports = TestModel;