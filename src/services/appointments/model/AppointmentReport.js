import { Schema } from "mongoose";

const AppointmentReportSchema = new Schema(
    {
        check_in: Date,
        check_out: Date,
        foto_evidencia: String,
        calificacion_cliente: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    { _id: false }
);

export default AppointmentReportSchema;
