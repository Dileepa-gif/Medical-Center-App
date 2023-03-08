const routes = require("express").Router();
const PatientController = require("../../../controllers/patient.controller");

routes.post("/create", PatientController.create);
routes.post("/searchByPhoneNumber", PatientController.searchByPhoneNumber);
module.exports = routes;
