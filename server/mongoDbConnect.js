const {MongoClient} = require('mongodb');

const dbUpdate = async (products) => {
    const MONGODB_URI = 'mongodb+srv://florianligonniere:mongoDB_password1412@clearfashiondb.32kzdkb.mongodb.net/test?retryWrites=true&writeConcern=majority';
    const MONGODB_DB_NAME = 'clearFashiondb';

    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const collection = db.collection('products');
    const result = await collection.insertMany(products);
  
    console.log(result);
    await client.close();
}


const fs = require('fs');

// Read the JSON file
const json_string = fs.readFileSync('productsBrands.json', 'utf8', (err) => {
  if (err) {
    console.error(err);
    return;
  } 
});
products = JSON.parse(json_string);
dbUpdate(products);