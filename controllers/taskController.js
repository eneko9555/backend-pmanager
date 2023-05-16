import Project from "../models/Project.js"
import Task from "../models/Task.js"

const addTask = async (req, res) => {
    const { project } = req.body

    const checkProject = await Project.findOne({ _id: project })

    if (!checkProject) {
        const error = new Error("El Proyecto no existe")
        return res.status(404).json({ msg: error.message })
    }

    if (checkProject.creator.toString() !== req.user._id.toString()) {
        const error = new Error("No tienes los permisos necesarios para realizar esta tarea")
        return res.status(404).json({ msg: error.message })
    }

    try {
        const taskSaved = await Task.create(req.body)
        checkProject.tasks.push(taskSaved._id)
        await checkProject.save()
        return res.json(taskSaved)
    } catch (error) {
        console.log(error);
    }
}

const getTask = async (req, res) => {
    const { id } = req.params

    const task = await Task.findById(id).populate("project")

    if (!task) {
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(403).json({ msg: error.message })
    }
    res.json(task)
}

const updateTask = async (req, res) => {
    const { id } = req.params

    const task = await Task.findById(id).populate("project")

    if (!task) {
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(403).json({ msg: error.message })
    }

    task.name = req.body.name || task.name
    task.description = req.body.description || task.description
    task.priority = req.body.priority || task.priority
    task.deadline = req.body.deadline || task.deadline

    try {
        const taskSaved = await task.save()
        res.json(taskSaved)
    } catch (error) {
        console.log(error);
    }
}
const deleteTask = async (req, res) => {
    const { id } = req.params

    const task = await Task.findById(id).populate("project")

    if (!task) {
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(403).json({ msg: error.message })
    }

    try {
        const project = await Project.findById(task.project)
        project.tasks.pull(task._id)
        await Promise.allSettled([await project.save(), await task.deleteOne()])
        res.json(task)
    } catch (error) {
        console.log(error);
    }

}
const changeState = async (req, res) => {
    const { id } = req.params
    let task = await Task.findById(id).populate("project")

    if (!task) {
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }

    if (task.project.creator.toString() !== req.user._id.toString() && !task.project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
        const error = new Error("Acción no válida")
        return res.status(404).json({ msg: error.message })
    }

    try {
        task.status = !task.status
        task.completed = req.user._id
        await task.save()
        task = await Task.findById(id).populate("project").populate("completed", "name")
        res.status(200).json(task)
    } catch (error) {
        console.log(error);
    }
}

export {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
}