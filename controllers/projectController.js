import mongoose from "mongoose"
import Project from "../models/Project.js"
import User from "../models/User.js"

const getProjects = async (req, res) => {
    const proyects = await Project.find({ $or: [{ creator: req.user._id }, { collaborators: req.user._id }] }).select("-tasks")
    return res.json(proyects)
}
const newProject = async (req, res) => {
    const project = new Project(req.body)
    project.creator = req.user._id

    try {
        const projectSaved = await project.save()
        res.json(projectSaved)
    } catch (error) {
        return res.json({ msg: "Hubo un error guardando el proyecto" })
    }
}
const getProject = async (req, res) => {
    const { id } = req.params
    const validateId = mongoose.Types.ObjectId.isValid(id)

    if (!validateId) {
        return res.status(404).json({ msg: "El proyecto no existe" })
    }
    try {
        const project = await Project.findById(id).populate({ path: "tasks", populate: {path: "completed", select:"name"}}).populate("collaborators", "name email")

        if (!project) {
            const error = new Error("No se ha encontrado el proyecto")
            return res.status(404).json({ msg: error.message })
        }
        if (project.creator.toString() !== req.user._id.toString() && !project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
            const error = new Error("Acción no válida")
            return res.status(404).json({ msg: error.message })
        }

        // const tasks = await Task.find().where("project").equals(project._id)
        res.json(project)

    } catch (error) {
        console.log(error);
    }
}
const editProject = async (req, res) => {
    const { id } = req.params
    const validateId = mongoose.Types.ObjectId.isValid(id)

    if (!validateId) {
        return res.status(404).json({ msg: "El proyecto no existe" })
    }
    const project = await Project.findById(id)

    if (!project) {
        const error = new Error("No se ha encontrado el proyecto")
        return res.status(404).json({ msg: error.message })
    }
    if (project.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(404).json({ msg: error.message })
    }

    const { name, description, dateDeliver, client } = req.body

    project.name = name || project.name
    project.description = description || project.description
    project.dateDeliver = dateDeliver || project.dateDeliver
    project.client = client || project.client

    try {
        const projectUpdated = await project.save()

        return res.json(projectUpdated)
    } catch (error) {
        console.log(error);
    }
}
const deleteProject = async (req, res) => {
    const { id } = req.params
    const validateId = mongoose.Types.ObjectId.isValid(id)

    if (!validateId) {
        return res.status(404).json({ msg: "El proyecto no existe" })
    }
    const project = await Project.findById(id)

    if (!project) {
        const error = new Error("No se ha encontrado el proyecto")
        return res.status(404).json({ msg: error.message })
    }
    if (project.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(404).json({ msg: error.message })
    }
    try {
        await project.deleteOne()
        res.json({ msg: "Proyecto Eliminado" })
    } catch (error) {
        console.log(error);
    }
}

const searchColaborator = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email }).select("-isConfirmed -createdAt -password -token -updatedAt -__v")

    if (!user) {
        const error = new Error("No se ha encontrado el usuario")
        return res.status(404).json({ msg: error.message })
    }
    if (user._id.toString() === req.user._id.toString()) {
        const error = new Error("No puedes añadirte como colaborador")
        return res.status(404).json({ msg: error.message })
    }


    res.status(200).json(user)
}

const addCollaborator = async (req, res) => {
    const { email } = req.body
    const project = await Project.findById(req.params.id)
    const user = await User.findOne({ email }).select("name, email")

    if (!project) {
        const error = new Error("No se ha encontrado el proyecto")
        return res.status(404).json({ msg: error.message })
    }

    if (project.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Solo el dueño del proyecto puede añadir colaboradores")
        return res.status(404).json({ msg: error.message })
    }

    if (project.collaborators.includes(user._id)) {
        const error = new Error("El usuario ya es colaborador")
        return res.status(404).json({ msg: error.message })
    }

    project.collaborators.push(user._id)
    await project.save()
    res.status(200).json([{ msg: "Agregado Correctamente" }, {user}])
}

const deleteCollaborator = async (req, res) => {

    const project = await Project.findById(req.params.id)

    if (!project) {
        const error = new Error("No se ha encontrado el proyecto")
        return res.status(404).json({ msg: error.message })
    }

    if (project.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(404).json({ msg: error.message })
    }

    project.collaborators.pull(req.body.id)
    await project.save()
    res.status(200).json({ msg: "Eliminado Correctamente" })

}



export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addCollaborator,
    deleteCollaborator,
    searchColaborator
}