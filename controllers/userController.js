import User from "../models/User.js"
import generateId from "../helpers/generateId.js"
import generateJWT from "../helpers/generateJWT.js"
import { emailRegister, emailResetPassword  } from "../helpers/email.js"


const register = async (req, res) => {
    const { email } = req.body
    const userExist = await User.findOne({ email })

    if (userExist) {
        return res.status(400).json({ msg: "Usuario ya registrado" })
    }
    try {
        const user = new User(req.body)
        user.token = generateId()
        await user.save()
        // Email Send
        emailRegister({
            email: user.email,
            name : user.name,
            token : user.token
        })
        res.json({msg : "Usuario creado Correctamente, Revisa tu Email"})
    } catch (error) {
        console.log(error);
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(404).json({ msg: "El usuario no existe" })
    }
    if (!user.isConfirmed) {
        return res.status(404).json({ msg: "Tu cuenta no ha sido confirmada" })
    }
    if (await user.checkPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id)
        })
    } else {
        return res.status(404).json({ msg: "Contraseña Incorrecta" })
    }
}

const confirm = async (req, res) => {
    const { token } = req.params
    const userConfirm = await User.findOne({ token })

    if (!userConfirm) {
        return res.status(404).json({ msg: "Token no válido" })
    }

    try {
        userConfirm.isConfirmed = true
        userConfirm.token = ""
        await userConfirm.save()
        res.json({ msg: "Usuario Confirmado Correctamente" })

    } catch (error) {
        console.log(error);
    }
}

const recoverPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if(!user){
        const error = new Error("Email no encontrado")
        return res.status(404).json({ msg: error.message })
    }

    try {
        user.token = generateId()
        await user.save()
        emailResetPassword({
            email: user.email,
            name : user.name,
            token : user.token})
        res.json({ msg: "Hemos enviado un email con las instrucciones" })

    } catch (error) {
        console.log(error);
    }

}

const checkToken = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({ token })

    if (!user) {
        return res.status(404).json({ msg: "Token no válido" })
    }
    return res.json("Token valido")
}

const newPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const user = await User.findOne({ token })

    try {
        if (user) {
            user.password = password
            user.token = ""
            await user.save()
            res.json({ msg: "Contraseña Actualizada Correctamente" })
        } else {
            return res.status(404).json({ msg: "Token no válido" })
        }
    } catch (error) {
        console.log(error);
    }
}

const profile = async (req, res) => {
    const {user} = req
    res.json(user)
}

export {
    register,
    authenticate,
    confirm,
    recoverPassword,
    checkToken,
    newPassword,
    profile
}