import { Schema, model } from "mongoose";

import AppointmentDetailSchema from "./AppointmentDetail.js";
import AppointmentReportSchema from "./AppointmentReport.js";
import AppointmentSnapshotUser from "./AppointmentSnapshotUser.js";
import AppointmentSnapshotPet from "./AppointmentSnapshotPet.js";

const AppointmentSchema = new Schema(
    {
        estado: {
            type: String,
            enum: ["PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"],
            default: "PENDIENTE"
        },

        // 🔗 Referencias
        cuidador_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        cliente_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        mascota_id: {
            type: Schema.Types.ObjectId,
            ref: "Pet",
            required: true
        },

        // 📸 Snapshots
        cuidador: {
            type: AppointmentSnapshotUser,
            required: true
        },
        cliente: {
            type: AppointmentSnapshotUser,
            required: true
        },
        mascota: {
            type: AppointmentSnapshotPet,
            required: true
        },

        // 📅 Detalle y reporte
        detalle: {
            type: AppointmentDetailSchema,
            required: true
        },
        reporte_final: {
            type: AppointmentReportSchema,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default model("Appointment", AppointmentSchema);
