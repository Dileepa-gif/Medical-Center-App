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
  template_name: {
    type: String,
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  medical_center_id: {
    type: Schema.Types.ObjectId,
    ref: "medicalcenters",
  },
  drug_list: [drugItemSchema],
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: "patients",
  },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
