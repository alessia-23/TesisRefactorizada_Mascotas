import jwt from "jsonwebtoken";
import User from "../../services/user/model/User.js";

/**
 * Crear token JWT
 * @param {string} id - ID del usuario
 * @param {Array<string>} roles - Roles del usuario, ej: ['ADMINISTRADOR']
 * @param {string} email - Email del usuario
 * @returns {string} token - JWT
 */
const crearTokenJWT = (id, roles, email) => {
    return jwt.sign({ id, roles, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Middleware para verificar JWT y roles permitidos
 * @param {Array<string>} rolesPermitidos - Ej: ["ADMINISTRADOR", "DUEÑO"]
 */
const verificarTokenJWT = (rolesPermitidos = []) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization)
            return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" });

        try {
            const token = authorization.split(" ")[1];
            const { id, roles } = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(id).lean().select("-password");
            if (!user) return res.status(401).json({ msg: "Usuario no encontrado" });

            // roles en DB y JWT pueden ser múltiples
            const userRoles = Array.isArray(roles) ? roles : [roles];

            // Verificar que al menos uno de los roles permitidos coincida
            if (rolesPermitidos.length && !userRoles.some(r => rolesPermitidos.includes(r))) {
                return res.status(403).json({ msg: "Acceso denegado: rol no autorizado" });
            }

            req.usuario = user; // agregamos usuario al request
            next();

        } catch (error) {
            console.log(error);
            return res.status(401).json({ msg: "Token inválido o expirado" });
        }
    };
};

export { crearTokenJWT, verificarTokenJWT };
