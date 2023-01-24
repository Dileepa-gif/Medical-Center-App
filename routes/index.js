const routes = require('express').Router();

const userRoutes = require("./mainRoute/userRoute/index");


routes.use("/user", userRoutes);

module.exports = routes;
