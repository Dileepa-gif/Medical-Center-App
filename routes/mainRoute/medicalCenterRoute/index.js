const routes = require("express").Router();
const auth = require("../../../utils/auth");
const MedicalCenterController = require("../../../controllers/medical_center.controller");


routes.get("/getMedicalCenterById/:id", MedicalCenterController.getMedicalCenterById);
routes.get("/getAllMedicalCenters", MedicalCenterController.getAllMedicalCenters);
routes.put("/update/:id", auth.authMiddleware(["OWNER"]), MedicalCenterController.update);

module.exports = routes;
