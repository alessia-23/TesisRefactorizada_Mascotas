import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI_ATLAS);
    } catch (error) {
        console.log("Error al conectar la base de datos:", error);
    }
};

export default connection;
