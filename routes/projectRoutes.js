import express from "express";
import {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addCollaborator,
    deleteCollaborator,
    searchColaborator
}from "../controllers/projectController.js"
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

router.get("/", checkAuth, getProjects)
router.post("/", checkAuth, newProject)
router.route("/:id").get(checkAuth, getProject).put(checkAuth, editProject).delete(checkAuth, deleteProject)
router.post("/search-collaborator", checkAuth, searchColaborator)
router.post("/collaborator/:id", checkAuth, addCollaborator)
router.post("/delete-collaborator/:id", checkAuth, deleteCollaborator)


export default router