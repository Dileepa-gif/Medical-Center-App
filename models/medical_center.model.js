var mongoose = require("mongoose");
const Payment = require("../models/payment.model");
var Schema = mongoose.Schema;


var medicalCenterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  registration_number: {
    type: String
  },
  it_service_charge: {
    type: Number,
    default: 0,
  },
  service_charge: {
    type: Number,
    default: 0,
  },
  is_activated: {
    type: Boolean,
    default: false,
  },
  is_production_mode: {
    type: Boolean,
    default: false,
  },
  user_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  patient_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "patients",
    },
  ],
});

medicalCenterSchema.virtual('completed_payment_for_IT_service').get(async function () {
  const completed_payment_for_IT_service = await Payment.aggregate([
    {
      $match: {
        $and: [
          {
            medical_center_id: mongoose.Types.ObjectId(
              this.id
            ),
          },
          { is_paid: true },
        ],
      },
    },
    {
      $group: {
        _id: { medical_center_id: "$medical_center_id" },
        total_payment: { $sum: "$amount" },
      },
    },
  ]).exec();
  if(completed_payment_for_IT_service.length > 0){
    return completed_payment_for_IT_service[0].total_payment
  }else{
    return 0;
  }
});

medicalCenterSchema.virtual('pending_payment_for_IT_service').get(async function () {
  const pending_payment_for_IT_service = await Payment.aggregate([
    {
      $match: {
        $and: [
          {
            medical_center_id: mongoose.Types.ObjectId(
              this.id
            ),
          },
          { is_paid: false },
        ],
      },
    },
    {
      $group: {
        _id: { medical_center_id: "$medical_center_id" },
        total_payment: { $sum: "$amount" },
      },
    },
  ]).exec();
  if(pending_payment_for_IT_service.length > 0){
    return pending_payment_for_IT_service[0].total_payment
  }else{
    return 0;
  }
});

medicalCenterSchema.pre("save", async function (next) {
  const newest_medical_central = await MedicalCenter.findOne().sort({_id: -1});
  if(newest_medical_central){
    this.registration_number = Number(newest_medical_central.registration_number) + 1;
  }else{
    this.registration_number = "1001";
  }
  next();
});


const MedicalCenter = mongoose.model("MedicalCenter", medicalCenterSchema);
module.exports = MedicalCenter;
