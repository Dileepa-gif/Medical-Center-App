const User = require("../models/user.model");
const Appointment = require("../models/appointment.model");
const mongoose = require("mongoose");

exports.create = async function (req, res) {
  try {

    const user = await User.findById(req.body.doctor_id);
    if (!user || !(user.role == "OWNER" || user.role == "DOCTOR")) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Doctor not found" });
    }

    let time_duration = req.body.time_duration*60*1000
    let start_date_time = new Date(req.body.date + " " +req.body.start_time);
    start_date_time = start_date_time.getTime();
    let end_date_time = start_date_time + time_duration;
    var savedAppointments = [];

    const lastAppointment = await Appointment.findOne({ $and: [{date: req.body.date},{doctor_id : req.body.doctor_id}, {medical_center_id : req.jwt.sub.medical_center_id}]}).sort('-end_date_time');

    if (lastAppointment && lastAppointment.end_date_time > start_date_time)
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: "Please change 'Start time' because doctor's last appointment will end at " +  new Date(lastAppointment.end_date_time).toLocaleDateString() + " " + new Date(lastAppointment.end_date_time).toLocaleTimeString(),
        });
    
    for (let i = 0; i < req.body.count_for_date; i++) {
      const appointment = new Appointment({        
        date: req.body.date,
        start_date_time: start_date_time,
        end_date_time: end_date_time,
        time_duration: time_duration,
        doctor_id : req.body.doctor_id,
        medical_center_id : req.jwt.sub.medical_center_id
      });
      start_date_time = end_date_time;
      end_date_time = start_date_time + time_duration;
      savedAppointments.push(await appointment.save());
    }
    res.status(200).json({
      code: 200,
      success: true,
      drug: savedAppointments,
      message: "Created in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

exports.getAppointmentById = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `Id is not valid`,
      });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid appointment with this id`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: appointment,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

exports.getAllAppointmentsByDoctor = async function (req, res) {
  try {
    const appointments = await Appointment.find({ $and: [{date: req.body.date},{doctor_id : req.body.doctor_id}, {medical_center_id : req.body.medical_center_id}]});
    if (!appointments) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid appointment with this doctor`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: appointments,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

exports.update = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No appointment with id: ${id}`,
      });
    let appointment = await Appointment.findById(id);

    if (!appointment) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: `No appointment with id: ${id}` });
    }
    appointment = {
      is_available: appointment.is_available? false : true
    };
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, appointment, {
      new: true,
    });
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Appointment is updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

