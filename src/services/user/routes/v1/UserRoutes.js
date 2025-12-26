import { createUser, getUsers, updateAvatar, updateInfoPersonal } from "../../controller/UserController.js"
import { verificarTokenJWT } from "../../../../core/middleware/JWT.js"
import { Router } from "express"

const router = Router()
const url = "/v1/user/"

router.get(url + "get-all", verificarTokenJWT(["ADMINISTRADOR"]), getUsers)
router.post(url + "create", verificarTokenJWT(["ADMINISTRADOR"]), createUser)
router.post(url + "avatar", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO", "CUIDADOR"]), updateAvatar);
router.patch(url + "update/info-personal", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO", "CUIDADOR"]), updateInfoPersonal);

export default router