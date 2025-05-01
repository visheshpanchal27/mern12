// Core dependencies
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Route handlers
import userRouter from './routes/userRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import productsRouter from './routes/productRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Database connection
import connectDB from './config/db.js';

// Initialize environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

const port = process.env.PORT || 5000;

// Database connection
connectDB();

const app = express();

// Configure CORS for secure cross-origin requests
const allowedOrigins = [
  "https://mern12-1.onrender.com",  
  "http://localhost:5173"          
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,               
  exposedHeaders: ['Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Standard middleware stack
app.use(express.json());           
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// API endpoints
app.use('/api/users', userRouter);         
app.use('/api/category', categoryRouter);  
app.use('/api/products', productsRouter);  
app.use('/api/uploads', uploadRouter);     
app.use('/api/orders', orderRoutes);       

// PayPal configuration endpoint
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.get("/api/config/stripe", (req, res) => {
  res.send({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
