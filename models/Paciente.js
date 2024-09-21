import mongoose from "mongoose";

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    sintomas: {
        type: String,
        required: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,  // Con mongoose.Schema.Types.ObjectId hacemos que se obtenga como tipo de valor el id de un registro
        ref: "Veterinario"  // Con ref indicamos el modelo con el que lo queremos relacionar
    }
}, {  // Objeto de configuracion al schema del modelo
    timestamps: true  // timestamps:true nos sirve para crear las columnas de actualizado y creado, en donde se almacenara automaticamente las fechas de cuando se cree un registro y de la ultima vez que fue actualizado
});

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;