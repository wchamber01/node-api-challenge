const express = require("express");
const server = express();

server.use(express.json());

const actionsRouter = require("./actions/actionsRouter.js");
server.use("/api/actions", actionsRouter);

const projectsRouter = require("./projects/projectsRouter.js");
server.use("/api/projects", projectsRouter);

server.get("/", (req, res) => {
  res.send("<h2>My sprint project!</h2>");
});

module.exports = server;
