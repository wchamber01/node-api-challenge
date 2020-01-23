const express = require("express");

const Actions = require("../data/helpers/actionModel.js");
const Projects = require("../data/helpers/projectModel.js");

const router = express.Router();

//GET all actions
router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error getting projects" });
    });
});

//GET actions by id
router.get("/:id", validateActionId, (req, res) => {
  const { id } = req.params;
  Actions.get(id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      console.log(err);
      res
        .status(404)
        .json({ error: "The action with specified id does not exist." });
    });
});

//POST new action
router.post("/", validateAction, (req, res) => {
  const { project_id, description, notes } = req.body;
  Actions.insert({ project_id, description, notes })
    .then(action => {
      res.status(201).json(action);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Project_id not found." });
    });
});

//PUT updates for specified action
router.put("/:id", validateActionId, (req, res) => {
  const { id } = req.params;
  //const { description, notes } = req.params.body;
  Actions.update(id, req.body)
    .then(action => {
      res.status(200).json(action);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error updating action." });
    });
});

//DELETE specified action
router.delete("/:id", validateActionId, (req, res) => {
  const { id } = req.params;
  Actions.remove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error deleting action." });
    });
});

//custom middleware

function validateActionId(req, res, next) {
  const { id } = req.params;
  Actions.get(id).then(action => {
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ error: "The specified action does not exist" });
    }
  });
}

function validateAction(req, res, next) {
  const { description, notes } = req.body;
  if (!description || !notes) {
    res.status(400).json({ error: "Fields required!" });
  } else {
    next();
  }
}

function validateProjectId(req, res, next) {
  // const { name, description } = req.body;
  Projects.get(req.body.id);
  if (!req.body.id) {
    res.status(400).json({ error: "Project not found" });
  } else if (!name || !description) {
    res.status(400).json({ error: "Action requires text" });
  } else {
    req.body = { project_id, name, description };
    next();
  }
}

module.exports = router;
