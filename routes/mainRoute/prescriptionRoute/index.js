const routes = require("express").Router();
const auth = require("../../../utils/auth");
const PrescriptionController = require("../../../controllers/prescription.controller");


routes.post("/createByDoctor", auth.authMiddleware(["OWNER", "DOCTOR"]), PrescriptionController.createByDoctor);
routes.post("/createByDoctorUsingTemplate", auth.authMiddleware(["OWNER", "DOCTOR"]), PrescriptionController.createByDoctorUsingTemplate);
routes.post("/createByAssistance", auth.authMiddleware(["ASSISTANT"]), PrescriptionController.createByAssistance);

routes.get("/getReceivedPrescriptionsForDoctor", auth.authMiddleware(["OWNER", "DOCTOR"]), PrescriptionController.getReceivedPrescriptionsForDoctor);
routes.get("/getPrescriptionById/:id", PrescriptionController.getPrescriptionById);
routes.put("/completeByDoctor/:id", auth.authMiddleware(["OWNER", "DOCTOR"]), PrescriptionController.completeByDoctor);
routes.put("/completeByDoctorUsingTemplate/:id", auth.authMiddleware(["OWNER", "DOCTOR"]), PrescriptionController.completeByDoctorUsingTemplate);

routes.get("/getDrugsNotReleasedPrescriptionsForPharmacist", auth.authMiddleware(["PHARMACIST"]), PrescriptionController.getDrugsNotReleasedPrescriptionsForPharmacist);
routes.put("/closePrescriptionsByPharmacist/:id", auth.authMiddleware(["PHARMACIST"]), PrescriptionController.closePrescriptionsByPharmacist);

routes.get("/getAllPrescriptionsOfUser", auth.authMiddleware(["OWNER", "DOCTOR", "ASSISTANT", "PHARMACIST"]), PrescriptionController.getAllPrescriptionsOfUser);

routes.get("/getEarningsOfDoctor/:id",  PrescriptionController.getEarningsOfDoctor);

routes.get("/getSummeryForOwner", auth.authMiddleware(["OWNER"]), PrescriptionController.getSummeryForOwner);

module.exports = routes;
