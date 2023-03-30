const routes = require('express').Router();


const adminRoute = require("./mainRoute/adminRoute/index");
const userRoutes = require("./mainRoute/userRoute/index");
const medicalCenterRoute = require("./mainRoute/medicalCenterRoute/index");
const drugRoute = require("./mainRoute/drugRoute/index");
const appointmentRoute = require("./mainRoute/appointmentRoute/index");
const drugListTemplateRoute = require("./mainRoute/drug_list_template/index");
const prescriptionRoute = require("./mainRoute/prescriptionRoute/index");
const patientRoute = require("./mainRoute/patientRoute/index");
const paymentRoute = require("./mainRoute/paymentRoute/index");


routes.use("/admin", adminRoute);
routes.use("/user", userRoutes);
routes.use("/medicalCenter", medicalCenterRoute);
routes.use("/drug", drugRoute);
routes.use("/appointment", appointmentRoute);
routes.use("/drugListTemplate", drugListTemplateRoute);
routes.use("/prescription", prescriptionRoute);
routes.use("/patient", patientRoute);
routes.use("/payment", paymentRoute);

module.exports = routes;
