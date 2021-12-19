const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port=process.env.PORT||5000


// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxa3e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db('clockShop');
    const productsCollection = database.collection('products');

    // GET API
    app.get('/products', async(req,res)=>{  
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // GET SINGEL PRODUCT
    app.get('/products/:id', async (req, res) => { 
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.json(product);
  });


    //ORDER DELETE API
    app.delete('/orderProducts/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      res.json(result);
  })

    //POST API
    app.post('/products', async(req, res) =>{
      const newProducts = req.body;
      const result = await productsCollection.insertOne(newProducts);
      res.json(result);
    });


    // DELETE API
    app.delete('/products/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.json(result);
  })


 } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})