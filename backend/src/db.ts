import mongoose, { model, Schema } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

// Connection caching for serverless environments
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const mongoUrl = process.env.MONGO_URL as string;
        if (!mongoUrl) {
            throw new Error('MONGO_URL environment variable is not defined');
        }

        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (e) {
        console.error("Failed to connect to MongoDB:", e);
        throw e;
    }
};

// Initialize connection
connectDB().catch(err => console.error('Initial DB connection failed:', err));

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    content: String,
    link: String,
    tags: [String],
    type: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
export { connectDB };