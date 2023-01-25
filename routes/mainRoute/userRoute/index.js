const routes = require("express").Router();
const auth = require("../../../utils/auth");
const UserController = require("../../../controllers/user.controller");

routes.post("/createOwner", UserController.createOwner);
routes.post("/verifyOwner",auth.authMiddleware(["OWNER"]), UserController.verifyOwner);
routes.post("/compleatOwnerRegistration", auth.authMiddleware(["OWNER"]), UserController.compleatOwnerRegistration);

routes.post("/loginUser", UserController.loginUser);
routes.post("/forgotPassword", UserController.forgotPassword);
routes.post("/resetForgotPassword", UserController.resetForgotPassword);
routes.post("/resetPassword",auth.authMiddleware(["OWNER"]), UserController.resetPassword);


routes.get("/getUserId/:id", UserController.getUserId);
routes.get("/getAllUsers", UserController.getAllUsers);

module.exports = routes;
