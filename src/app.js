import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
    
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());
app.use(morgan('dev')); //use it for development, it will log all requests to the console
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);


export default app;