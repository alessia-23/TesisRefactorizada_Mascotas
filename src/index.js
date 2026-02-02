import { app, server } from "./server.js";
import connection from "./core/database/database.js";

(async () => {
    try {
        await connection();
        server.listen(app.get("port"), () => {
            console.log(
                `Api de PetConect levantada y ejecutandose en: http://localhost:${app.get("port")}`
            );
        });
    } catch (error) {
        console.error("❌ Error al iniciar servidor:", error);
        process.exit(1);
    }
})();
