import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/config.js"
import userRoutes from "./routes/userRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import { Server } from "socket.io"

const app = express()
app.use(express.json())
dotenv.config()
connectDB()

// Cors
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Error de cors"))
        }
    }
}
app.use(cors(corsOptions))

// Routing
app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)


const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
})

// Socket.io //

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on("connection", (socket) => {
    //console.log("conectado a socket.io");
    //Events

    //Reception
    socket.on("open project", (id) => {
        socket.join(id)
    })

    socket.on("new task", (task) => {
        const project = task.project
        socket.to(project).emit("task added", task)
    })

    socket.on("delete task", (task) => {
        const project = task.project
        socket.to(project._id).emit("task deleted", task)
    })

    socket.on("edit task", (task) => {
        const project = task.project
        socket.to(project._id).emit("task edited", task)
    })

    socket.on("change status", (task) => {
        const project = task.project
        socket.to(project._id).emit("status changed", task)
    })

    socket.on("add col", (user, projectId) => {
        socket.to(projectId).emit("col added", user)
    })

    socket.on("delete col", (userId, projectId) => {
        socket.to(projectId).emit("col deleted", userId)
    })

})
