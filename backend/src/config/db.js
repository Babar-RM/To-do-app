import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp";
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error on ${uri}:`, error.message);
        // If primary failed, try local fallback
        if (uri !== "mongodb://127.0.0.1:27017/todoapp") {
            try {
                console.log("🔄 Attempting fallback connection to local MongoDB (127.0.0.1:27017)...");
                const fallbackConn = await mongoose.connect("mongodb://127.0.0.1:27017/todoapp", {
                    serverSelectionTimeoutMS: 3000,
                });
                console.log(`✅ MongoDB connected to fallback: ${fallbackConn.connection.host}`);
                return;
            } catch (fallbackErr) {
                console.error("❌ Fallback MongoDB connection also failed:", fallbackErr.message);
            }
        }
        console.warn("⚠️ Warning: Running without active MongoDB connection. Database operations may fail.");
    }
};

export default connectDB;