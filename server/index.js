// server.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth.Route.js';

const app = express();

app.use(express.json());

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
} catch (err) {
    console.error('MongoDB connection error:', err);
}

app.use("/api/auth", authRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));