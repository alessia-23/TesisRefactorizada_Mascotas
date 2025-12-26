import { subirBase64Cloudinary } from "../../../core/helpers/cloudinary/uploadCloudinary.js";
import User from "../../user/model/User.js";
import Pet from "../model/Pet.js"

// Crear a la mascota
export const createPet = async (req, res) => {
    try {
        const { owner } = req.params
        const user = await User.findById(owner);
        if (user.roles != "DUEÑO") {
            return res.status(404).json({ message: "No puede crear una mascota con el rol: " + user.roles });
        }
        const pet = new Pet(req.body);
        pet.owner_id = owner
        const petSaved = await pet.save();

        res.status(201).json("Mascota creada con éxito");
    } catch (error) {
        res.status(400).json({
            message: "Error al crear la mascota",
            error: error.message
        });
    }
};

// Para listar a las mascotas
export const getPetsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;

        const pets = await Pet.find({ owner_id: ownerId }).select(" -__v -updatedAt -createdAt");

        res.json(pets);
    } catch (error) {
        res.status(500).json({
            message: "Error al listar las mascotas del dueño",
            error: error.message
        });
    }
};



export const updatePet = async (req, res) => {
    try {
        const { idMascota, ownerId } = req.params;
        const { owner_id, info_basica, ...rest } = req.body;
        let dataToUpdate = rest;

        if (info_basica) {
            const { foto_principal, ...infoBasicaSinFoto } = info_basica;
            dataToUpdate.info_basica = infoBasicaSinFoto;
        }

        const petUpdated = await Pet.findOneAndUpdate(
            { _id: idMascota, owner_id: ownerId },
            dataToUpdate,
            { new: true, runValidators: true }
        );

        if (!petUpdated) {
            return res.status(404).json({
                message: "Mascota no encontrada o no pertenece al dueño"
            });
        }

        res.json({ message: "Mascota actualizada con éxito" });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la mascota",
            error: error.message
        });
    }
};

// Subir la foto 
export const updatePetPhoto = async (req, res) => {
    try {
        const { idMascota, ownerId } = req.params;
        const { img } = req.body;

        if (!img) {
            return res.status(400).json({ msg: "Debes enviar la imagen en Base64" });
        }
        // subir imagen a Cloudinary
        const urlImg = await subirBase64Cloudinary(img, "Mascotas");

        // actualizar solo la foto
        const petUpdated = await Pet.findOneAndUpdate(
            { _id: idMascota, owner_id: ownerId },
            {
                "info_basica.foto_principal": urlImg
            },
            { new: true }
        );

        if (!petUpdated) {
            return res.status(404).json({
                message: "Mascota no encontrada o no pertenece al dueño"
            });
        }

        res.json({
            message: "Foto de la mascota actualizada con éxito"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la foto de la mascota",
            error: error.message
        });
    }
};

// Eliminar mascota
export const deletePet = async (req, res) => {
    try {
        const { idMascota, ownerId } = req.params;

        const petDeleted = await Pet.findOneAndDelete({
            _id: idMascota,
            owner_id: ownerId
        });

        if (!petDeleted) {
            return res.status(404).json({
                message: "Mascota no encontrada o no pertenece al dueño"
            });
        }

        res.json({
            message: "Mascota eliminada con éxito"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la mascota",
            error: error.message
        });
    }
};







