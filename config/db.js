import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL);  // Usamos el metodo connect() de mongoose para conectarnos a nuestra db de mongodb. Pegamos el codigo que nos deja Atlas para conectarnos en la parte de Drivers

        const url = `${db.connection.host}:${db.connection.port}`;  // Generamos una URL con el puerto en donde se esta conectando
        console.log(`MongoDB conectado en: ${url}`);

    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;