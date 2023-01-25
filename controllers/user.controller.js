const User = require("../models/user.model");
const MedicalCenter = require("../models/medical_center.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { ownerVerificationPinSender, sendForgotEmail } = require("../utils/emailService");

const userRole = require("../utils/userRoles");
const auth = require("../utils/auth");

//owner
exports.createOwner = async function (req, res) {
  try {
    const body = req.body;

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
      return res
        .status(200)
        .json({ code: 200, success: true, message: "Email already available" });

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      is_verified:false,
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

// owner
exports.verifyOwner = async function (req, res) {
  try {
    const body = req.body;

    const owner = await User.findById(req.jwt.sub.id)
    if (!owner)
      return res
        .status(200)
        .json({ code: 200, success: true, message: "This account dose not exists" });
    if (owner.verification_pin != req.body.verification_pin)
      return res
        .status(200)
        .json({ code: 200, success: true, message: "This verification pin is not valid" });
    
    if (owner.is_verified == true)
      return res
        .status(200)
        .json({ code: 200, success: true, message: "This account's PIN already entered"});

    owner.is_verified = true;

    await owner.save();
    const token = auth.issueJWT(owner);
    
    res.status(200).json({
      code: 200,
      success: true,
      owner : owner,
      token: token,
      message: "Registered in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};




exports.loginUser = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "User not found" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });
    
    const token = auth.issueJWT(user);
    if (user.is_verified == false)
    return res
      .status(200)
      .json({ code: 200, success: true, token: token, message: "This account not verified. Please check your email."});
    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "logged in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};


exports.compleatOwnerRegistration = async function (req, res) {
  try {
    var user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
    };

    user = await User.findByIdAndUpdate(req.jwt.sub.id, user, { new: true });

    var medical_center = new MedicalCenter({
      name : req.body.name,
      address : req.body.address,
      user_id : "63cf61336423df0fefaaff87",
      registration_number : req.body.registration_number
    });
    var medical_center = await medical_center.save();
    res.status(200).json({
      code: 200,
      success: true,
      user: user,
      medical_center : medical_center,
      message: "Owner registration is completed",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};


exports.getUserById = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Id is not valid`,
    });

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid user with this id`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.getAllUsers = async function (req, res) {
  User.find()
    .then((data) => {
      return res.status(200).json({
        code: 200,
        success: true,
        data: data,
      });
    })
    .catch((error) => {
      res.status(500).send({
        code: 500,
        success: false,
        message: "Internal Server Error",
      });
    });
};


exports.forgotPassword = async function (req, res, next) {
  
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "User not found" });
    }

    const pin = Math.floor(Math.random() * (9999 - 1000) + 1000);
    user.password_reset_pin = pin;
    await user.save();
    sendForgotEmail(user, pin);
    res.status(200).json({
      code: 200,
      success: true,
      user:user,
      data: "Please check your email to reset password.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

exports.resetForgotPassword = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "User not found" });
    }

    if (req.body.password_reset_pin != user.password_reset_pin) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Wrong PIN number" });
    }
    user.password= req.body.password;
    await user.save();
    const token = auth.issueJWT(user);
    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      data: "Password reset successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};


exports.resetPassword = async function (req, res) {
  try {
    const user = await User.findById(req.jwt.sub.id).select("+password");
    if (!user) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: "User not found" });
    }
    const validPassword = await bcrypt.compare(
      req.body.old_password,
      user.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Old Password" });

    user.password= req.body.new_password;
    await user.save();
    res.status(200).json({
      code: 200,
      success: true,
      data: "Password reset successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};


