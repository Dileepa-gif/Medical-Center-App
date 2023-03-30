const DrugListTemplate = require("../models/drug_list_template.model");
const Prescription = require("../models/prescription.model");
const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const MedicalCenter = require("../models/medical_center.model");
const mongoose = require("mongoose");
const date = require("../utils/date");
const Socket = require("../server");

exports.createByDoctor = async function (req, res) {
  try {
    const patientExist = await Patient.findOne({
      $and: [{ name: req.body.name }, { phone_number: req.body.phone_number }],
    });
    if (patientExist) {
      const prescription = new Prescription({
        date: date.date,
        doctor_id: req.jwt.sub._id,
        medical_center_id: req.jwt.sub.medical_center_id,
        patient_id: patientExist.id,
        drug_list: req.body.drug_list,
        clinical_description: req.body.clinical_description || "",
        advice: req.body.advice || "",
      });

      const savedPrescription = await prescription.save();
      var medical_center = await MedicalCenter.findById(
        req.jwt.sub.medical_center_id
      );

      medical_center.prescription_id.push(savedPrescription._id);
      medical_center.save();

      drugsNotReleasedPrescriptions(savedPrescription.medical_center_id);
      res.status(200).json({
        code: 200,
        success: true,
        prescription: savedPrescription,
        message: "Created in successfully",
      });
    } else {
      const patient = new Patient({
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        phone_number: req.body.phone_number,
      });
      const savedPatient = await patient.save();
      const prescription = new Prescription({
        date: date.date,
        doctor_id: req.jwt.sub._id,
        medical_center_id: req.jwt.sub.medical_center_id,
        patient_id: savedPatient.id,
        drug_list: req.body.drug_list,
        clinical_description: req.body.clinical_description || "",
        advice: req.body.advice || "",
      });

      const savedPrescription = await prescription.save();
      var medical_center = await MedicalCenter.findById(
        req.jwt.sub.medical_center_id
      );

      medical_center.prescription_id.push(savedPrescription._id);
      medical_center.save();

      drugsNotReleasedPrescriptions(savedPrescription.medical_center_id);
      res.status(200).json({
        code: 200,
        success: true,
        prescription: savedPrescription,
        message: "Created in successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.createByDoctorUsingTemplate = async function (req, res) {
  try {
    const patientExist = await Patient.findOne({
      $and: [{ name: req.body.name }, { phone_number: req.body.phone_number }],
    });
    if (patientExist) {
      const drugListTemplate = await DrugListTemplate.findById(
        req.body.drug_list_template_id
      );
      const prescription = new Prescription({
        date: date.date,
        doctor_id: req.jwt.sub._id,
        medical_center_id: req.jwt.sub.medical_center_id,
        patient_id: patientExist.id,
        drug_list: drugListTemplate.drug_list,
        clinical_description: req.body.clinical_description || "",
        advice: req.body.advice || "",
      });

      const savedPrescription = await prescription.save();
      var medical_center = await MedicalCenter.findById(
        req.jwt.sub.medical_center_id
      );

      medical_center.prescription_id.push(savedPrescription._id);
      medical_center.save();

      drugsNotReleasedPrescriptions(savedPrescription.medical_center_id);
      res.status(200).json({
        code: 200,
        success: true,
        prescription: savedPrescription,
        message: "Created in successfully",
      });
    } else {
      const patient = new Patient({
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        phone_number: req.body.phone_number,
      });
      const savedPatient = await patient.save();
      const drugListTemplate = await DrugListTemplate.findById(
        req.body.drug_list_template_id
      );
      const prescription = new Prescription({
        date: date.date,
        doctor_id: req.jwt.sub._id,
        medical_center_id: req.jwt.sub.medical_center_id,
        patient_id: savedPatient.id,
        drug_list: drugListTemplate.drug_list,
        clinical_description: req.body.clinical_description || "",
        advice: req.body.advice || "",
      });

      const savedPrescription = await prescription.save();
      var medical_center = await MedicalCenter.findById(
        req.jwt.sub.medical_center_id
      );

      medical_center.prescription_id.push(savedPrescription._id);
      medical_center.save();

      drugsNotReleasedPrescriptions(savedPrescription.medical_center_id);
      res.status(200).json({
        code: 200,
        success: true,
        prescription: savedPrescription,
        message: "Created in successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.createByAssistance = async function (req, res) {
  try {
    const patientExist = await Patient.findOne({
      $and: [{ name: req.body.name }, { phone_number: req.body.phone_number }],
    });
    if (patientExist) {
      const prescription = new Prescription({
        date: date.date,
        doctor_id: req.body.doctor_id,
        medical_center_id: req.jwt.sub.medical_center_id,
        assistance_id: req.jwt.sub._id,
        patient_id: patientExist.id,
        is_completed: false,
      });

      const savedPrescription = await prescription.save();
      var medical_center = await MedicalCenter.findById(
        req.jwt.sub.medical_center_id
      );

      medical_center.prescription_id.push(savedPrescription._id);
      medical_center.save();

      const received_prescriptions = await Prescription.find({
        $and: [
          { doctor_id: savedPrescription.doctor_id },
          { medical_center_id: savedPrescription.medical_center_id },
          { is_completed: false },
        ],
      })
        .populate({
          path: "patient_id",
          model: "Patient",
        })
        .populate({
          path: "assistance_id",
          model: "User",
        });

      Socket.Socket(
        req.body.doctor_id,
        "received_prescriptions",
        received_prescriptions
      );
      res.status(200).json({
        code: 200,
        success: true,
        prescription: savedPrescription,
        message: "Created in successfully",
      });
    } else {
      const patient = new Patient({
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        phone_number: req.body.phone_number,
      });
      const savedPatient = await patient.save();
      const prescription = new Prescription({
        date: date.date,
        doctor_id: req.body.doctor_id,
        medical_center_id: req.jwt.sub.medical_center_id,
        patient_id: patientExist.id,
        is_completed: false,
      });

      const savedPrescription = await prescription.save();
      const received_prescriptions = await Prescription.find({
        $and: [
          { doctor_id: savedPrescription.doctor_id },
          { medical_center_id: savedPrescription.medical_center_id },
          { is_completed: false },
        ],
      })
        .populate({
          path: "patient_id",
          model: "Patient",
        })
        .populate({
          path: "assistance_id",
          model: "User",
        });

      Socket.Socket(
        req.body.doctor_id,
        "received_prescriptions",
        received_prescriptions
      );
      res.status(200).json({
        code: 200,
        success: true,
        prescription: savedPrescription,
        message: "Created in successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getPrescriptionById = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `Id is not valid`,
      });

    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: "doctor_id",
        model: "User",
      })
      .populate({
        path: "patient_id",
        model: "Patient",
      })
      .populate({
        path: "assistance_id",
        model: "User",
      })
      .populate({
        path: "pharmacist_id",
        model: "User",
      });

    return res.status(200).json({
      code: 200,
      status: true,
      prescription: prescription,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getReceivedPrescriptionsForDoctor = async function (req, res) {
  try {
    const received_prescriptions = await Prescription.find({
      $and: [
        { doctor_id: req.jwt.sub._id },
        { medical_center_id: req.jwt.sub.medical_center_id },
        { is_completed: false },
      ],
    })
      .populate({
        path: "patient_id",
        model: "Patient",
      })
      .populate({
        path: "assistance_id",
        model: "User",
      });

    if (!received_prescriptions) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No received prescriptions with you`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        received_prescriptions: received_prescriptions,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.completeByDoctor = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No prescription with id: ${id}`,
      });

    let prescription = await Prescription.findById(id);
    if (!(prescription && prescription.is_completed == false))
      return res.status(200).json({
        code: 200,
        success: false,
        message:
          "There is no prescription or this prescription already completed",
      });
    prescription = {
      drug_list: req.body.drug_list,
      is_completed: true,
      clinical_description: req.body.clinical_description || "",
      advice: req.body.advice || "",
    };
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      prescription,
      { new: true }
    );
    drugsNotReleasedPrescriptions(updatedPrescription.medical_center_id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Prescription is updated successfully",
      data: updatedPrescription,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.completeByDoctorUsingTemplate = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No prescription with id: ${id}`,
      });

    let prescription = await Prescription.findById(id);
    if (!(prescription && prescription.is_completed == false))
      return res.status(200).json({
        code: 200,
        success: false,
        message:
          "There is no prescription or this prescription already completed",
      });

    const drugListTemplate = await DrugListTemplate.findById(
      req.body.drug_list_template_id
    );
    prescription = {
      drug_list: drugListTemplate.drug_list,
      is_completed: true,
      clinical_description: req.body.clinical_description || "",
      advice: req.body.advice || "",
    };

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      prescription,
      { new: true }
    );
    drugsNotReleasedPrescriptions(updatedPrescription.medical_center_id);
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Prescription is updated successfully",
      data: updatedPrescription,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const drugsNotReleasedPrescriptions = async function (medical_center_id) {
  try {
    const drugs_not_released_prescriptions = await Prescription.find({
      $and: [
        { is_drugs_released: false },
        { medical_center_id: medical_center_id },
        { is_completed: true },
      ],
    })
      .populate({
        path: "patient_id",
        model: "Patient",
      })
      .populate({
        path: "assistance_id",
        model: "User",
      })
      .populate({
        path: "doctor_id",
        model: "User",
      });

    const pharmacists = await User.find({
      $and: [{ role: "PHARMACIST" }, { medical_center_id: medical_center_id }],
    });
    pharmacists.forEach((pharmacist) => {
      Socket.Socket(
        pharmacist.id,
        "drugs_not_released_prescriptions",
        drugs_not_released_prescriptions
      );
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getCompletedPrescriptionsOfDoctor = async function (req, res) {
  try {
    const completed_prescriptions = await Prescription.find({
      $and: [
        { doctor_id: req.jwt.sub._id },
        { medical_center_id: req.jwt.sub.medical_center_id },
        { is_completed: true },
      ],
    })
      .populate({
        path: "patient_id",
        model: "Patient",
      })
      .populate({
        path: "assistance_id",
        model: "User",
      })
      .populate({
        path: "pharmacist_id",
        model: "User",
      });
    if (!completed_prescriptions) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No completed prescriptions with you`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        completed_prescriptions: completed_prescriptions,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getDrugsNotReleasedPrescriptionsForPharmacist = async function (
  req,
  res
) {
  try {
    const drugs_not_released_prescriptions = await Prescription.find({
      $and: [
        { is_drugs_released: false },
        { medical_center_id: req.jwt.sub.medical_center_id },
        { is_completed: true },
      ],
    })
      .populate({
        path: "patient_id",
        model: "Patient",
      })
      .populate({
        path: "assistance_id",
        model: "User",
      })
      .populate({
        path: "doctor_id",
        model: "User",
      });
    if (!drugs_not_released_prescriptions) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No drugs not released prescriptions`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        drugs_not_released_prescriptions: drugs_not_released_prescriptions,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.closePrescriptionsByPharmacist = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No prescription with id: ${id}`,
      });

    let prescription = await Prescription.findById(id);
    if (
      !(
        prescription &&
        prescription.is_completed == true &&
        prescription.is_drugs_released == false
      )
    )
      return res.status(200).json({
        code: 200,
        success: false,
        message:
          "There is no prescription or drugs are released for this prescription",
      });
    prescription = {
      pharmacist_id: req.jwt.sub._id,
      total_cost_of_drugs: req.body.total_cost_of_drugs,
      doctor_charge: req.body.doctor_charge,
      service_charge: req.body.service_charge,
      is_drugs_released: true,
    };
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      id,
      prescription,
      {
        new: true,
      }
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Prescription is closed successfully",
      data: updatedPrescription,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllPrescriptionsOfUser = async function (req, res) {
  try {
    const all_prescriptions = await Prescription.find({
      $or: [
        { doctor_id: req.jwt.sub._id },
        { assistance_id: req.jwt.sub._id },
        { pharmacist_id: req.jwt.sub._id },
      ],
      $and: [{ medical_center_id: req.jwt.sub.medical_center_id }],
    })
      .populate({
        path: "doctor_id",
        model: "User",
      })
      .populate({
        path: "patient_id",
        model: "Patient",
      })
      .populate({
        path: "assistance_id",
        model: "User",
      })
      .populate({
        path: "pharmacist_id",
        model: "User",
      });
    if (!all_prescriptions) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No prescriptions with you`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        all_prescriptions: all_prescriptions,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllPrescriptionsOfUser = async function (req, res) {
  try {
    const all_prescriptions = await Prescription.find({
      $or: [
        { doctor_id: req.jwt.sub._id },
        { assistance_id: req.jwt.sub._id },
        { pharmacist_id: req.jwt.sub._id },
      ],
      $and: [{ medical_center_id: req.jwt.sub.medical_center_id }],
    })
      .populate({
        path: "doctor_id",
        model: "User",
      })
      .populate({
        path: "patient_id",
        model: "Patient",
      })
      .populate({
        path: "assistance_id",
        model: "User",
      })
      .populate({
        path: "pharmacist_id",
        model: "User",
      });
    if (!all_prescriptions) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No prescriptions with you`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        all_prescriptions: all_prescriptions,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getEarningsOfDoctor = async function (req, res) {
  try {
    Prescription.aggregate([
      {
        $match: {
          $and: [
            { doctor_id: mongoose.Types.ObjectId(req.params.id) },
            { is_completed: true },
          ],
        },
      },
      {
        $group: {
          _id: { date: "$date" },
          total_treatment: { $count: {} },
          total_earnings: { $sum: "$doctor_charge" },
        },
      },
      { $sort: { _id: -1 } },
    ]).exec(function (error, earnings) {
      if (error) {
        return res
          .status(200)
          .json({ code: 200, status: false, message: "Invalid Request!" });
      }
      Prescription.aggregate([
        {
          $match: {
            $and: [
              { doctor_id: mongoose.Types.ObjectId(req.params.id) },
              { is_completed: true },
              { date: date.date }
            ],
          },
        },
        {
          $group: {
            _id: { date: "$date" },
            today_total_treatment: { $count: {} },
            today_total_earnings: { $sum: "$doctor_charge" },
          },
        },
        { $sort: { date: 1 } },
      ]).exec(function (error, today_earnings) {
        if (error) {
          return res
            .status(200)
            .json({ code: 200, status: false, message: "Invalid Request!" });
        }

        return res
          .status(200)
          .json({ code: 200, status: true, earnings: earnings, today_earnings:today_earnings });
      });
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


exports.getSummeryForOwner = async function (req, res) {
  try {
    Prescription.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
              { date: { $regex: ".*" + date.month_arr[0] + ".*" } },
              { date: { $regex: ".*" + date.month_arr[1] + ".*" } },
              { date: { $regex: ".*" + date.month_arr[2] + ".*" } },
              { date: { $regex: ".*" + date.month_arr[3] + ".*" } },
              { date: { $regex: ".*" + date.month_arr[4] + ".*" } },
              { date: { $regex: ".*" + date.month_arr[5] + ".*" } }
            ],},
            { medical_center_id: mongoose.Types.ObjectId(req.jwt.sub.medical_center_id) },
            { is_completed: true },
            { is_drugs_released: true },
          ],
        },
      },
      {
        $group: {
          _id: { medical_center_id: "$medical_center_id" },
          monthly_total_treatment: { $count: {} },
          monthly_total_earnings: { $sum: "$service_charge" },
        },
      },
    ]).exec(function (error, six_month_summery) {
      if (error) {
        return res
          .status(200)
          .json({ code: 200, status: false, message: "Invalid Request!" });
      }

      Prescription.aggregate([
        {
          $match: {
            $and: [
              { date: date.date },
              { medical_center_id: mongoose.Types.ObjectId(req.jwt.sub.medical_center_id) },
              { is_completed: true },
              { is_drugs_released: true },
            ],
          },
        },
        {
          $group: {
            _id: { medical_center_id: "$medical_center_id" },
            today_total_treatment: { $count: {} },
            today_total_summery: { $sum: "$service_charge" },
          },
        },
        { $sort: { date: 1 } },
      ]).exec(function (error, today_summery) {
        if (error) {
          return res
            .status(200)
            .json({ code: 200, status: false, message: "Invalid Request!" });
        }

        return res
          .status(200)
          .json({ code: 200, status: true, six_month_summery: six_month_summery, today_summery:today_summery });
      });
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
