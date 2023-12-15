import 'express-async-errors';
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';


//routers
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

//public folder path 
import {dirname} from 'path';
import { fileURLToPath } from 'url';
import path from 'path';



//middlewares import
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

//Cloudinary API setup
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

//invoke the express package
const app= express();

//public folder path
const __dirname=dirname(fileURLToPath(import.meta.url));

//invoke the middlewares
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.static(path.resolve(__dirname,'./client/dist')));
app.use(express.json());
app.use(cookieParser());//catching the cookies sent by client and parse it in req.cookies


//routes
app.get('/', (req,res)=>{
    res.send('Hello World')
});

app.get('/api/v1/test',(req,res)=>{
    res.json({msg:'test route'});
})

app.use('/api/v1/jobs',authenticateUser, jobRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users',authenticateUser,userRouter);
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./client/dist','index.html'));
});
app.use('*', (req,res)=>{
    res.status(404).json({msg:'not found'})
});

//error handling middleware
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5100;
try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port,()=>{
        console.log(`Server is running on PORT ${port}`);
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}
