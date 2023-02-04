const routes = require("express").Router();
const auth = require("../../../utils/auth");
const drugController = require("../../../controllers/drug.controller");


routes.post("/create", auth.authMiddleware(["OWNER"]), drugController.create);
routes.get("/getDrugById/:id", drugController.getDrugById);
routes.get("/getAllDrugsByMedicalCenter", auth.authMiddleware(["OWNER"]), drugController.getAllDrugsByMedicalCenter);
routes.delete("/delete/:id", drugController.delete);

module.exports = routes;
