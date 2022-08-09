const { MongoClient} = require('mongodb');
const uri = "mongodb+srv://milos:milos123@cluster0.dtzemef.mongodb.net/birthdaydb?retryWrites=true&w=majority";

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(uri)
      .then(client => {
        console.log('Connected!')
        _db = client.db();
        callback()
      })
      .catch(err => {
        console.log(err)
      });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;





