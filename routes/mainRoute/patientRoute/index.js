const routes = require("express").Router();
const PatientController = require("../../../controllers/patient.controller");

routes.post("/create", PatientController.create);
module.exports = routes;
