const routes = require("express").Router();
const auth = require("../../../utils/auth");
const AdminController = require("../../../controllers/admin.controller");

routes.post("/createSuperAdmin", AdminController.createSuperAdmin);
routes.post("/createAdmin", auth.authMiddlewareForAdmin(["SUPERADMIN"]), AdminController.createAdmin);
routes.post("/loginAdmin", AdminController.loginAdmin);
routes.get("/logoutAdmin",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.logoutAdmin);
routes.get("/getAllMedicalCenters",auth.authMiddlewareForAdmin(["SUPERADMIN", "ADMIN"]), AdminController.getAllMedicalCenters);
// routes.post("/verifyOwner",auth.authMiddleware(["OWNER"]), UserController.verifyOwner);
// routes.post("/compleatOwnerRegistration", auth.authMiddleware(["OWNER"]), UserController.compleatOwnerRegistration);

// routes.post("/loginUser", UserController.loginUser);
// routes.get("/logoutUser",auth.authMiddleware(["OWNER", "DOCTOR"]), UserController.logoutUser);
// routes.get("/validateToken",auth.authMiddleware(["OWNER"]), UserController.validateToken);
// routes.post("/forgotPassword", UserController.forgotPassword);
// routes.post("/resetForgotPassword", UserController.resetForgotPassword);
// routes.post("/resetPassword",auth.authMiddleware(["OWNER"]), UserController.resetPassword);

// routes.post("/addEmployee",auth.authMiddleware(["OWNER"]), UserController.addEmployee);
// routes.get("/getUserById/:id", UserController.getUserById);
// routes.get("/getAllUsers", UserController.getAllUsers);
// routes.get("/getUsersByMedicalCenter", auth.authMiddleware(["OWNER"]), UserController.getUsersByMedicalCenter);

// routes.put("/update/:id", UserController.update);
// routes.delete("/delete/:id", UserController.delete);
// routes.get("/getAllDoctorsByMedicalCenterId/:id", UserController.getAllDoctorsByMedicalCenterId);




module.exports = routes;
