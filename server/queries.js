const {MongoClient} = require('mongodb');

const connection = async() => {
    const MONGODB_URI = 'mongodb+srv://florianligonniere:mongoDB_password1412@clearfashiondb.32kzdkb.mongodb.net/test?retryWrites=true&writeConcern=majority';
    const MONGODB_DB_NAME = 'clearFashiondb';

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    return collection;
}

module.exports.queryId = async(id_prod) =>{
    const collection = await connection();
    const response = await collection.find({uuid : id_prod}).toArray();
    return response;
}

module.exports.query_search = async(limit, brand, price) =>{
    const collection = await connection();
    const query = {};
    if (brand) {
    query.brand = brand;
    }
    if (price) {
    query.price = { $lte: price };
    }
    if (limit) {
        const response = await collection.find(query).sort({ price : 1}).limit(limit).toArray();
        return response;
    }
    else {
        const response = await collection.find(query).sort({ price : 1}).toArray();
        return response;
    }
}






