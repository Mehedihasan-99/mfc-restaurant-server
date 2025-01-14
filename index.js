require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const reviewCollection = database.collection('reviews');
        const cartCollection = database.collection('carts');
        const userCollection = database.collection('users');


        // user related api 
        app.post("/users", async(req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // get all menus 
        app.get("/menus", async (req, res) => {
            const cursor = menuCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get menu item filter by category 
        app.get("/menus/:category", async (req, res) => {
            const category = req.params.category;
            const query = { category: category }
            const result = await menuCollection.find(query).toArray()
            res.send(result)
        })

        // get all reviews 
        app.get("/reviews", async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // cartCollection 
        // Post cart item 
        app.post("/carts", async (req, res) => {
            const cartItem = req.body;
            const result = await cartCollection.insertOne(cartItem);
            res.send(result);
        })

        // get cart item by email
        app.get("/carts", async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        });

        app.delete("/carts/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id : new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
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