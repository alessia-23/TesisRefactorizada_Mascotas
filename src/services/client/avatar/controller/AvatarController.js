import axios from "axios";

/**
 * Genera un avatar desde DiceBear y lo devuelve directamente
 * SIN guardar el archivo.
 */
export async function getAvatar(req, res) {
    try {
        const { style = "adventurer", seed = "alessia" } = req.body;

        const url = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;

        const response = await axios.get(url, { responseType: "text" });

        res.setHeader("Content-Type", "image/svg+xml");
        return res.status(200).send(response.data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error al generar avatar" });
    }
}


/**
 * YA NO SE GUARDAN AVATARES, así que esta función devuelve una lista vacía.
 */
export async function listAvatars(req, res) {
    return res.status(200).json({
        count: 0,
        avatars: []
    });
}


/**
 * Lista de estilos disponibles en DiceBear v9
 */
export async function listAvatarStyles(req, res) {
    try {
        const styles = [
            { name: "adventurer", description: "Personajes de aventura, estilo cartoon" },
            { name: "adventurer-neutral", description: "Versión neutral del estilo adventurer" },
            { name: "bottts", description: "Avatares tipo robots, estilo divertido" },
            { name: "big-ears", description: "Caras con orejas grandes, estilo simpático" },
            { name: "big-smile", description: "Caras sonrientes y expresivas" },
            { name: "croodles", description: "Estilo garabato dibujado a mano" },
            { name: "croodles-neutral", description: "Versión neutral de croodles" },
            { name: "fun-emoji", description: "Avatares tipo emoji divertidos" },
            { name: "icons", description: "Iconos minimalistas" },
            { name: "identicon", description: "Diseños geométricos basados en el seed" },
            { name: "initials", description: "Avatares con iniciales de texto" },
            { name: "micah", description: "Caras humanas modernas y suaves" },
            { name: "miniavs", description: "Caricaturas mini estilo flat" },
            { name: "notionists", description: "Estilo tipo Notion, profesional" },
            { name: "open-peeps", description: "Ilustraciones tipo dibujo humano" },
            { name: "pixel-art", description: "Avatares tipo pixel retro" },
            { name: "pixel-art-neutral", description: "Versión neutral de pixel-art" }
        ];

        res.status(200).json({ count: styles.length, styles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al listar estilos de avatar" });
    }
}


/**
 * Como ya NO hay archivos en el servidor, este endpoint solo informa error.
 */
export async function serveAvatar(req, res) {
    return res.status(404).json({
        msg: "Este servidor no almacena avatares. Genera uno con /getAvatar."
    });
}
