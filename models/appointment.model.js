var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var appointmentSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  start_time: {
    type: Number,
    required: true,
  },
  end_time: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
