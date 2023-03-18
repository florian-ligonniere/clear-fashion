const {MongoClient} = require('mongodb');

const queries = async () => {
    const MONGODB_URI = 'mongodb+srv://florianligonniere:mongoDB_password1412@clearfashiondb.32kzdkb.mongodb.net/test?retryWrites=true&writeConcern=majority';
    const MONGODB_DB_NAME = 'clearFashiondb';

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');

    query_1 = await collection.find({brand : "loom"}).toArray();
    console.log("Query 1 : Products of one brand \n");
    console.log(query_1);
    
    query_2 = await collection.find({price : { $lte : 50}}).toArray();
    console.log("\nQuery 2 : All products less than a price  \n");
    console.log(query_2);

    query_3 = await collection.aggregate([{ $sort : { price : 1}}]).toArray();
    console.log("\nQuery 3 : All products sorted by price  \n");
    console.log(query_3);

    query_4 = await collection.aggregate([{ $sort : { released : 1}}]).toArray();
    console.log("\nQuery 4 : All products sorted by date  \n");
    console.log(query_4);

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    var timestamp = Date.parse(twoWeeksAgo);
    timestamp = new Date(timestamp).toISOString();

    query_5 = await collection.find({released : { $gte : timestamp}}).toArray();
    console.log("\nQuery 5 : All products scraped less than 2 weeks  \n");
    console.log(query_5);


    client.close();


}

queries();
