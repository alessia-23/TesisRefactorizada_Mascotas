import { Schema } from "mongoose";

const AppointmentSnapshotPet = new Schema(
    {
        nombre: String,
        raza: String,
        foto: String
    },
    { _id: false }
);

export default AppointmentSnapshotPet;
