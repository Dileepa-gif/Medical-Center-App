const routes = require("express").Router();
const auth = require("../../../utils/auth");
const AdminController = require("../../../controllers/admin.controller");

routes.post("/createSuperAdmin", AdminController.createSuperAdmin);
routes.post("/createAdmin", auth.authMiddlewareForAdmin(["SUPERADMIN"]), AdminController.createAdmin);
routes.post("/loginAdmin", AdminController.loginAdmin);
routes.get("/logoutAdmin",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.logoutAdmin);
routes.get("/getAllMedicalCenters",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.getAllMedicalCenters);
routes.get("/getAllAdmin",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.getAllAdmin);
routes.put("/changePassword/:id",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.changePassword);
routes.get("/getNewRegistrations",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.getNewRegistrations);
routes.put("/registrationConfirmation/:id",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.registrationConfirmation);
routes.get("/activationOfAdmin/:id",auth.authMiddlewareForAdmin(["SUPERADMIN"]), AdminController.activationOfAdmin);

routes.get("/getMedicalCenterById/:id",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.getMedicalCenterById);
routes.put("/updateMedicalCenter/:id",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.updateMedicalCenter);
routes.get("/getMedicalCenterPaymentHistory/:id",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.getMedicalCenterPaymentHistory);



module.exports = routes;
