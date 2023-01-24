const User = require("../models/user.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { ownerVerificationPinSender } = require("../utils/emailService");

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

    const owner = await User.findById(req.params.id)
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
        .json({ code: 200, success: false, message: "Invalid Email" });

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
    var user = await User.findById(req.params.id);

    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
    };

    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({
      code: 200,
      success: true,
      data: user,
      message: "Owner registration is completed",
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};


exports.getUserId = async function (req, res) {
  try {
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
        message: `User with this id is received`,
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
        message: "Users are received",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving User.",
      });
    });
};


// exports.forgotPassword = async function (req, res, next) {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(200)
//         .json({ code: 200, success: false, message: "User not found" });
//     }

//     const token = utils.generateAuthToken(user);

//     sendForgotEmail(token.token, user);
//     res.status(200).json({
//       code: 200,
//       success: true,
//       data: "Please check your email to reset password.",
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ code: 500, success: false, message: "Internal Server Error" });
//   }
// };

// exports.resetPassword = async function (req, res) {
//   try {
//     if (req.query.token) {
//       const tokenParts = req.query.token.split(" ");

//       if (
//         tokenParts[0] === "Bearer" &&
//         tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
//       ) {
//         try {
//           const verification = jwt.verify(
//             tokenParts[1],
//             process.env.ACCESS_TOKEN_SECRET
//           );
//           const user = await User.findOne({ email: verification.sub.email });
//           if (!user) {
//             return res.status(200).json({
//               code: 200,
//               success: false,
//               status: "Unauthorized",
//               msg: "Token is invalid. Please contact Administrator",
//             });
//           }
//           user.password = req.body.password;
//           await user.save();
//           const token = utils.generateAuthToken(user);
//           res.status(200).json({
//             code: 200,
//             success: true,
//             data: user,
//             token: token,
//             message: "Password reset successfully",
//           });
//         } catch (err) {
//           res.status(200).json({
//             code: 200,
//             success: false,
//             status: "Unauthorized1",
//             msg: "Can't reset your password. Please contact Administrator",
//           });
//         }
//       } else {
//         res.status(200).json({
//           code: 200,
//           success: false,
//           status: "Unauthorized2",
//           msg: "Can't reset your password. Please contact Administrator",
//         });
//       }
//     } else {
//       res.status(200).json({
//         code: 200,
//         success: false,
//         status: "TokenError",
//         msg: "Can't reset your password. Please contact Administrator",
//       });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ code: 500, success: false, message: "Internal Server Error" });
//   }
// };



