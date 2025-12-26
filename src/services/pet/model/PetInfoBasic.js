import { Schema } from "mongoose";

const PetInfoBasica = new Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        tipo: {
            type: String,
            required: true
        },
        raza: {
            type: String
        },
        genero: {
            type: String,
            enum: ["M", "H"]
        },
        tamano: {
            type: String,
            enum: ["Pequeño", "Mediano", "Grande"]
        },
        color: {
            type: String
        },
        fecha_nacimiento: {
            type: Date
        },
        foto_principal: {
            type: String
        },
        descripcion: {
            type: String
        }
    },
    { _id: false }
);

export default PetInfoBasica;
