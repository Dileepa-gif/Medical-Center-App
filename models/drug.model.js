var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var drugSchema = new Schema({
  use_name: {
    type: String,
    required: true,
  },
  drug_name: {
    type: String,
    required: true,
  },
  manufacture: {
    type: String,
    required: true,
  },
  strength: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
  medical_center_id: {
    type: Schema.Types.ObjectId,
    ref: "medicalcenters",
  },
});

const Drug = mongoose.model("Drug", drugSchema);
module.exports = Drug;
