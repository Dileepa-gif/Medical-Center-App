const Drug = require("../models/drug.model");
const User = require("../models/user.model");
const MedicalCenter = require("../models/medical_center.model");
const mongoose = require("mongoose");


exports.create = async function (req, res) {
  try {
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
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: 
 error.message || "Internal Server Error" });
  }
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
      .json({ code: 500, success: false, message: 
 error.message || "Internal Server Error" });
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
      .json({ code: 500, success: false, message: 
 error.message || "Internal Server Error" });
  }
};

exports.update = async function (req, res) {
  try {

    const medical_center_id = req.jwt.sub.medical_center_id;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No drug with id: ${id}`,
      });
    let drug = await Drug.findOne($and[{id: id}, {medical_center_id : medical_center_id}]);
    if (!drug) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: `No drug with id: ${id}` });
    }
    drug = {
      use_name: req.body.use_name || drug.use_name,
      drug_name: req.body.drug_name || drug.drug_name,
      manufacture: req.body.manufacture || drug.manufacture,
      strength: req.body.strength || drug.strength,
      type: req.body.type || drug.type
    };
      const updatedDrug = await Drug.findByIdAndUpdate(id, drug, {
        new: true,
      });
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Drug is updated successfully",
        data: updatedDrug,
      });
    
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
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
    Drug.findOneAndDelete({ _id: req.params.id }, function (error, user) {
      if (error) {
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
      .json({ code: 500, success: false, message: 
 error.message || "Internal Server Error" });
  }
};

