import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js"

const veterinarioSchema = mongoose.Schema({  // Creamos el schema de una tabla, que seria la configuracion de como recibira los datos en cada columna
    // Al registrar datos con mongoose, este agrega por default los id
    nombre: {
        type: String,  // Tipo de dato que sera admitido en la columna
        required: true,  // Especificamos que es obligatorio registrar datos en esta columna
        trim: true  // Para eliminar los espacios que puedan tener los datos al inicio y al final
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Para que cada dato que se registre sea unico, o sea, que no hayan datos iguales
        trim: true
    },
    telefono: {
        type: String,
        default: null,  // Especificamos que no es obligatorio registrar datos en esta columna
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false  // Especificamos que el dato por default que se va a registrar sera false
    }
});

// Podemos realizar ciertas acciones antes o despues de realizar una consulta a una base de datos. Esto lo debemos crear antes de crear el modelo
veterinarioSchema.pre("save", async function(next) {  // Antes de guardar un registro, ejecutamos la funcion que le creamos en el segundo parametro. Usamos function y no arrow function cuando queramos usar this en la funcion
    //console.log(this);  // this en este contexto se refiere al objeto que se quiere guardar en la DB
    if(!this.isModified("password")) {  // El metodo isModified() de mongoose nos permite comprobar si la propiedad de un objeto esta modificado (modificado tambien contara si se esta guardando por primera vez la propiedad), y puede ser util para cuando hasheemos el password de un usuario, no se vuelva a hashear cuando le volvamos a hacer modificaciones al usuario que no sea el password
        next()  // next sirve para pasar al siguiente middleware
    }
    const salt = await bcrypt.genSalt(10);  // El metodo genSalt() del paquete bcrypt quiere decir a la serie de rondas que queremos hashear un password. Si le pasamos por parametros 10, es lo normal y un valor mas alto, consume mas recursos 
    this.password = await bcrypt.hash(this.password, salt);  // Con el metodo hash() hasheamos el password pasandole en el primer parametro el password, y en el segundo parametro la configuracion de la serie de rondas con el que queremos hashear  
});

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {  // Con methods podremos crearle a un modelo metodos (que son funciones) que solo con ese modelo podremos acceder. Estos metodos al llamarlos (que los debemos llamar con una referencia de su modelo) retornan una promesa, asi que, podemos usar async await
    return await bcrypt.compare(passwordFormulario, this.password)  // Con el metodo compare() de bcrypt podemos comparar un password que le pasamos en el primer parametro con otro password hasheado que le pasamos en el segundo parametro para comprobar si son iguales
}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);  // Registramos el schema como modelo pasandole en el primer parametro como se llamara el modelo, y en el segundo parametro el schema
export default Veterinario;