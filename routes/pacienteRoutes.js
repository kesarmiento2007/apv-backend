import express from "express";
import {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes)

router.route("/:id")
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)  // El metodo put() es para cuado se vayan a actualizar registros
    .delete(checkAuth, eliminarPaciente)  // El metodo delete es para cuando se vayan a eliminar registros

export default router;