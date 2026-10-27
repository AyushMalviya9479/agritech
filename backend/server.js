import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { logger, notFound, errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import farmRoutes from './routes/farms.js';
import cropRoutes from './routes/crops.js';
import weatherRoutes from './routes/weather.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
connectDB();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => res.send('AgriTech API is running...'));
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
