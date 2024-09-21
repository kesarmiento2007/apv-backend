import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;  // Cuando le tengamos que pasar el id de un registro a una columna que recibe valores de tipo ObjectId, ese id ir como objetoId y no como string, para eso accedemos al id del registro con ._id y no .id
    
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario._id);  // Con el metodo where podemos hacer filtros cuando hagamos consultas de obtencion de datos, en el que en where() seleccionamos una columa y luego con el metodo equals() colocamos el valor de a que tiene que ser igual el valor de la columna de esos registros que queremos filtrar. En esta consulta estamos obteniendo todos los registros en los que el valor de la columna de "veterinario" (donde se guardan id) sea igual al id de la sesion creada de veterinario.

    res.json(pacientes);
}

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: "No Encontrado"});
    }

    if(paciente.veterinario.toString() !== req.veterinario._id.toString()) {  // Convertimos ambos valores en string para que puedan ser iguales
        return res.json({msg: "Accion no valida"});
    }

    res.json(paciente);
}

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: "No Encontrado"});
    }

    if(paciente.veterinario.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: "Accion no valida"});
    }

    // Actualizar Paciente
    paciente.nombre = req.body.nombre || paciente.nombre;  // Agrega el valor de nombre del formulario si la hay, y si no, agrega el valor de nombre almacenada en la BD
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
}

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: "No Encontrado"});
    }

    if(paciente.veterinario.toString() !== req.veterinario._id.toString()) {  // Convertimos ambos valores en string para que puedan ser iguales
        return res.json({msg: "Accion no valida"});
    }

    try {
        await paciente.deleteOne();  // El metodo deleteOne() sirve para eliminar un registro de la base de datos
        res.json({msg: "Paciente Eliminado"});
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}