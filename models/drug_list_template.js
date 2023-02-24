var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var drugListTemplateSchema = new Schema({
  template_name: {
    type: String,
    required: true,
  },
  doctor_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  medical_center_id: {
    type: Schema.Types.ObjectId,
    ref: "medicalcenters",
  },
  drug_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "drugs",
    },
  ],
});

const Drug = mongoose.model("DrugListTemplate", drugListTemplateSchema);
module.exports = Drug;
