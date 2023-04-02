const User = require("../models/user.model");
const MedicalCenter = require("../models/medical_center.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userRole = require("../utils/userRoles");
const auth = require("../utils/auth");

exports.getMedicalCenterById = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `Id is not valid`,
      });

    const medical_center = await MedicalCenter.findById(req.params.id);
    if (medical_center) {
      MedicalCenter.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "owner_details",
          },
        },
        {
          $unwind: '$owner_details' 
        },
        {
          $match: { "owner_details.role": "OWNER" },
        },
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.id) },
        },
      ]).exec(function (error, data) {
        if (error) {
          return res
            .status(200)
            .json({ code: 200, status: false, message: "Invalid Request!" });
        }

        return res.status(200).json({ code: 200, status: true, data: data });
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: false,
        message: "No medical center not found",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: 
 error.message || "Internal Server Error" });
  }
};

exports.getAllMedicalCenters = async function (req, res) {
  try {
    MedicalCenter.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "owner_details",
        },
      },
      {
        $unwind: '$owner_details' 
      },
      {
        $match: { "owner_details.role": "OWNER" },
      },
    ]).exec(function (error, medical_centers) {
      if (error) {
        return res
          .status(200)
          .json({ code: 200, status: false, message: "Invalid Request!" });
      }

      return res
        .status(200)
        .json({ code: 200, status: true, data: medical_centers });
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};

exports.update = async function (req, res) {
  try {

    const id = req.jwt.sub.medical_center_id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No medical center with id: ${id}`,
      });
    let medical_center = await MedicalCenter.findById(id);
    if (!medical_center) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: `No medical center with id: ${id}` });
    }
    medical_center = {
      name: req.body.name || medical_center.name,
      address: req.body.address || medical_center.address,
      service_charge: req.body.service_charge || medical_center.service_charge
    };
      const updatedMedicalCenter = await MedicalCenter.findByIdAndUpdate(id, medical_center, {
        new: true,
      });
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Medical center is updated successfully",
        data: updatedMedicalCenter,
      });
    
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


