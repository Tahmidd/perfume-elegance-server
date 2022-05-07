const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjfcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('perfumeElegance').collection('product');
        const itemCollection = client.db('perfumeElegance').collection('item');

        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        // post
        app.post('/inventory', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        //DELETE
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });


        //item collect api
        //get
        app.get('/item', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        //item post
        app.post('/item', async (req, res) => {
            const item = req.body;
            const result = await itemCollection.insertOne(item);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running perfume server');
});

app.listen(port, () => {
    console.log('Perfume');
});