var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var PaymentSchema = new Schema({
  payment_id: {
    type: String,
  },
  order_id: {
    type: String,
  },
  is_paid: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    default: 0,
  },
  month: {
    type: String,
    required: true,
  },
  paid_date: {
    type: String,
  },
  status: {
    type: String,
  },
  currency: {
    type: String,
    default: "LKR",
  },
  method: {
    type: String,
  },
  medical_center_id: {
    type: Schema.Types.ObjectId,
    ref: "medicalcenters",
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
