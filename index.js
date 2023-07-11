import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { graphqlHTTP } from 'express-graphql'; 
import schema from './graphQL/schema.js';
import auth from './routes/authRoutes.js';
import verify from './routes/verifyRoutes.js';
import authMW from './middleware/authMW.js';
import images from './routes/imageRoutes.js';

const __dirname = path.resolve(path.dirname(''));

dotenv.config({ path: path.resolve(__dirname, "./config/config.env") });

const app = express(); 

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI); 
const db = mongoose.connection;
db.on('error', (error) => {
    console.log("Connection error " + error);
});

db.once('open', () => {
    console.log("Connection Successful");
});

app.use(express.json());
app.use(cors({
    origin: "*",
}));

app.use("/auth", auth);  

app.use("/images", images); 

app.use(authMW); 

app.use("/verify", verify);

app.use("/graphql", graphqlHTTP((req) => ({
    schema,
    graphiql: true, 
    context: req.body
}))); 

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});  
