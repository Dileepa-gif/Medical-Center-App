const routes = require("express").Router();
const auth = require("../../../utils/auth");
const DrugController = require("../../../controllers/drug.controller");


routes.post("/create", auth.authMiddleware(["OWNER"]), DrugController.create);
routes.get("/getDrugById/:id", DrugController.getDrugById);
routes.get("/getAllDrugsByMedicalCenter", auth.authMiddleware(["OWNER"]), DrugController.getAllDrugsByMedicalCenter);
routes.delete("/delete/:id", DrugController.delete);
routes.put("/update/:id", auth.authMiddleware(["OWNER"]), DrugController.update);

module.exports = routes;
