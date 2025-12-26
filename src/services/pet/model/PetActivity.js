import { Schema } from "mongoose";

const PetActivity = new Schema(
    {
        fecha: {
            type: Date,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
        duracion_min: {
            type: Number
        },
        calorias_quemadas: {
            type: Number
        },
        notas: {
            type: String
        }
    },
    { _id: false }
);

export default PetActivity;
