import { Schema } from "mongoose";

export const DireccionSchema = new Schema({
    calle: String,
    ciudad: String
}, { _id: false });

const InfoPersonalSchema = new Schema({
    nombre: String,
    apellido: String,
    telefono: String,
    fecha_nacimiento: Date,
    avatar_url: String,
    direccion_principal: DireccionSchema
}, { _id: false });

export default InfoPersonalSchema;
