const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
        select: false
    },
    phone_number: {
        type: String,
    },
    verification_pin: {
        type: String
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    password_reset_pin: {
        type: String
    },
    doctor_charge: {
        type: Number,
        default: 0,
    },
    medical_center_id: {
        type: Schema.Types.ObjectId,
        ref: 'medicalCenter'
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


const User = mongoose.model("user", userSchema);

module.exports = User; 