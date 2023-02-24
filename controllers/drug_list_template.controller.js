const DrugListTemplate = require("../models/drug_list_template");
const mongoose = require("mongoose");



exports.create = async function (req, res) {
  try {
    const drugListTemplateExist = await DrugListTemplate.findOne({$and: [{template_name : req.body.template_name}, {doctor_id: req.jwt.sub._id}, {medical_center_id: req.jwt.sub.medical_center_id}]});
    if (drugListTemplateExist)
      return res
        .status(200)
        .json({
          code: 200,
          success: false,
          message: "Drug list templateExist already available",
        });

    const drugListTemplate = new DrugListTemplate({
      template_name: req.body.template_name,
      doctor_id: req.jwt.sub._id,
      medical_center_id: req.jwt.sub.medical_center_id,
      drug_id: req.body.drug_id
    });

    var savedDrugListTemplate = await drugListTemplate.save();
    res.status(200).json({
      code: 200,
      success: true,
      drug: savedDrugListTemplate,
      message: "Created in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: error.message || "Internal Server Error" });
  }
};


exports.getDrugListTemplateById = async function (req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(200).json({
          code: 200,
          success: false,
          message: `Id is not valid`,
        });
  
      const drug_list_template = await DrugListTemplate.findById(req.params.id);
      if (drug_list_template) {
        DrugListTemplate.aggregate([
          {
            $lookup: {
              from: "drugs",
              localField: "drug_id",
              foreignField: "_id",
              as: "drugs",
            },
          },
          {
            $match: { _id: mongoose.Types.ObjectId(req.params.id) },
          },
        ]).exec(function (error, drug_list_template) {
          if (error) {
            return res
              .status(200)
              .json({ code: 200, status: false, message: "Invalid Request!" });
          }
  
          return res.status(200).json({ code: 200, status: true, drug_list_template: drug_list_template });
        });
      } else {
        return res.status(200).json({
          code: 200,
          success: false,
          message: "No medical center not found",
        });
      }
    } catch (error) {
      res.status(500).json({ code: 500, success: false, message: error.message || "Internal Server Error" });
    }
  };


exports.getDrugListTemplatesByDoctor = async function (req, res) {
  try {
    console.log(req.jwt.sub._id)
    const drug_list_templates = await DrugListTemplate.findOne({ $and: [{doctor_id: req.jwt.sub._id}, {medical_center_id: req.jwt.sub.medical_center_id}]});
    if (!drug_list_templates) {
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No valid drug list template with you`,
      });
    } else {
      return res.status(200).json({
        code: 200,
        success: true,
        drug_list_templates: drug_list_templates,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message: 
 error.message || "Internal Server Error" });
  }
};

// exports.update = async function (req, res) {
//   try {

//     const medical_center_id = req.jwt.sub.medical_center_id;
//     const id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id))
//       return res.status(200).json({
//         code: 200,
//         success: false,
//         message: `No drug with id: ${id}`,
//       });
//   let drug = await Drug.findOne({_id: id});
//     if ((!drug) || (drug.medical_center_id != medical_center_id)) {
//       return res
//         .status(200)
//         .json({ code: 200, success: false, message: `No drug with id: ${id}` });
//     }
//     drug = {
//       use_name: req.body.use_name || drug.use_name,
//       drug_name: req.body.drug_name || drug.drug_name,
//       manufacture: req.body.manufacture || drug.manufacture,
//       strength: req.body.strength || drug.strength,
//       type: req.body.type || drug.type
//     };
//       const updatedDrug = await Drug.findByIdAndUpdate(id, drug, {
//         new: true,
//       });
//       return res.status(200).json({
//         code: 200,
//         success: true,
//         message: "Drug is updated successfully",
//         data: updatedDrug,
//       });
    
//   } catch (error) {
//     res.status(500).send({
//       code: 500,
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

// exports.delete = function (req, res) {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(200).json({
//       code: 200,
//       success: false,
//       message: `Id is not valid`,
//     });
//     Drug.findOneAndDelete({ _id: req.params.id }, function (error, user) {
//       if (error) {
//         res
//           .status(200)
//           .json({ code: 200, success: false, message: "Unable to delete!" });
//       }
      
//       res.status(200).json({
//         code: 200,
//         success: true,
//         message: "Drug removed successfully!",
//       });
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ code: 500, success: false, message: 
//  error.message || "Internal Server Error" });
//   }
// };

