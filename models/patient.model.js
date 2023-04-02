const mongoose = require("mongoose");


var Schema = mongoose.Schema;

const patientSchema = new Schema({

  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  medical_center_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "medicalcenters",
    },
  ],
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
