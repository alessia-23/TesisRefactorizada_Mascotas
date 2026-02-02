import jwt from "jsonwebtoken";
import Appointment from "../../appointments/model/Appointment.js";
import { saveMessage, getMessagesByRoom } from "../services/MessageService.js";

export const chatSocket = (io) => {

    // ===================== SOCKET AUTH =====================
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error("Token requerido"));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // { id, roles, email, name }

            console.log(`✅ Auth Success: UserID=${decoded.id}, Roles=${decoded.roles}`);
            next();
        } catch (error) {
            console.log("❌ Auth Error:", error.message);
            next(new Error("Token inválido"));
        }
    });

    // ===================== CONNECTION =====================
    io.on("connection", (socket) => {
        console.log(`🟢 Usuario conectado: ${socket.user.id} (SocketID=${socket.id})`);

        // ===================== JOIN ROOM =====================
        socket.on("joinRoom", async (roomId) => {
            try {
                const appointment = await Appointment.findById(roomId).lean();
                if (!appointment) return socket.emit("joinRoomError", "La conversación no existe");

                // Comparación segura de ObjectId y string
                const userId = socket.user.id;
                const clienteId = appointment.cliente_id?.toString();
                const cuidadorId = appointment.cuidador_id?.toString();

                console.log("🔍 Comparando IDs:", { userId, clienteId, cuidadorId });

                const autorizado = clienteId === userId || cuidadorId === userId;
                if (!autorizado) {
                    console.log(`🚫 Acceso Denegado: user=${userId}`);
                    return socket.emit("joinRoomError", "No autorizado a esta conversación");
                }

                // Unirse a la sala
                socket.join(roomId);
                console.log(`📥 Usuario ${userId} unido a sala ${roomId}`);

                const messages = await getMessagesByRoom(roomId);

                const normalizedMessages = messages.map(m => {
                    const msgObj = m.toObject ? m.toObject() : m; // Convierte Mongoose doc a objeto
                    return {
                        ...msgObj,
                        sender: typeof msgObj.sender === "object"
                            ? { id: msgObj.sender._id || msgObj.sender.id, name: msgObj.sender.name || msgObj.sender.email }
                            : { id: msgObj.sender, name: msgObj.sender }
                    };
                });

                socket.emit("previousMessages", normalizedMessages);

            } catch (error) {
                console.error("❌ Error joinRoom:", error);
                socket.emit("joinRoomError", "Error al unirse a la sala");
            }
        });

        // ===================== SEND MESSAGE =====================
        socket.on("sendMessage", async ({ room, message }) => {
            if (!message || !message.trim()) return;

            try {
                const userId = socket.user.id;
                const newMessage = await saveMessage({
                    room,
                    message,
                    sender: userId
                });

                // Convertir el documento de Mongoose a objeto plano para manipularlo
                const msgToEmit = newMessage.toObject ? newMessage.toObject() : newMessage;

                const normalizedMessage = {
                    ...msgToEmit,
                    message: msgToEmit.message,
                    // Usamos la info del socket.user que ya validamos en el middleware
                    sender: {
                        id: userId,
                        name: socket.user.name || socket.user.email
                    }
                };

                io.to(room).emit("newMessage", normalizedMessage);
            } catch (error) {
                console.error("❌ Error sendMessage:", error);
                socket.emit("sendMessageError", "No se pudo enviar el mensaje");
            }
        });

        // ===================== DISCONNECT =====================
        socket.on("disconnect", (reason) => {
            console.log(`🔴 Usuario desconectado: ${socket.user.id} (SocketID=${socket.id}) Reason=${reason}`);
        });
    });
};
