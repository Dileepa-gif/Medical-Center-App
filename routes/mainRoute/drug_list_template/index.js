const routes = require("express").Router();
const auth = require("../../../utils/auth");
const DrugListTemplateController = require("../../../controllers/drug_list_template.controller");


routes.post("/create", auth.authMiddleware(["OWNER", "DOCTOR"]), DrugListTemplateController.create);
routes.get("/getDrugListTemplateById/:id", DrugListTemplateController.getDrugListTemplateById);
routes.get("/getDrugListTemplatesByDoctor", auth.authMiddleware(["OWNER"]), DrugListTemplateController.getDrugListTemplatesByDoctor);
// routes.delete("/delete/:id", DrugController.delete);
// routes.put("/update/:id", auth.authMiddleware(["OWNER"]), DrugController.update);

module.exports = routes;
