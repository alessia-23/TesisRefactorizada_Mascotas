import cloudinary from 'cloudinary'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import UserRoutes from "./services/user/routes/v1/UserRoutes.js"
import AuthRoutes from "./services/auth/routes/v1/AuthRoutes.js"
import PetRoutes from "./services/pet/routes/v1/PetRoutes.js"
import CarerRoutes from "./services/carer/routes/v1/CarerRoutes.js"

// Inicializaciones
const app = express()
dotenv.config()

// Permitir bodies JSON más grandes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://petconnect-uio.netlify.app"
];


// Middlewares
app.use(express.json())
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

// Variables globales
app.set('port', process.env.PORT || 3000)


// Configuraciones
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
app.use("/api", UserRoutes);
app.get("/", (req, res) => { res.send("Server ON"); });

app.use("/api", AuthRoutes);
app.use("/api", PetRoutes)
app.use("/api", CarerRoutes)

export default app
