
import { crearTokenJWT } from "../../../../core/middleware/JWT.js";
import { OAuth2Client } from "google-auth-library";
import User from "../../../user/model/User.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export const loginWithGoogle = async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: "No se envió el token" });

    try {
        //  Verifica el token con Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload(); // contiene email, name, picture, etc.

        // Buscar usuario en tu DB por email
        const user = await User.findOne({ email: payload.email }).select(" -__v -token -updatedAt -createdAt");

        if (!user) {
            res.status(400).json({ error: "Usuario no registrado" });
            return;
        }

        // Crear JWT propio
        const jwtToken = crearTokenJWT(user._id, user.roles, user.email);

        // Responder con info del usuario + token propio
        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles,
                nombre: user.info_personal?.nombre,
                avatar: user.info_personal?.avatar?.user_picture_url || null
            },
            token: jwtToken
        });

    } catch (error) {
        res.status(400).json({ error: "Token de Google inválido" });
    }
};
