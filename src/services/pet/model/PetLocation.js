import { Schema } from "mongoose";

const PetLocation = new Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitud, latitud]
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

export default PetLocation;
