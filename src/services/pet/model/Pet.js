import { Schema, model } from "mongoose";
import PetBasicInfoSchema from "./PetInfoBasic.js";
import PetLocationSchema from "./PetLocation.js";
import PetActivitySchema from "./PetActivity.js";

const Pet = new Schema(
    {
        owner_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        info_basica: {
            type: PetBasicInfoSchema,
            required: true
        },
        status: { type: Boolean, default: true },
        localizacion_actual: {
            type: PetLocationSchema
        },

        diario_actividad: {
            type: [PetActivitySchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

// Índice geoespacial
Pet.index({ localizacion_actual: "2dsphere" });

export default model("Pet", Pet);
