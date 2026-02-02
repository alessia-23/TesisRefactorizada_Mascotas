import { createPaymentIntent } from "../../../core/stripe/stripe.js";
import Appointment from "../model/Appointment.js";
import User from "../../user/model/User.js";
import Pet from "../../pet/model/Pet.js";

export const crearAppointment = async (req, res) => {
    try {
        const usuario = req.usuario;
        const { cuidador_id, mascota_id, detalle } = req.body;

        const precio = detalle?.precio_acordado;

        if (!cuidador_id || !mascota_id || !detalle || !precio) {
            return res.status(400).json({ msg: "Datos incompletos" });
        }

        // Buscar cuidador
        const cuidador = await User.findById(cuidador_id).lean();
        if (!cuidador || !cuidador.roles.includes("CUIDADOR")) {
            return res.status(404).json({ msg: "Cuidador no válido" });
        }

        // Buscar mascota
        const mascota = await Pet.findById(mascota_id).lean();
        if (!mascota) {
            return res.status(404).json({ msg: "Mascota no encontrada" });
        }

        // Validar dueño
        if (mascota.owner_id.toString() !== usuario._id.toString()) {
            return res.status(403).json({ msg: "No eres dueño de esta mascota" });
        }

        // 💳 Stripe trabaja en centavos
        const paymentIntent = await createPaymentIntent(precio * 100);

        const appointment = new Appointment({
            cuidador_id,
            cliente_id: usuario._id,
            mascota_id,

            cuidador: {
                nombre: cuidador.info_personal?.nombre,
                foto: cuidador.info_personal?.avatar_url,
                telefono: cuidador.info_personal?.telefono,
                email: cuidador.email
            },

            cliente: {
                nombre: usuario.info_personal?.nombre,
                telefono: usuario.info_personal?.telefono,
                direccion_recogida: usuario.info_personal?.direccion_principal?.calle
            },

            mascota: {
                nombre: mascota.info_basica.nombre,
                raza: mascota.info_basica.raza,
                foto: mascota.info_basica.foto_principal
            },

            detalle,

            pago: {
                stripe_payment_intent_id: paymentIntent.id,
                amount: precio,
                currency: "usd",
                status: "pending"
            }
        });

        await appointment.save();

        res.status(201).json({
            msg: "Cita creada correctamente",
            appointment,
            client_secret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear la cita", error: error.message });
    }
};

/**
 * Listar citas
 * - Dueño: ve sus citas
 * - Cuidador: ve las que le asignaron
 * - Admin: ve todas
 */
export const listarAppointments = async (req, res) => {
    try {
        const usuario = req.usuario;

        let filtro = {};

        if (usuario.roles.includes("DUEÑO")) {
            filtro.cliente_id = usuario._id;
        }

        if (usuario.roles.includes("CUIDADOR")) {
            filtro.cuidador_id = usuario._id;
        }

        // ADMIN ve todo (sin filtro)

        const appointments = await Appointment.find(filtro)
            .sort({ createdAt: -1 });

        res.json(appointments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al listar citas" });
    }
};

/**
 * Eliminar cita
 * - Dueño: solo si es suya y está PENDIENTE
 * - Admin: siempre
 */
export const eliminarAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.usuario;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ msg: "Cita no encontrada" });
        }

        //  Reglas
        const esAdmin = usuario.roles.includes("ADMINISTRADOR");
        const esDueno = appointment.cliente_id.toString() === usuario._id.toString();

        if (!esAdmin) {
            if (!esDueno) {
                return res.status(403).json({ msg: "No autorizado" });
            }

            if (appointment.estado !== "PENDIENTE") {
                return res.status(400).json({ msg: "Solo se pueden eliminar citas pendientes" });
            }
        }

        await appointment.deleteOne();

        res.json({ msg: "Cita eliminada correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al eliminar la cita" });
    }
};
