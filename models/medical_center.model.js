var mongoose = require("mongoose");
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
    type: String,
    required: true,
  },
  it_service_charge: {
    type: Number,
    required: true,
    default: 0,
  },
  service_charge: {
    type: Number,
    required: true,
    default: 0,
  },
  is_activated: {
    type: Boolean,
    required: true,
    default: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
});

const MedicalCenter = mongoose.model("medicalCenter", medicalCenterSchema);
module.exports = MedicalCenter;
