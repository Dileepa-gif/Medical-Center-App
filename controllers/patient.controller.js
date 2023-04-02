const MedicalCenter = require("../models/medical_center.model");
const Patient = require("../models/patient.model");

exports.create = async function (req, res) {
  try {
    const patientExist = await Patient.findOne({
      $and: [{ name: req.body.name }, { phone_number: req.body.phone_number }],
    });
    if (patientExist)
      return res.status(200).json({
        code: 200,
        success: false,
        message: "Patient already available",
      });

    const patient = new Patient({
      name: req.body.name,
      age: req.body.age,
      address: req.body.address,
      phone_number: req.body.phone_number,
    });

    var savedPatient = await patient.save();

    res.status(200).json({
      code: 200,
      success: true,
      patient: savedPatient,
      message: "Patient is created successfully",
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

exports.searchByPhoneNumber = async function (req, res) {
  try {
    const patients = await Patient.find({
      phone_number: { $regex: ".*" + req.body.phone_number + ".*" },
    });

    return res.status(200).json({
      code: 200,
      success: true,
      data: patients,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.subscribeMedicalCenter = async function (req, res) {
  try {
    const patient = await Patient.findById(req.params.id);
    const medical_center = await MedicalCenter.findOne({registration_number :  req.params.registration_number});
    patient.medical_center_id.push(medical_center._id);
    patient.save();
    medical_center.patient_id.push(patient._id);
    medical_center.save();

    return res.status(200).json({
      code: 200,
      success: true,
      patient: patient,
      medical_center: medical_center,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

