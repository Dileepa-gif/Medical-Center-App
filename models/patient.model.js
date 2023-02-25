const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const MedicalCenter = require("./medical_center.model");

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
  }
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
