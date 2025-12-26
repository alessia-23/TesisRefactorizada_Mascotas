import { sendMailChangePasswordConfirm, sendMailToRecoveryPassword } from "../../../core/helpers/sendMail.js";
import { crearTokenJWT } from "../../../core/middleware/JWT.js";
import User from "../../user/model/User.js";

export const confirmMail = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            return res.status(400).json({ msg: "Token no proporcionado" });
        }
        const user = await User.findOne({ token })
        if (!user) {
            return res.status(404).json({ msg: "Token inválido o expirado" });
        }
        if (user.verificado === true) {
            return res.status(400).json({ msg: "La cuenta ya fue confirmada anteriormente" });
        }
        user.token = null
        user.verificado = true
        user.status = true
        await user.save()
        return res.status(200).json({ msg: "Cuenta confirmada correctamente. Ya puedes iniciar sesión." });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
}

export const restorePassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = user.createToken()
        user.token = token
        await sendMailToRecoveryPassword(email, token)
        await user.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor` })
    }
}

export const checkTokenPassword = async (req, res) => {
    try {
        const { token } = req.params
        const user = await User.findOne({ token })
        if (user?.token !== token) {
            return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
        }
        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor` })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body
        const { token } = req.params
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Los passwords no coinciden" })
        }
        const user = await User.findOne({ token })
        if (!user) {
            return res.status(404).json({ msg: "No se puede validar la cuenta" })
        }
        user.password = password
        user.token = null
        await user.save()
        await sendMailChangePasswordConfirm(user.email)
        res.status(200).json({
            msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor" })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { passwordActual, passwordNuevo } = req.body;
        if (!passwordActual || !passwordNuevo) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el usuario ${id}` });
        }
        const verificarPassword = await user.matchPassword(passwordActual);
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" });
        }
        user.password = passwordNuevo;
        await user.save();
        res.status(200).json({ msg: "Password actualizado correctamente" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Debes llenar todos los campos" });

        const user = await User.findOne({ email }).select(" -__v -token -updatedAt -createdAt");
        if (!user) return res.status(404).json({ msg: "El usuario no se encuentra registrado" });
        if (!user.verificado) return res.status(403).json({ msg: "Debes verificar tu cuenta antes de iniciar sesión" });

        const verificarPassword = await user.matchPassword(password);
        if (!verificarPassword) return res.status(401).json({ msg: "El password no es correcto" });

        const token = crearTokenJWT(user.id, user.roles, user.email);

        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `Error en el servidor` });
    }
};
