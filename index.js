const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT||5000


//middleware

app.use(cors())

// const corsOptions = {
//   origin: 'http://localhost:5173/',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

// app.options('*',cors());

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//password - princerituraj20

//mongoDB configuration
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = process.env.MONGO_DB;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    //create collection of documents
    const bookCollections = client.db("BookInventory").collection("books");

    //insert book
    app.post("/upload-book",async(req,res) => {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.send(result);
    })

    // //get books from database
    // app.get("/all-books",async(req,res) => {
    //     const books = bookCollections.find();
    //     const result = await books.toArray();
    //     res.send(result);
    // })

    // update a book data
    app.patch("/book/:id",async(req,res) => {
        const id = req.params.id;
        const updateBookData = req.body;
        const filter = {"_id": `${new ObjectId(id)}`}
        const options = { upsert: true };
        
        const updateDoc = {
            $set: {
                ...updateBookData
            }
        }

        //update
        const result = await bookCollections.updateOne(filter,updateDoc,options);
        res.send(result);
    })

    // app.put("/book/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updateBookData = req.body;
    //   const filter = { "_id": new ObjectId(id) };
    //   const options = { upsert: true };
      
    //   const updateDoc = {
    //       $set: {
    //           ...updateBookData
    //       }
    //   };
  
      // Update
  //     const result = await bookCollections.updateOne(filter, updateDoc, options);
  //     res.send(result);
  // });







    //delete a book
    // app.delete("/book/:id",async(req,res) => {
    //     const id = req.params.id;
    //     const filter = {"_id" : `${new ObjectId(id)}`};
    //     const result = await bookCollections.deleteOne(filter);
    //     res.send(result);
    // })

    app.delete("/book/:id", async (req, res) => {
      try {
          const id = req.params.id;
          const filter = { "_id": `${new ObjectId(id)}` };
  
          const result = await bookCollections.deleteOne(filter);
  
          if (result.deletedCount === 1) {
              res.status(200).json({ message: "Book deleted successfully" });
          } else {
              res.status(404).json({ message: "Book not found" });
          }
      } catch (error) {
          console.error("Error deleting book:", error);
          res.status(500).json({ message: "An error occurred while deleting the book" });
      }
  });

    //filter books
    app.get("/all-books",async(req,res) => {
        let query = {};
        if(req.query?.category){
            query = {category: req.query.category}
        }
        const result = await bookCollections.find(query).toArray();
        res.send(result);
    })

    //to get single book data
    app.get("/book/:id",async(req,res) => {
        const id = req.params.id;
        const filter = {"_id" : `${new ObjectId(id)}`};
        const result = await bookCollections.findOne(filter);
        res.send(result);
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




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})