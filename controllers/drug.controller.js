const Drug = require("../models/drug.model");
const User = require("../models/user.model");
const MedicalCenter = require("../models/medical_center.model");
const mongoose = require("mongoose");


exports.create = async function (req, res) {
  // try {
    const drugExist = await Drug.findOne({ use_name: req.body.use_name } || { drug_name: req.body.drug_name });
    if (drugExist)
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: "Drug already available",
        });

    const drug = new Drug({
      use_name: req.body.use_name,
      drug_name: req.body.drug_name,
      manufacture: req.body.manufacture,
      strength: req.body.strength,
      type: req.body.type,
      medical_center_id: req.jwt.sub.medical_center_id
    });

    var savedDrug = await drug.save();
    res.status(200).json({
      code: 200,
      success: true,
      drug: savedDrug,
      message: "Created in successfully",
    });
  // } catch (error) {
  //   res
  //     .status(500)
  //     .json({ code: 500, success: false, message: "Internal Server Error" });
  // }
};

exports.getDrugById = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `Id is not valid`,
      });

    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid drug with this id`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: drug,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAllDrugsByMedicalCenter = async function (req, res) {
  try {

    const drugs = await Drug.find({medical_center_id : req.jwt.sub.medical_center_id});
    if (!drugs) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid drugs with this medical center`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: drugs,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.delete = function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Id is not valid`,
    });
    Drug.findOneAndDelete({ _id: req.params.id }, function (err, user) {
      if (err) {
        res
          .status(200)
          .json({ code: 200, success: false, message: "Unable to delete!" });
      }
      
      res.status(200).json({
        code: 200,
        success: true,
        message: "Drug removed successfully!",
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

