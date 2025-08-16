import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const mongoUrl= process.env.MONGODB_URI || 'mongodb://127.0.0.1:27011/dbZelij?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2';
const port = process.env.PORT || 3000;

const ConnectDb= async ()=>{
    await mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: 'dbZelij'
    }) 
    .then(() => {
        console.log('MongoDB is connected  successfully ');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
}
const StartServer = () => { 
    try{
        ConnectDb();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }catch(err){
        console.error('Error starting server:', err);
    }
}

app.get('/', (req, res) => {
    res.status(200).send('Hello from the backend!');
});
    StartServer();
