import { sendMailToRegister, sendMailToRegisterOWner } from "../../../core/helpers/sendMail.js";
import { subirBase64Cloudinary } from "../../../core/helpers/cloudinary/uploadCloudinary.js"
import {generatePassword} from "../../../core/helpers/crypto/generatePassword.js"
import User from "../model/User.js";

export const createUser = async (req, res) => {
    const { email, roles, ...rest } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
        return res.status(400).json({ message: "El email ya existe" });
    }

    // 🔐 Generar contraseña automáticamente
    const generatedPassword = generatePassword();

    const user = new User({
        email,
        password: generatedPassword,
        roles,
        ...rest
    });

    const token = user.createToken();
    await user.save();

    // 📧 Enviar correo según rol
    if (roles?.includes("DUEÑO")) {
        await sendMailToRegisterOWner(
            email,
            generatedPassword, 
            rest?.info_personal?.nombre || "Usuario",
            token
        );
    } else {
        await sendMailToRegister(email, token);
    }

    res.status(201).json({
        message: "Usuario creado. Revisa tu correo para verificar la cuenta."
    });
};


export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateInfoPersonal = async (req, res) => {
    try {
        const { nombre, apellido, telefono, fecha_nacimiento, direccion_principal } = req.body;

        const user = await User.findById(req.usuario._id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (nombre) user.info_personal.nombre = nombre;
        if (apellido) user.info_personal.apellido = apellido;
        if (telefono) user.info_personal.telefono = telefono;
        if (fecha_nacimiento) user.info_personal.fecha_nacimiento = fecha_nacimiento;
        if (direccion_principal) user.info_personal.direccion_principal = direccion_principal;

        await user.save();

        res.status(200).json({ msg: "Información personal actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const { avatar_base64 } = req.body;

        if (!avatar_base64) {
            return res.status(400).json({ msg: "Debes enviar la imagen en Base64" });
        }

        // Subir a Cloudinary
        const urlAvatar = await subirBase64Cloudinary(avatar_base64, "Usuarios");

        // Actualizar usuario
        const user = await User.findById(req.usuario._id);
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        user.info_personal.avatar_url = urlAvatar;
        await user.save();

        res.status(200).json({ msg: "Avatar actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al subir el avatar" });
    }
};