const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const MedicalCenter = require("../models/medical_center.model");

var Schema = mongoose.Schema;

const userSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phone_number: {
    type: String,
  },
  verification_pin: {
    type: String,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  password_reset_pin: {
    type: String,
  },
  doctor_charge: {
    type: Number,
    default: 0,
  },
  is_completed: {
    type: Boolean,
    default: false,
  },
  medical_center_id: {
    type: Schema.Types.ObjectId,
    ref: "medicalcenters",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post("findOneAndDelete", async function(doc) {
  try {
    const userId = doc._id;
    if (doc.role == "OWNER") {
      console.log( doc._id)
      await MedicalCenter.deleteOne({ user_id: userId })
    } else {
      MedicalCenter.find({ user_id: { $in: [userId] } }).then(
        (medical_centers) => {
          Promise.all(
            medical_centers.map((medical_center) =>
              MedicalCenter.findOneAndUpdate(
                medical_center._id,
                { $pull: { user_id: userId } },
                { new: true }
              )
            )
          );
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});



const User = mongoose.model("User", userSchema);

module.exports = User;
