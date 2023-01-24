const routes = require("express").Router();
const auth = require("../../../utils/auth");
const UserController = require("../../../controllers/user.controller");

routes.post("/createOwner", UserController.createOwner);
routes.put("/verifyOwner/:id", UserController.verifyOwner);
routes.post("/compleatOwnerRegistration/:id", UserController.compleatOwnerRegistration);

routes.post("/loginUser", UserController.loginUser);



routes.get("/getUserId/:id", UserController.getUserId);

module.exports = routes;
