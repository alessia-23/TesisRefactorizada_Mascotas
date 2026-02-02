import { Schema } from "mongoose";

const AppointmentDetailSchema = new Schema(
    {
        fecha_inicio: {
            type: Date,
            required: true
        },
        fecha_fin: {
            type: Date,
            required: true
        },
        tipo_servicio: {
            type: String,
            required: true
        },
        precio_acordado: {
            type: Number,
            required: true
        },
        notas_cliente: {
            type: String
        }
    },
    { _id: false }
);

export default AppointmentDetailSchema;
