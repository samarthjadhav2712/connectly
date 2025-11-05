import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js'
import chatRoutes from './routes/chatRoute.js'
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser"
import cors from "cors";
import path from 'path';

dotenv.config(); /// to read the file content . 
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true // allow frontend to send cookies 
}));

const _dirname = path.resolve();

app.use(express.json()); // to parse json data in req body .
app.use(cookieParser()); //to use jwt token in router .

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname , "../frontend/dist")));
    
    app.get("*" , (req,res)=>{
        res.sendFile(path.join(_dirname , "../frontend" , "dist" , "index.html"));
    });
}

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});