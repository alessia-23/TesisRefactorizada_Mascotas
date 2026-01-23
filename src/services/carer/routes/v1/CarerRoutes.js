import { updateCarerProfile } from "../../../carer/controller/CarerController.js";
import { verificarTokenJWT } from "../../../../core/middleware/JWT.js"
import { Router } from "express"

const router = Router()

const url = "/v1/carer/"
// Ruta para actualizar el perfil profesional del cuidador
router.patch(url + "update/perfil-cuidador", verificarTokenJWT(["CUIDADOR"]), updateCarerProfile);

export default router