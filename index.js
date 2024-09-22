import express from "express";
import dotenv from "dotenv";
import cors from "cors";  // npm i cors los cors nos sirve para proteger una api de un ente externo que quiera acceder
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";  // Si exportamos solo una cosa, al importarlo podremos llamarlo con otro nombre
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
app.use(express.json());  // Habilitamos el poder leer y enviar datos de tipo json usando req.body. Al habilitarlo en el archivo index.js, podremos enviar datos json desde cualquier archivo

dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];  // Es el dominio que se nos crea al ejecutar React. Se recomienda ocultar el dominio en una variable de entorno
const corsOptions = {
    origin: function(origin, callback) {  // El parametro origin representa el dominio en el que estemos actualmente
        if(!origin || dominiosPermitidos.indexOf(origin) !== -1) {  // Si se encuentra el dominio en los dominios que permitimos, permitimos el acceso a el
            // El Origen del Request esta permitido
            callback(null, true);  // null es que no hay error, y true es que permite el acceso
        } else {
            callback(new Error("No permitido por CORS"));
        }
    }
}

app.use(cors(corsOptions));  // Registramos cors con app.use()

app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});