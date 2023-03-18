const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const queries = require('./queries.js');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', async (request, response) => {
  const limit = parseInt(request.query.limit);
  const brand = request.query.brand;
  const price = parseInt(request.query.price);

  const data = await queries.query_search(limit, brand, price);
  response.send(data);
});

app.get('/products/:id', async (request, response) => {
  const uuid_prod = request.params.id;
  const data = await queries.queryId(uuid_prod);
  response.send(data);
});


app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
