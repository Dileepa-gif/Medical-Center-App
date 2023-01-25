const routes = require("express").Router();
const auth = require("../../../utils/auth");
const UserController = require("../../../controllers/user.controller");

routes.post("/createOwner", UserController.createOwner);
routes.post("/verifyOwner",auth.authMiddleware(["OWNER"]), UserController.verifyOwner);
routes.post("/compleatOwnerRegistration", auth.authMiddleware(["OWNER"]), UserController.compleatOwnerRegistration);

routes.post("/loginUser", UserController.loginUser);



routes.get("/getUserId/:id", UserController.getUserId);
routes.get("/getAllUsers", UserController.getAllUsers);

module.exports = routes;
