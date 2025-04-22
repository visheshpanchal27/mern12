import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors'; // 👈 import cors

import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import productsRouter from './routes/productRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import connectDB from './config/db.js';

// FIX: properly load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// ADD THIS: enable CORS
app.use(cors({
    origin: "http://localhost:5173", // allow frontend dev server
    credentials: true, // allow cookies if you are using authentication
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/products', productsRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/orders', orderRoutes);

app.get("/api/config/paypal", (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
