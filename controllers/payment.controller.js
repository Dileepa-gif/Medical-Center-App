const Payment = require("../models/payment.model");
const mongoose = require("mongoose");
const date = require("../utils/date");

exports.getPaymentsByMedicalCenter = async function (req, res) {
  try {
    Payment.aggregate([
      {
        $match: {
          $and: [
            {
              medical_center_id: mongoose.Types.ObjectId(
                req.jwt.sub.medical_center_id
              ),
            },
            { is_paid: false },
          ],
        },
      },
      {
        $group: {
          _id: { medical_center_id: "$medical_center_id" },
          total_payment: { $sum: "$amount" },
        },
      },
    ]).exec(async function (error, total_payment) {
      if (error) {
        return res
          .status(200)
          .json({ code: 200, status: false, message: "Invalid Request!" });
      }

      const payments = await Payment.find({
        $and: [{ medical_center_id: req.jwt.sub.medical_center_id }],
      }).populate({
        path: "user_id",
        model: "User",
      });
      return res
        .status(200)
        .json({
          code: 200,
          status: true,
          total_payment: total_payment,
          payments: payments,
        });
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.completePayment = async function (req, res) {
  try {
    let payment = {
      is_paid: true,
      paid_date: date.date,
      user_id: req.jwt.sub._id,
    };
    const savedPayments = await Payment.updateMany(
      {
        $and: [
          { medical_center_id: req.jwt.sub.medical_center_id },
          { is_paid: false },
        ],
      },
      payment
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Payments are completed successfully",
      modifiedCount: savedPayments.modifiedCount || 0,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
