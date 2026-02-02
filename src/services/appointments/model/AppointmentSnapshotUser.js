import { Schema } from "mongoose";

const AppointmentSnapshotUser = new Schema(
    {
        nombre: String,
        foto: String,
        telefono: String,
        email: String,
        direccion_recogida: String // solo el dueño tiene dirección de recogida
    },
    { _id: false }
);

export default AppointmentSnapshotUser;
