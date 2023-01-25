const routes = require('express').Router();

const userRoutes = require("./mainRoute/userRoute/index");
const medicalCenterRoute = require("./mainRoute/medicalCenterRoute/index");


routes.use("/user", userRoutes);
routes.use("/medicalCenter", medicalCenterRoute);

module.exports = routes;
