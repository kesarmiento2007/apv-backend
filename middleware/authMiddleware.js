import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {  // Podemos agregar un next despues de agregar el request y response
    // Verificamos si se envio un token en la cabezera y empieza con Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {  // req.headers retorna un objeto sobre el token enviado a la cabezera, y la propiedad authorization es el token enviado.
        try {
            const token = req.headers.authorization.split(" ")[1];  // Obtenemos el token sin el "Bearer"
            
            const decored = jwt.verify(token, process.env.JWT_SECRET);  // El metodo verify() de jwt sirve para verificar lo que trae el token de un json (es decir, obtenemos su json). En el primer parametro le pasamos el token que se quiere verificar, y en el segundo parametro le pasamos la palabra secreta que le dimos al json que enviamos como token

            // Con request.veterinario estamos creando una sesion (que se llamara en este caso veterinario) con la informacion del veterinario. Al crear una sesion con request, podremos acceder a el desde otro archivo del backend
            req.veterinario = await Veterinario.findById(decored.id).select(  // Obtenemos un veterinario por su id, y con el metodo select() podemos indicar del objeto de resultado especificamente las propiedades que se quieren obtener, o descartar (agregamos un - al inicio de la propiedad que queramos descartar)
                "-password -token -confirmado"  // Preferiblemente descartamos el password al ser un dato importante para iniciar session
            );

            return next();
        } catch (error) {
            const e = new Error("Token no valido");
            return res.status(403).json({msg: e.message});
        }
    }
}

export default checkAuth;