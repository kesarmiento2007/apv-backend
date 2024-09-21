import jwt from "jsonwebtoken";

const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {  // Usamos el metodo sign() de JWT para enviar un json de manera codificada como si fuera un token, en el primer parametro pasamos el objeto que queremos enviar como json (preferiblemente no almacenar datos delicados como cuentas bancarias, etc), en el segundo parametro le pasamos una palabra secreta que usaremos cuando queramos verificar el token del json (la palabra secreta deberiamos hacerla privada guardandola en una variable .env), y en el tercer parametro le pasamos un objeto de configuracion.
        expiresIn: "30d",  // Tiempo de expiracion
    });
}

export default generarJWT;