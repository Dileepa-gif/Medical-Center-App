const routes = require('express').Router();

const userRoutes = require("./mainRoute/userRoute/index");
const medicalCenterRoute = require("./mainRoute/medicalCenterRoute/index");
const drugRoute = require("./mainRoute/drugRoute/index");


routes.use("/user", userRoutes);
routes.use("/medicalCenter", medicalCenterRoute);
routes.use("/drug", drugRoute);

module.exports = routes;
