import User from "../../user/model/User.js";

/**
 * Actualiza exclusivamente el perfil profesional del cuidador
 */
export const updateCarerProfile = async (req, res) => {
    try {
        const { bio, tarifa_hora, servicios_ofrecidos, horario_disponible } = req.body;

        // 1. Buscar al usuario por el ID del token (inyectado por el middleware verificarTokenJWT)
        const user = await User.findById(req.usuario._id);

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // 2. Validar que el usuario tenga el rol de CUIDADOR
        if (!user.roles.includes("CUIDADOR")) {
            return res.status(401).json({ msg: "Acceso denegado: No posees el rol de CUIDADOR" });
        }

        // 3. Inicializar el objeto si es null (según tu esquema el default es null)
        if (!user.perfil_cuidador) {
            user.perfil_cuidador = {};
        }

        // 4. Actualizar campos específicos del PerfilCuidadorSchema
        if (bio !== undefined) user.perfil_cuidador.bio = bio;
        if (tarifa_hora !== undefined) user.perfil_cuidador.tarifa_hora = tarifa_hora;
        if (servicios_ofrecidos !== undefined) user.perfil_cuidador.servicios_ofrecidos = servicios_ofrecidos;
        if (horario_disponible !== undefined) user.perfil_cuidador.horario_disponible = horario_disponible;

        // 5. Guardar cambios
        await user.save();

        res.status(200).json({
            msg: "Perfil de cuidador actualizado correctamente",
            perfil: user.perfil_cuidador
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al actualizar el perfil de cuidador" });
    }
};