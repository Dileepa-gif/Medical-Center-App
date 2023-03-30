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
});

// medicalCenterSchema.virtual('total_payment_for_IT_service ').get(function () {
//   Payment.aggregate([
//     {
//       $match: {
//         $and: [
//           {
//             medical_center_id: mongoose.Types.ObjectId(this.medical_center_id),
//           },
//           { is_paid: true },
//         ],
//       },
//     },
//     {
//       $group: {
//         _id: { medical_center_id: "$medical_center_id" },
//         total_payment: { $sum: "$amount" },
//       },
//     },
//   ]).exec(async function (error, total_payment) {
//     if (error) {
//       return 0;
//     }
//     return total_payment;
//   });
// });

medicalCenterSchema.virtual('blockIdLists').get(function () {
  return this.user_id.length;
});

medicalCenterSchema.pre("save", async function (next) {
  const newest_medical_central = await MedicalCenter.findOne().sort({_id: -1});
  if(newest_medical_central){
    this.registration_number = Number(newest_medical_central.registration_number) + 1;
  }else{
    this.registration_number = "1000";
  }
  next();
});


const MedicalCenter = mongoose.model("MedicalCenter", medicalCenterSchema);
module.exports = MedicalCenter;
