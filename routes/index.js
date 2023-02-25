const routes = require('express').Router();

const userRoutes = require("./mainRoute/userRoute/index");
const medicalCenterRoute = require("./mainRoute/medicalCenterRoute/index");
const drugRoute = require("./mainRoute/drugRoute/index");
const appointmentRoute = require("./mainRoute/appointmentRoute/index");
const drugListTemplateRoute = require("./mainRoute/drug_list_template/index");


routes.use("/user", userRoutes);
routes.use("/medicalCenter", medicalCenterRoute);
routes.use("/drug", drugRoute);
routes.use("/appointment", appointmentRoute);
routes.use("/drugListTemplate", drugListTemplateRoute);

module.exports = routes;
