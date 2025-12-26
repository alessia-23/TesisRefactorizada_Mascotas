    import { Schema } from "mongoose";

    const PerfilCuidadorSchema = new Schema({
        bio: String,
        portada_url: String,
        tarifa_hora: Number,
        calificacion_promedio: {
            type: Number,
            default: 0
        },
        servicios_ofrecidos: [{
            type: String,
            ref: "Service"
        }],
        horario_disponible: {
            dias: [{
                type: String,
                enum: ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"]
            }],
            horas: String
        }
    }, { _id: false });

    export default PerfilCuidadorSchema;
