const routes = require("express").Router();
const auth = require("../../../utils/auth");
const medicalCenterController = require("../../../controllers/medical_center.controller");


routes.get("/getMedicalCenterById/:id", medicalCenterController.getMedicalCenterById);
routes.get("/getAllMedicalCenters", medicalCenterController.getAllMedicalCenters);

module.exports = routes;
