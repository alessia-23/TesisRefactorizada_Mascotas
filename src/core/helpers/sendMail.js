import sendMail from "./nodemailer.js"

const sendMailToRegister =  (userMail, password, name, token) => {
    return sendMail(
        userMail,
        "¡Bienvenido a PetConnect ! 🐶🐱",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola 👋, gracias por unirte a <strong>PetConnect </strong>.</p>
            <p>Haz clic en el siguiente enlace para confirmar tu cuenta y empezar a disfrutar de todas las funciones:</p>
            <p>Tus credenciales son las siguientes</p>
            <p>Usuario: ${userMail}</p>
            <p>Contraseña: ${password}</p>
            <a href="${process.env.URL_FRONTEND}confirm-email/${token}">
                Confirmar mi cuenta
            </a>
            <hr>
            <footer>El equipo de PetConnect  te da la más cordial bienvenida 💚.</footer>
        `
    )
}
const sendMailToRegisterOWner = (userMail, password, name, token) => {
    return sendMail(
        userMail,
        name + " ¡Bienvenido a PetConnect! 🐶🐱",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola 👋, gracias por unirte a <strong>PetConnect </strong>.</p>
            <p>Haz clic en el siguiente enlace para confirmar tu cuenta y empezar a disfrutar de todas las funciones:</p>
            <p>Tus credenciales son las siguientes</p>
            <p>Usuario: ${userMail}</p>
            <p>Contraseña: ${password}</p>
            <a href="${process.env.URL_FRONTEND}confirm-email/${token}">
                Confirmar mi cuenta
            </a>
            <hr>
            <footer>El equipo de PetConnect  te da la más cordial bienvenida 💚.</footer>
        `
    )
}

const sendMailToRecoveryPassword = (userMail, token) => {
    return sendMail(
        userMail,
        "Restablece tu contraseña 🐾",
        `
            <h1>PetConnect  - Recuperación de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
            <a href="${process.env.URL_FRONTEND}/restore-password/${token}">
                Restablecer mi contraseña
            </a>
            <hr>
            <footer>Recuerda: tu seguridad es importante para nosotros 💫.</footer>
        `
    )
}

const sendMailChangePasswordConfirm = (userMail) => {
    return sendMail(
        userMail,
        "Tu contraseña ha cambiado🐾",
        `
            <h1>PetConnect  - Tu contraseña ha cambiado</h1>
            <hr>
            <footer>Recuerda: tu seguridad es importante para nosotros 💫.</footer>
        `
    )
}


const sendMailToCuidador = (userMail, password) => {
    return sendMail(
        userMail,
        "Registro de Cuidador - SMARTVET 🐾",
        `
            <h1>Bienvenido a SMARTVET</h1>
            <p>Has sido registrado como <strong>Cuidador</strong> en nuestro sistema.</p>

            <p>Estas son tus credenciales de acceso:</p>
            <p><strong>Correo:</strong> ${userMail}</p>
            <p><strong>Contraseña:</strong> ${password}</p>

            <p>Puedes iniciar sesión utilizando el siguiente enlace:</p>
            <a href="${process.env.URL_BACKEND}/login">Iniciar sesión</a>

            <hr>
            <footer>SMARTVET agradece tu compromiso y dedicación.</footer>
        `
    )
}

const senMailUser = (userMail, password) => {
    return sendMail(
        userMail,
        "Registro de Cuidador - SMARTVET 🐾",
        `
            <h1>Bienvenido a SMARTVET</h1>
            <p>Has sido registrado como <strong>Cuidador</strong> en nuestro sistema.</p>

            <p>Estas son tus credenciales de acceso:</p>
            <p><strong>Correo:</strong> ${userMail}</p>
            <p><strong>Contraseña:</strong> ${password}</p>

            <p>Puedes iniciar sesión utilizando el siguiente enlace:</p>
            <a href="${process.env.URL_BACKEND}/login">Iniciar sesión</a>

            <hr>
            <footer>SMARTVET agradece tu compromiso y dedicación.</footer>
        `
    )
}


export {
    sendMailToRegisterOWner,
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailChangePasswordConfirm,
    sendMailToCuidador
}