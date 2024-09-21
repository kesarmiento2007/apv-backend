import express from "express";
const router = express.Router();
import { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

// Rutas publicas
router.post("/", registrar);  // La URL raiz (o inicio) seria la URL que registramos con use() para agregar el router. En este caso es /api/veterinarios
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);

//router.get("/olvide-password/:token", comprobarToken);
//router.post("/olvide-password/:token", nuevoPassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);  // Cuanto queramos crear un metodo get() y post() en la misma ruta, podemos simplificar el codigo de esta manera usar el metodo route()

//Rutas privadas
router.get("/perfil", checkAuth, perfil);  // Cuando vayamos a la URL indicada, se ejecutara la primera funcion que verificara si iniciamos sesion, y luego por medio de un next() dentro de esa funcion se ejecutara la siguiente funcion (siguiente middleware). De esta manera podremos proteger rutas que solo se podran acceder si iniciamos sesion. Podemos crear un router para verificar por medio de un middleware de auth si el usuario genero un jwt de su id para poder crear una sesion de ese usuario y posteriormente en un controlador solo enviar el objeto del usuario al frontend con res.json() para almacenarlo en un state global y validar las rutas privadas  
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

export default router;