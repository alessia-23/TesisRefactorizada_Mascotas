import { crearAppointment, listarAppointments, eliminarAppointment } from "../../controller/AppointmentController.js";
import { verificarTokenJWT } from "../../../../core/middleware/JWT.js"
import { Router } from "express";

const router = Router();
const url = "/v1/appointment/";

//  Crear cita (solo DUEÑO)
router.post(url + "create", verificarTokenJWT(["DUEÑO"]), crearAppointment);
//  Listar citas (DUEÑO, CUIDADOR, ADMIN)
router.get(url + "data", verificarTokenJWT(["DUEÑO", "CUIDADOR", "ADMINISTRADOR"]), listarAppointments);
//  Eliminar cita
router.delete(url + ":id", verificarTokenJWT(["DUEÑO", "ADMINISTRADOR"]), eliminarAppointment);

export default router;
