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
          $match: { "owner_details.role": "OWNER" },
        },
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.id) },
        },
      ]).exec(function (err, data) {
        if (err) {
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
      .json({ code: 500, success: false, message: "Internal Server Error" });
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
        $match: { "owner_details.role": "OWNER" },
      },
    ]).exec(function (err, medical_centers) {
      if (err) {
        return res
          .status(200)
          .json({ code: 200, status: false, message: "Invalid Request!" });
      }

      return res
        .status(200)
        .json({ code: 200, status: true, data: medical_centers });
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};


