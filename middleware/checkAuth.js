import jwt from "jsonwebtoken"
import User from "../models/User.js"

const checkAuth = async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token =  req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.SECRET_JWT)
            req.user = await User.findById(decoded.id).select("-password -isConfirmed -token -createdAt -updatedAt -__v")
            return next()
        } catch (error) {
            return res.status(404).json({msg : "Hubo un error con la autorizacion"})
        }
    }
    if(!token){
        return res.status(401).json({msg : "Hubo un error"})
    }
    next()
}

export default checkAuth