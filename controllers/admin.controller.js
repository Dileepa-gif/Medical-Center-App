const Admin = require("../models/admin.model");
const MedicalCenter = require("../models/medical_center.model");
const Prescription = require("../models/prescription.model");
const Drug = require("../models/drug.model");
const User = require("../models/user.model");
const Payment = require("../models/payment.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { adminPasswordSender } = require("../utils/emailService");

const userRole = require("../utils/userRoles");
const auth = require("../utils/auth");

//createSuperAdmin
exports.createSuperAdmin = async function (req, res) {
  try {
    const emailExist = await Admin.findOne({ email: req.body.email });
    if (emailExist)
      return res.status(200).json({
        code: 200,
        success: false,
        message: "Email already available",
      });

    const admin = new Admin({
      role: userRole.SUPERADMIN,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    var super_admin = await admin.save();
    const token = auth.issueJWTForAdmin(super_admin);

    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "Please check email",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

//createAdmin
exports.createAdmin = async function (req, res) {
  try {
    const emailExist = await Admin.findOne({ email: req.body.email });
    if (emailExist)
      return res.status(200).json({
        code: 200,
        success: false,
        message: "Email already available",
      });
    var random_password = Math.random().toString(36).slice(-8);
    const admin = new Admin({
      role: userRole.ADMIN,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: random_password,
    });

    var normal_admin = await admin.save();
    adminPasswordSender(normal_admin, random_password);
    const token = auth.issueJWTForAdmin(normal_admin);

    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "Please check email",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

exports.loginAdmin = async function (req, res) {
  try {
    const admin = await Admin.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!admin)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Admin not found" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });

    const token = auth.issueJWTForAdmin(admin);
    if (admin.is_verified == false)
      return res.status(200).json({
        code: 200,
        success: false,
        token: token,
        message: "This account not verified. Please check your email.",
      });
    res.status(200).json({
      code: 200,
      success: true,
      token: token,
      message: "logged in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

exports.logoutAdmin = async function (req, res) {
  try {
    let admin = await Admin.findById(req.jwt.sub._id);
    if (!admin) {
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: `No admin with id: ${id}`,
        });
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.jwt.sub._id,
      { $unset: { token: 1 } },
      { new: true }
    ).select("+token");
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Admin is logout successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.changePassword = async function (req, res) {
  try {
    const admin = await Admin.findById(req.params.id).select(
      "+password"
    );
    if (!admin)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Admin not found" });

    const validPassword = await bcrypt.compare(
      req.body.old_password,
      admin.password
    );

    if (!validPassword)
      return res
        .status(200)
        .json({ code: 200, success: false, message: "Invalid Password" });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.new_password, salt);
    const updatedMedicalCenter = await Admin.findByIdAndUpdate(
      req.params.id,
      { password : password },
      { new: true }
    );

    res.status(200).json({
      code: 200,
      success: true,
      message: "Password is changed in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};


exports.getAllAdmin = async function (req, res) {
  try {
    const admins = await Admin.find();
      return res.status(200).json({
        code: 200,
        success: true,
        admins : admins,
      });
  } catch (error) {
    res.status(500).json({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


exports.getNewRegistrations = async function (req, res) {
  try {

    const new_registrations = await MedicalCenter.find({
      $and: [
        { is_activated: false }
      ],
    });
    return res.status(200).json({
      code: 200, 
      status: true, 
      data : new_registrations
    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};


exports.registrationConfirmation = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Id is not valid`,
    });

    let medical_center = await MedicalCenter.findById(req.params.id);
    if (!medical_center) {
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: `No medical center with id: ${id}`,
        });
    }
    const updatedMedicalCenter = await MedicalCenter.findByIdAndUpdate(
      req.params.id,
      { is_production_mode : req.body.is_production_mode, it_service_charge : req.body.it_service_charge },
      { new: true }
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Medical center is confirmed successfully",
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


exports.activationOfAdmin = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Id is not valid`,
    });

    const admin = await Admin.findById(req.params.id);
    if (!admin || admin.role == userRole.SUPERADMIN) {
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: `There are no normal admin with id: ${req.params.id}`,
        });
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { status : admin.status ? false : true },
      { new: true }
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Medical center is confirmed successfully",
      data: updatedAdmin,
    });

  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
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
        $unwind: "$owner_details",
      },
      {
        $match: { "owner_details.role": "OWNER" },
      },
    ]).exec(async function (error, medical_centers) {
      if (error) {
        console.log(error);
        return res
          .status(200)
          .json({ code: 200, status: false, message: "Invalid Request!" });
      }
      var medical_centers_arr = [];
      var bar = new Promise((resolve, reject) => {

        medical_centers.forEach(async (medical_center) => {
          const medical_center_ = await MedicalCenter.findById(medical_center._id);
          medical_centers_arr.push({ ...medical_center, 
            completed_payment_for_IT_service : await medical_center_.completed_payment_for_IT_service,
            pending_payment_for_IT_service : await medical_center_.pending_payment_for_IT_service });
          resolve();
        });
      });

      bar.then(() => {
        return res
        .status(200)
        .json({ code: 200, status: true, data: medical_centers_arr });
      });

    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
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

    const exits_medical_center = await MedicalCenter.findById(req.params.id);
    if (exits_medical_center) {
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
          $match: { "owner_details.role" : "OWNER" },
        },
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.id) },
        },
      ]).exec(async function (error, medical_center) {
        if (error) {
          return res
            .status(200)
            .json({ code: 200, status: false, message: "Invalid Request!" });
        }
        const employees = await User.find({medical_center_id : medical_center[0]._id});
        const drugs_library_count = await Drug.count({medical_center_id : medical_center[0]._id}) || 0;
        const prescription_count = await Prescription.count({medical_center_id : medical_center[0]._id}) || 0;
        const completed_payment_for_IT_service = await exits_medical_center.completed_payment_for_IT_service || 0;
        const pending_payment_for_IT_service = await exits_medical_center.pending_payment_for_IT_service || 0;
        const patient_subscription = await exits_medical_center.patient_id.length || 0;
        return res.status(200).json({ code: 200, status: true, data : 
          {...medical_center, employees : employees, drugs_library_count : drugs_library_count, prescription_count : prescription_count, completed_payment_for_IT_service : completed_payment_for_IT_service, pending_payment_for_IT_service : pending_payment_for_IT_service, patient_subscription : patient_subscription} });
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


exports.updateMedicalCenter = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Id is not valid`,
    });

    let medical_center = await MedicalCenter.findById(req.params.id);
    if (!medical_center) {
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: `No medical center with id: ${id}`,
        });
    }
    const updatedMedicalCenter = await MedicalCenter.findByIdAndUpdate(
      req.params.id,
      { is_production_mode : req.body.is_production_mode, is_activated : req.body.is_activated, it_service_charge : req.body.it_service_charge },
      { new: true }
    );
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


exports.getMedicalCenterPaymentHistory = async function (req, res) {
  try {


    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Id is not valid`,
    });

    const payment_history = await Payment.find({
      $and: [
        { is_paid: true },
        { medical_center_id: req.params.id },
      ],
    });
    return res.status(200).json({
      code: 200, 
      status: true, 
      data : payment_history
    });
  } catch (error) {
    res
      .status(500)
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};







/*
exports.verifyOwner = async function (req, res) {
  try {
    const body = req.body;

    const owner = await User.findById(req.jwt.sub._id);
    if (!owner)
      return res.status(200).json({
        code: 200,
        success: false,
        message: "This account dose not exists",
      });
    if (owner.verification_pin != req.body.verification_pin)
      return res.status(200).json({
        code: 200,
        success: false,
        message: "This verification pin is not valid",
      });

    if (owner.is_verified == true)
      return res.status(200).json({
        code: 200,
        success: false,
        message: "This account's PIN already entered",
      });

    owner.is_verified = true;

    await owner.save();
    const token = auth.issueJWT(owner);

    res.status(200).json({
      code: 200,
      success: true,
      owner: owner,
      token: token,
      message: "Registered in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};



exports.validateToken = async function (req, res) {
  try {
    const user = await User.findById(req.jwt.sub._id);
    if (!user) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid user with this id`,
      });
    }
    if (req.jwt.exp > Date.now() / 1000) {
      return res.status(200).json({
        code: 200,
        success: true,
        message: `JWT token is not expired`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `Your login is expired. Please login again`,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};

exports.compleatOwnerRegistration = async function (req, res) {
  try {
    var medical_center = new MedicalCenter({
      name: req.body.name,
      address: req.body.address,
      user_id: req.jwt.sub._id,
      registration_number: req.body.registration_number,
    });
    var medical_center = await medical_center.save();
    var user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      medical_center_id: medical_center.id,
      is_completed: true,
    };
    user = await User.findByIdAndUpdate(req.jwt.sub._id, user, { new: true });
    const token = auth.issueJWT(user);
    res.status(200).json({
      code: 200,
      success: true,
      user: user,
      token: token,
      medical_center: medical_center,
      message: "Owner registration is completed",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
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
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
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
        message: error.message || "Internal Server Error",
      });
    });
};

exports.getUsersByMedicalCenter = async function (req, res) {
  try {
    const users = await User.find({medical_center_id : req.jwt.sub.medical_center_id});
    if (!users) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid users with this medical center`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: users,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
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
      user: user,
      data: "Please check your email to reset password.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
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
    user.password = req.body.password;
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
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};

exports.resetPassword = async function (req, res) {
  try {
    const user = await User.findById(req.jwt.sub._id).select("+password");
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

    user.password = req.body.new_password;
    await user.save();
    res.status(200).json({
      code: 200,
      success: true,
      data: "Password reset successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};

exports.addEmployee = async function (req, res) {
  try {
    if (req.jwt.sub.medical_center_id == null) {
      return res.status(200).json({
        code: 200,
        success: false,
        message:
          "Currently, You have not a medical center. Please complete your details.",
      });
    }
    var medical_center = await MedicalCenter.findById(
      req.jwt.sub.medical_center_id
    );
    if (!medical_center) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: "Medical center not found",
      });
    }

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: "Email already available",
        });
    var random_password = Math.random().toString(36).slice(-8);
    const user = new User({
      email: req.body.email,
      password: random_password,
      is_verified: true,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      medical_center_id: req.jwt.sub.medical_center_id,
      role: req.body.role.toUpperCase(),
      is_completed: true,
    });

    await user.save();
    medical_center.user_id.push(user._id);
    medical_center.save();
    employeePasswordSender(user, random_password);

    res.status(200).json({
      code: 200,
      success: true,
      message: "Employee is added successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};


exports.update = async function (req, res) {
  try {

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No user with id: ${id}`,
      });
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(200)
        .json({ code: 200, success: false, message: `No user with id: ${id}` });
    }else if(!user.is_completed){
      return res
      .status(200)
      .json({ code: 200, success: false, message: `Please complete your registration` });
    }
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist && !(emailExist.id == user.id))
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: "Email already available",
        });
    user = {
      first_name: req.body.first_name || user.first_name,
      last_name: req.body.last_name || user.last_name,
      email: req.body.email || user.email,
      phone_number: req.body.phone_number || user.phone_number,
      doctor_charge: req.body.doctor_charge || user.doctor_charge
    };
      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true,
      });
      return res.status(200).json({
        code: 200,
        success: true,
        message: "User is updated successfully",
        data: updatedUser,
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
    User.findOneAndDelete({ _id: req.params.id }, function (error, user) {
      if (error) {
        res
          .status(200)
          .json({ code: 200, success: false, message: "Unable to delete!" });
      }
      
      res.status(200).json({
        code: 200,
        success: true,
        message: "User is removed successfully!",
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};



exports.getAllDoctorsByMedicalCenterId = async function (req, res) {
  try {
    const users = await User.find({ $or:[ {role : "OWNER"}, {role : "DOCTOR"}], $and: [{medical_center_id: req.params.id}]});
    if (!users) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid doctors with this medical center`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        data: users,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};
*/
