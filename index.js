require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zs4np.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db('mfcRestaurantDB');
        const menuCollection = database.collection('menu');
        const reviewCollection = database.collection('reviews')

        // get all menus 
        app.get("/menus", async(req, res) => {
            const cursor = menuCollection.find();
            console.log(cursor)
            const result = await cursor.toArray();
            console.log(result)
            res.send(result)
        })

        // get all reviews 
        app.get("/reviews", async(req, res) => {
            const cursor = reviewCollection.find();
            console.log(cursor)
            const result = await cursor.toArray();
            console.log(result)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("MFC Restaurant Server is running")
});

app.listen(port, () => {
    console.log(`MFC Restaurant Server is running Port is : ${port}`)
})