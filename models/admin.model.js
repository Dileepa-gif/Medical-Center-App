const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

const adminSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
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
  token:{
    type: String,
    select: false,
  }
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



// generate token
adminSchema.methods.generateToken=function(token,cb){
  var admin =this;
  admin.token=token;
  admin.save(function(err,admin){
      if(err) return cb(err);
      cb(null,admin);
  })
}

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
