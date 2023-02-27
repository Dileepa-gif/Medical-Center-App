const DrugListTemplate = require("../models/prescription.model");
const mongoose = require("mongoose");

exports.create = async function (req, res) {
  try {
    const drugListTemplateExist = await DrugListTemplate.findOne({
      $and: [
        { template_name: req.body.template_name },
        { doctor_id: req.jwt.sub._id },
        { medical_center_id: req.jwt.sub.medical_center_id },
      ],
    });
    if (drugListTemplateExist)
      return res.status(200).json({
        code: 200,
        success: false,
        message: "Drug list template already available",
      });

    const drugListTemplate = new DrugListTemplate({
      template_name: req.body.template_name,
      doctor_id: req.jwt.sub._id,
      medical_center_id: req.jwt.sub.medical_center_id,
      drug_list: req.body.drug_list,
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
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
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

    const drug_list_template = await DrugListTemplate.findById(req.params.id).populate({ 
      path: 'drug_list',
      populate: {
        path: 'drug',
        model: 'Drug'
      } 
   });

   return res
   .status(200)
   .json({
     code: 200,
     status: true,
     drug_list_template: drug_list_template,
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

exports.getDrugListTemplatesByDoctor = async function (req, res) {
  try {
    const drug_list_templates = await DrugListTemplate.find({
      $and: [
        { doctor_id: req.jwt.sub._id },
        { medical_center_id: req.jwt.sub.medical_center_id },
      ],
    }).populate({ 
      path: 'drug_list',
      populate: {
        path: 'drug',
        model: 'Drug'
      } 
   });
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
      .json({
        code: 500,
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};

exports.update = async function (req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(200).json({
        code: 200,
        success: false,
        message: `No drug list template with id: ${id}`,
      });

    const drugListTemplateExist = await DrugListTemplate.findOne({
      $and: [
        { template_name: req.body.template_name },
        { doctor_id: req.jwt.sub._id },
        { medical_center_id: req.jwt.sub.medical_center_id },
      ],
    });
    if (drugListTemplateExist && (!(drugListTemplateExist.id == id)))
      return res.status(200).json({
        code: 200,
        success: false,
        message: "Drug list template already available",
      });
    let drug_list_template = await DrugListTemplate.findOne({ _id: id });

    drug_list_template = {
      template_name: req.body.template_name || drug_list_template.template_name,
    };
    const updatedDrugListTemplate = await DrugListTemplate.findByIdAndUpdate(id, drug_list_template, {
      new: true,
    });
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Drug list template is updated successfully",
      data: updatedDrugListTemplate,
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
    DrugListTemplate.findOneAndDelete({ _id: req.params.id }, function (error, user) {
      if (error) {
        res
          .status(200)
          .json({ code: 200, success: false, message: "Unable to delete!" });
      }

      res.status(200).json({
        code: 200,
        success: true,
        message: "Drug list template removed successfully!",
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message:
 error.message || "Internal Server Error" });
  }
};

exports.deleteDrugs = async function (req, res) {
  try {
    let drug_list_template = await DrugListTemplate.findOne({ _id: req.params.id });
    if (!drug_list_template)
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Drug list template is not found`,
    });
    var drug_id_arr = req.body.drug_id_arr;
    drug_id_arr.map(async id => {

      updatedDrugListTemplate = await DrugListTemplate.findByIdAndUpdate(
        {_id : req.params.id},
        { $pull: { drug_list: { _id: id } } },
        { new: true }
      )
    });
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Drug list template is updated successfully"
    });
   
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message:
 error.message || "Internal Server Error" });
  }
};

exports.addDrugs = async function (req, res) {
  try {
    let drug_list_template = await DrugListTemplate.findOne({ _id: req.params.id });
    if (!drug_list_template)
    return res.status(200).json({
      code: 200,
      success: false,
      message: `Drug list template is not found`,
    });
    const updatedDrugListTemplate = await DrugListTemplate.findByIdAndUpdate(
      {_id : req.params.id},
      { $push: { drug_list: req.body.drug_list } },
      { new: true }
    )
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Drug list template is updated successfully",
      data: updatedDrugListTemplate,
    });
   
  } catch (error) {
    res
      .status(500)
      .json({ code: 500, success: false, message:
 error.message || "Internal Server Error" });
  }
};