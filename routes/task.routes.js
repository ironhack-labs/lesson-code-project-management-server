// routes/task.routes.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

// POST route => to create a new task
// since we prefixed all routes with "api", this route is actually: "/api/tasks"
router.post("/tasks", (req, res, next) => {
  const { title, description, projectID } = req.body;

  Task.create({
    title,
    description,
    project: projectID
  })
    .then((newlyCreatedTaskFromDB) => {
      return Project.findByIdAndUpdate(projectID, {
        $push: { tasks: newlyCreatedTaskFromDB._id }
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// GET route => to retrieve a specific task
router.get("/projects/:projectId/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  Task.findById(taskId)
    .then((task) => res.json(task))
    .catch((error) => res.json(error));
});

// PUT route => to update a specific task
router.put("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(taskId, req.body)
    .then(() => res.json({ message: `Task with ${taskId} is updated successfully.` }))
    .catch((err) => res.json(err));
});

// DELETE route => to delete a specific task
router.delete("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndRemove(taskId)
    .then(() => res.json({ message: `Task with ${taskId} is removed successfully.` }))
    .catch((error) => res.json(error));
});

module.exports = router;
