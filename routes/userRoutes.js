import express from "express"
import { register, authenticate, confirm, recoverPassword, checkToken, newPassword, profile} from "../controllers/userController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()

// Register, autenthicate, confirm users
router.post("/", register)
router.post("/login", authenticate)
router.get("/confirm/:token", confirm)
router.post("/recover-password", recoverPassword)
router.get("/recover-password/:token", checkToken)
router.post("/recover-password/:token", newPassword)

router.get("/profile", checkAuth, profile)


export default router