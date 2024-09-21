import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;  // Con req.body podemos obtener datos de una api (que van como POST). A pesar de que estos datos vengan como json, los podremos usar como si fuera un objeto normal

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email}); // {email: email} // findOne() se trae un registro por sus atributos (que los especificamos en un objeto que le pasamos por parametros). find() Se trae todos los registros. findById se trae un registro por su id de registro.

    if(existeUsuario) {  // Puede ser recomendable mostrar los errores de esta manera, creando mensaje de error en una instancia de Error y mostrarlo en un json con res.status()
        const error = new Error("Usuario ya registrado");  // Creamos una instancia de la clase Error() y le pasamos un mensaje por parametros para el error
        return res.status(400).json({ msg: error.message })  // Retornamos a la vista con el status 400 (400 404 son comunes para errores) un json con el mensaje de error
    }

    try {
        // Guardar un nuevo Veterinario
        const veterinario = new Veterinario(req.body);  // Creamos una instalacia del modelo Veterinario para poderle hacerle consultas por medio de metodos, y le pasamos por parametros un objeto con el que le queremos hacer las consultas. DATO: las propiedades del objeto deben llamarse como las columnas que definimos en el modelo al que le queremos hacerle las consultas
        const veterinarioGuardado = await veterinario.save()  // El metodo save() sirve para guardar un objeto en la base de datos, o si ya hay un objeto en la base de datos y lo quieres modificar con uno que le vayas a pasar (mientras que tenga el id). Las consultas ya que retornan promesas, podemos usar async await

        // Enviar el email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);  // Enviamos en json los datos a la vista (los datos que le pasemos deben estar en objeto)
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;  // Extraemos de request la sesion de veterinario que creamos con los datos del usuario logueado

    res.json(veterinario);
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token});  // Obtenemos el usuario por su token, y es un objeto que se nos retorna de la informacion del usuario. Cuando hacemos una consulta como para obtener registros, se nos crea una instancia del modelo en la variable donde almacenamos la consulta, y ya con esa variable podremos hacer la consulta de save()

    if(!usuarioConfirmar) {
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        
        res.json({msg: "Usuario Confirmado Correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});  // En estos casos no usamos try catch para crear errores segun diferentes validaciones usando if. Y si no tuvieramos que validar, ahi si podriamos usar try catch

    if(!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmada");
        return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if( await usuario.comprobarPassword(password) ) {  // Usamos la variable usuario que tiene la referencia del modelo Veterinario para acceder a su metodo comprobarPassword. Los metodos de modelos retornan una promesa, asi que, podemos usar async await
        // Autenticar
        res.json({  // Si todo esta bien creamos un jwt del id del usuario que quiere iniciar sesion
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });

    } else {
        const error = new Error("El Password es incorrecto");
        return res.status(403).json({ msg: error.message });
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario) {
        const error = new Error("El Usuario no existe");
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
       console.log(error); 
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido) {
        // El Token es valido, el usuario existe
        res.json({ msg: "Token valido y el usuario existe" });
    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({ msg: error.message });
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;  // A pesar de ser este un controlador que se ejecuta por una ruta post, podemos acceder a los comodines de la URL
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    const { email } = req.body;
    if(veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail) {
            const error = new Error("Ese email ya esta en uso");
            return res.status(400).json({msg: error.message});
        }
    }
 
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;
        veterinario.email = req.body.email;

        const veterinarioActualizado = await veterinario.save();

        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    // Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if(!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)) {
        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        
        res.json({msg: "Password Almacenado Correctamente"});

    } else {
        const error = new Error("El Password Actual es Incorrecto");
        return res.status(400).json({msg: error.message});
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}