const Patient = require("../models/patient.model");

exports.create = async function (req, res) {
  try {
    const patientExist = await Patient.findOne({
      $and: [
        { name: req.body.name },
        { phone_number: req.body.phone_number },
      ],
    });
    if (patientExist)
      return res
        .status(200)
        .json({
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
      patient : savedPatient,
      message: "Patient is created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};

