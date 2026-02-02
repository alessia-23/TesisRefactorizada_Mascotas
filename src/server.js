import express from 'express'
import http from "http";
import cors from 'cors'

import cloudinary from 'cloudinary'
import { Server } from "socket.io";
import { swaggerUi, specs } from './core/swagger/swagger.js';

import AppointmentRoutes from "./services/appointments/routes/v1/AppointmentRoutes.js"
import CarerRoutes from "./services/carer/routes/v1/CarerRoutes.js"
import UserRoutes from "./services/user/routes/v1/UserRoutes.js"
import AuthRoutes from "./services/auth/routes/v1/AuthRoutes.js"
import PetRoutes from "./services/pet/routes/v1/PetRoutes.js"

// Sockets
import { chatSocket } from './services/chat/sockets/ChatSocket.js'


// ===================== APP INIT =====================

const app = express()


// ===================== MIDDLEWARES =====================

// Permitir bodies JSON más grandes (imágenes, base64, etc.)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Orígenes permitidos (Frontend local y producción)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://petconnect-uio.netlify.app"
];

// JSON estándar + CORS
app.use(express.json())
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


// ===================== SOCKET.IO =====================

// Crear servidor HTTP a partir de Express
const server = http.createServer(app);

// Inicializar Socket.IO con CORS
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// Inicializar lógica del chat (eventos, salas, mensajes)
chatSocket(io);


// ===================== GLOBAL CONFIG =====================

// Puerto global de la aplicación
app.set('port', process.env.PORT || 3000);


// ===================== CLOUDINARY CONFIG =====================

// Configuración de Cloudinary para subida de imágenes
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// ===================== ROUTES =====================

// Rutas de la API
app.use("/api", UserRoutes);
app.use("/api", AuthRoutes);
app.use("/api", PetRoutes);
app.use("/api", CarerRoutes);
app.use("/api", AppointmentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// ===================== EXPORT =====================

// al final de server.js
export { app, server };
