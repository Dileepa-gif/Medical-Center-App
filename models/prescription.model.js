var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var drugItemSchema = new Schema({
  drug: {
    type: Schema.Types.ObjectId,
    ref: "drugs",
  },
  tab: {
    type: Number,
    required: true,
  },
  bid: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  }
});

var prescriptionSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  is_completed: {
    type: Boolean,
    default: true,
  },
  is_drugs_released: {
    type: Boolean,
    default: false,
  },
  total_cost_of_drugs: {
    type: Number,
    default: 0,
  },
  doctor_charge: {
    type: Number,
    default: 0,
  },
  service_charge: {
    type: Number,
    default: 0,
  },
  clinical_description: {
    type: String
  },
  advice: {
    type: String
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  assistance_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  pharmacist_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  medical_center_id: {
    type: Schema.Types.ObjectId,
    ref: "medicalcenters",
  },
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "patients",
    required: true,
  },
  drug_list: [drugItemSchema],

});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
