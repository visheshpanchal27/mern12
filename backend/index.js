import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import productsRouter from './routes/productRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import connectDB from './config/db.js';

// Setup path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env') });

const port = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Simple CORS setup
app.use(cors({
  origin: true,
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/users', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/products', productsRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/orders', orderRoutes);

// PayPal Config Route
app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// -----------------
// Serve Frontend
// -----------------
const frontendPath = path.join(__dirname, '/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
