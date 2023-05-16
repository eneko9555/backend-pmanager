import mongoose from "mongoose"

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date,
        default: Date.now(),
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ["Baja", "Media", "Alta", "Muy alta"]
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    completed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
})

const Task = mongoose.model("Task", taskSchema)
export default Task

