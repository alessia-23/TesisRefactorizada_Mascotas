import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import PerfilCuidadorSchema from "./PerfilCuidador.js";
import InfoPersonalSchema from "./InfoPersonal.js";

const UserSchema = new Schema({
    roles: [{ type: String, enum: ["DUEÑO", "CUIDADOR", "ADMINISTRADOR"], trim: true }],
    perfil_cuidador: { type: PerfilCuidadorSchema, default: null },
    email: { type: String, unique: true, required: true, trim: true },
    verificado: { type: Boolean, default: false },
    password: { type: String, required: true, trim: true },
    token: { type: String, default: null, trim: true },
    info_personal: InfoPersonalSchema
}, { timestamps: true });

/* 🔐 Hash automático antes de guardar */
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/* 🔎 Comparar contraseña */
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/* 🔑 Token seguro para verificación */
UserSchema.methods.createToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    this.token = token;
    return token;
};

export default model("User", UserSchema);
