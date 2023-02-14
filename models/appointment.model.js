var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  start_date_time: {
    type: Number,
    required: true,
  },
  end_date_time: {
    type: Number,
    required: true,
  },
  time_duration: {
    type: Number,
    required: true,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  medical_center_id: {
    type: Schema.Types.ObjectId,
    ref: "medicalcenters",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
