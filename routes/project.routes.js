// routes/project.routes.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

// POST route => to create a new project
// since we prefixed all routes with "api", this route is actually: "/api/projects"
router.post("/projects", (req, res, next) => {
  const { title, description } = req.body;

  Project.create({
    title,
    description,
    tasks: []
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// GET route => to get all the projects
router.get("/projects", (req, res, next) => {
  Project.find()
    .populate("tasks")
    .then((allTheProjects) => res.json(allTheProjects))
    .catch((err) => res.json(err));
});

// GET route => to get a specific project/detailed view
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Our projects have array of tasks' ids and
  // we can use .populate() method to get the whole task objects
  Project.findById(projectId)
    .populate("tasks")
    .then((project) => res.status(200).json(project))
    .catch((error) => res.json(error));
});

// PUT route => to update a specific project
router.put("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body)
    .then(() => res.json({ message: `Project with ${projectId} is updated successfully.` }))
    .catch((error) => res.json(error));
});

// DELETE route => to delete a specific project
router.delete("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(projectId)
    .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
    .catch((error) => res.json(error));
});

module.exports = router;
