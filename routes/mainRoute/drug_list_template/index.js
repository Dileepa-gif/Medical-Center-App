const routes = require("express").Router();
const auth = require("../../../utils/auth");
const DrugListTemplateController = require("../../../controllers/drug_list_template.controller");


routes.post("/create", auth.authMiddleware(["OWNER", "DOCTOR"]), DrugListTemplateController.create);
routes.get("/getDrugListTemplateById/:id", DrugListTemplateController.getDrugListTemplateById);
routes.get("/getDrugListTemplatesByDoctor", auth.authMiddleware(["OWNER"]), DrugListTemplateController.getDrugListTemplatesByDoctor);
routes.delete("/delete/:id", DrugListTemplateController.delete);
routes.put("/update/:id", auth.authMiddleware(["OWNER"]), DrugListTemplateController.update);
routes.put("/deleteDrugs/:id", DrugListTemplateController.deleteDrugs);
routes.put("/addDrugs/:id", DrugListTemplateController.addDrugs);

module.exports = routes;
