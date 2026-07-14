import express from 'express';
import routes from './routes/index.js';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(morgan('dev')); //use it for development, it will log all requests to the console
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);


export default app;