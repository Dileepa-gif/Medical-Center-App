const routes = require("express").Router();
const auth = require("../../../utils/auth");
const UserController = require("../../../controllers/user.controller");

routes.post("/createOwner", UserController.createOwner);
routes.post("/verifyOwner",auth.authMiddleware(["OWNER"]), UserController.verifyOwner);
routes.post("/compleatOwnerRegistration", auth.authMiddleware(["OWNER"]), UserController.compleatOwnerRegistration);

routes.post("/loginUser", UserController.loginUser);
routes.get("/validateToken",auth.authMiddleware(["OWNER"]), UserController.validateToken);
routes.post("/forgotPassword", UserController.forgotPassword);
routes.post("/resetForgotPassword", UserController.resetForgotPassword);
routes.post("/resetPassword",auth.authMiddleware(["OWNER"]), UserController.resetPassword);

routes.post("/addEmployee",auth.authMiddleware(["OWNER"]), UserController.addEmployee);
routes.get("/getUserById/:id", UserController.getUserById);
routes.get("/getAllUsers", UserController.getAllUsers);
routes.get("/getUsersByMedicalCenter", auth.authMiddleware(["OWNER"]), UserController.getUsersByMedicalCenter);

routes.put("/update/:id", UserController.update);
routes.delete("/delete/:id", UserController.delete);



module.exports = routes;
