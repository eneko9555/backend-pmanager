import nodemailer from "nodemailer"

export const emailRegister = async data => {
    const { name, email, token } = data

  
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"Pmanager - Administrador de Proyectos" <cuentas@Pmanager.com',
        to:email,
        subject: "Pmanager -  Confirma tu Cuenta",
        text: "Comprueba tu cuenta en Pmanager",
        html: `<p>Bienvenido ${name}, comprueba tu cuenta en Pmanager </p>
        <p>Tu cuenta ya esta casi lista, debes comprobarla en el siguiente enlace : 
        <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })
}

export const emailResetPassword = async data => {
    const { name, email, token } = data

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"Pmanager - Administrador de Proyectos" <cuentas@Pmanager.com',
        to:email,
        subject: "Pmanager -  Restablecer contraseña",
        text: "Restablece tu contraseña en Pmanager",
        html: `<p>Hola ${name}, has solicitado recuperar tu contraseña  en Pmanager </p>
        <p>Sigue el siguiente enlace para generar una nueva contraseña: 
        <a href="${process.env.FRONTEND_URL}/recuperar-contraseña/${token}">Restablecer contraseña</a>
        <p>Si tu no solicitaste este email, puedes ignorar este mensaje</p>
        `
    })
}