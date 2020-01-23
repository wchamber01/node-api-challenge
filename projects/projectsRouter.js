const express = require("express");

const Projects = require("../data/helpers/projectModel.js");

const router = express.Router();

//GET all projects
router.get("/", (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error getting projects." });
    });
});

//GET project by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Projects.get(id)
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res
        .status(404)
        .json({ error: "The project with specified id does not exist." });
    });
});

//GET all actions for specified project id
router.get("/:id/actions", (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res
        .status(404)
        .json({ error: "The project with specified id does not exist." });
    });
});

//POST new project
router.post("/", (req, res) => {
  const { name, description } = req.body;
  Projects.insert({ name, description })
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error adding post." });
    });
});

//PUT updates for specified project
router.put("/:id", (req, res) => {
  const { id } = req.params.id;
  const { name, description } = req.params.body;
  Projects.update(id, { name, description })
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error getting user." });
    });
});

//DELETE specified project
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Projects.remove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error deleting project." });
    });
});

//custom middleware
function validateProject(req, res, next) {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ error: "Fields required!" });
  } else if ((typeof name !== "string", typeof description !== "string")) {
    res.status(400).json({ error: "Invalid field type." });
  } else {
    next();
  }
}

function validateProjectId(req, res, next) {
  const { id: project_id } = req.params;
  const { name, description } = req.body;
  if (!req.body) {
    res.status(400).json({ error: "Post requires body" });
  } else if (!name || !description) {
    res.status(400).json({ error: "Action requires text" });
  } else {
    req.body = { project_id, name, description };
    next();
  }
}

module.exports = router;
