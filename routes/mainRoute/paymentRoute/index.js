const routes = require("express").Router();
const auth = require("../../../utils/auth");
const PaymentController = require("../../../controllers/payment.controller");


routes.get("/getPaymentsByMedicalCenter", auth.authMiddleware(["OWNER"]), PaymentController.getPaymentsByMedicalCenter);
routes.post("/completePayment", auth.authMiddleware(["OWNER"]), PaymentController.completePayment);
module.exports = routes;
