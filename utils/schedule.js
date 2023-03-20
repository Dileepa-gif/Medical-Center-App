const schedule = require("node-schedule");
const User = require("../models/user.model");
const MedicalCenter = require("../models/medical_center.model");
const Payment = require("../models/payment.model");
const date = require("../utils/date");
require("dotenv").config({ path: "../.env" });

const {paymentReminder} = require("./emailService");

exports.schedulePayment = async function () {
  const schedulePayment = schedule.scheduleJob(
    process.env.SCHEDULE_PATTERN || "1 0 0 25 * *",
    async function () {
      const medical_centers = await MedicalCenter.find();
      medical_centers.forEach(async (medical_center) => {

        const owner = await User.findOne({
            $and: [
              { medical_center_id: medical_center.id },
              { role: "OWNER" }
            ],
          });
        const payment = new Payment({
          amount: medical_center.it_service_charge,
          month: date.year_month,
          medical_center_id: medical_center.id,
        });
        var savedPayment = await payment.save();
        
        await paymentReminder(owner, medical_center, savedPayment);
      });
    }
  );
  return schedulePayment;
};
