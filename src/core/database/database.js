import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);

let isConnected = false;

const connection = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI_ATLAS);

        isConnected = db.connections[0].readyState === 1;
        console.log("✅ Base de datos conectada");
    } catch (error) {
        console.error("❌ Error MongoDB:", error.message);
        throw error;
    }
};

export default connection;
