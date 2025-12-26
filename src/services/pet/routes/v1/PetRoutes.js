import { createPet, deletePet, getPetsByOwner, updatePet, updatePetPhoto } from "../../controller/PetController.js"
import { verificarTokenJWT } from "../../../../core/middleware/JWT.js"
import { Router } from "express"

const router = Router()

const url = "/v1/pet/"

// Rutas Privada
router.post(url + "create-pet/:owner", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO"]), createPet)
router.get(url + "get-pet/:ownerId", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO"]), getPetsByOwner)
router.post(url + "update-pet/:idMascota/:ownerId", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO"]), updatePet)
router.post(url + "update-img-pet/:idMascota/:ownerId", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO"]), updatePetPhoto)
router.delete(url + "delete-pet/:idMascota/:ownerId", verificarTokenJWT(["ADMINISTRADOR", "DUEÑO"]), deletePet)


export default router