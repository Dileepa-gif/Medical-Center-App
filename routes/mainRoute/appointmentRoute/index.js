const routes = require("express").Router();
const auth = require("../../../utils/auth");
const AppointmentController = require("../../../controllers/appointment.controller");


routes.post("/create", auth.authMiddleware(["OWNER", "DOCTOR"]), AppointmentController.create);
routes.get("/getAppointmentById/:id", AppointmentController.getAppointmentById);
routes.post("/getAllAppointmentsByDoctor", AppointmentController.getAllAppointmentsByDoctor);
// routes.delete("/delete/:id", DrugController.delete);
routes.put("/update/:id", AppointmentController.update);

module.exports = routes;
