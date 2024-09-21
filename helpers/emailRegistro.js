import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({  // Configuramos el servidor de envio de mails
        host: process.env.EMAIL_HOST,  // Se recomienda tener en variables de entorno los datos para la configuracion del servidor
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    // Enviar al email
    const info = await transporter.sendMail({  // Con sendMail() (junto a la configuracion del servidor de mails) enviamos mail, y por parametros le pasamos un objeto con la extructura del mail que enviara
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Comprueba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en APV.</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
                <a href=${process.env.FRONTEND_URL}/confirmar/${token}>Comprobar Cuenta</a>
            </p>

            <p>Si tu no creastes esta cuenta, puedes ignorar este mensaje</p>
        `
    });
}

export default emailRegistro;