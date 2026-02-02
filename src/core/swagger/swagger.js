// src/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Opciones de swagger-jsdoc
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mi API con Express",
            version: "1.0.0",
            description: "Documentación de la API usando Swagger",
        },
        servers: [
            {
                url: "http://localhost:3000", // Cambia el puerto si tu app usa otro
            },
        ],
    },
    apis: ["./services/**/*.js"], // rutas donde estarán tus endpoints documentados
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
