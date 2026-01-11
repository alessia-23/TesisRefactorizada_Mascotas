import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: Number(process.env.PORT_MAILTRAP),
    secure: true,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    },
})

// Verificar conexión con Gmail
transporter.verify()
    .then(() => console.log("🟢 Gmail SMTP conectado correctamente"))
    .catch(err => console.error("🔴 Error SMTP Gmail:", err))

/**
 * Enviar correo
 */
const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"PetConnect" <${process.env.USER_MAILTRAP}>`,
            to,
            subject,
            html,
        })

        console.log("✅ Email enviado:", info.messageId)
        return info
    } catch (error) {
        console.log(error)
    }
}

export default sendMail
