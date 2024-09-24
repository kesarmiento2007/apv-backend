import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            
            const decored = jwt.verify(token, process.env.JWT_SECRET);

            req.veterinario = await Veterinario.findById(decored.id).select(
                "-password -token -confirmado"
            );

            return next();
        } catch (error) {
            const e = new Error("Token no valido");
            return res.status(403).json({msg: e.message});
        }
    }
}

export default checkAuth;