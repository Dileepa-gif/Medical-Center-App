const Admin = require("../models/admin.model");
const utils = require("../lib/utils");
const jsonwebtoken = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {loginValidate } = require("../validation");

exports.login = async function (req, res) {
  try {

    const { error } = loginValidate(req.body);
    if (error)
      return res.status(200).json({
        code: 200,
        success: false,
        message: error.details[0].message,
      });

    const admin = await Admin.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!admin)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Email" });
    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });
    const token = utils.generateAdminAuthToken(admin);
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
