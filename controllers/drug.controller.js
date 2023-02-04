const Drug = require("../models/drug.model");
const User = require("../models/user.model");
const MedicalCenter = require("../models/medical_center.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userRole = require("../utils/userRoles");
const auth = require("../utils/auth");


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
    const medical_center = await MedicalCenter.findById(
      req.jwt.sub.medical_center_id
    );

    
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      is_verified: false,
      verification_pin: Math.floor(Math.random() * (9999 - 1000) + 1000),
      role: userRole.OWNER,
    });

    var owner = await user.save();
    ownerVerificationPinSender(owner);
    const token = auth.issueJWT(owner);

    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "Please check email",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

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
        message: "No medical center  found",
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
