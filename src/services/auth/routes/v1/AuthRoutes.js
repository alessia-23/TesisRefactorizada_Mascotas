import { changePassword, checkTokenPassword, confirmMail, login, restorePassword, updatePassword } from "../../controller/AuthController.js"
import { verificarTokenJWT } from "../../../../core/middleware/JWT.js"
import { Router } from "express"

const router = Router()

const url = "/v1/auth/"

// Rutas Publicas
router.post(url + "login", login)
router.post(url + "confirm/:token", confirmMail)
router.post(url + "restore-password", restorePassword)
router.post(url + "change-password/:token", changePassword)
router.post(url + "restore-password/:token", checkTokenPassword)

// Rutas Privadas
router.post(url + "update-password/:id", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO", "CUIDADOR"]), updatePassword);

export default router