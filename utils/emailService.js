const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });


const senderEmail = 'bghostsproductions97@gmail.com';
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail,
    pass: 'yvhaxxgxpvhsapdb'
  }
});

exports.adminPasswordSender = async function (admin, random_password) {
  transport
    .sendMail({
      from: senderEmail,
      to: admin.email,
      subject: "Please use this password and email to login your account",
      html: `<h1><b>Please use this password and email to login your account</b></h1>

                <h5>Let's use this password and email to login your account</h5><br>
                <p><b>Email : </b>${admin.email}</p>
                <p><b>Password : </b>${random_password}</p><br>`,
    })
    .then(() => {
      console.log("Email Sent to " + admin.email + " to reset admin password.");
    })
    .catch(() => {
      console.log(
        "Email Not Sent to " + admin.email + " to reset admin password."
      );
    });
};

exports.ownerVerificationPinSender = async function (user) {
  transport
    .sendMail({
      from: senderEmail,
      to: user.email,
      subject: "Please use this pin number to validate your account",
      html: `<h1><b>Please use this PIN number to validate your account</b></h1>

                <h5>Let's use this PIN number to validate your account</h5><br>
                <p><b>Email : </b>${user.email}</p>
                <p><b>PIN : </b>${user.verification_pin}</p><br>`,
    })
    .then(() => {
      console.log("Email Sent to " + user.email + " to verify owner account.");
    })
    .catch(() => {
      console.log(
        "Email Not Sent to " + user.email + " to verify owner account."
      );
    });
};

exports.sendForgotEmail = async function (user, pin) {
  transport
    .sendMail({
      from: senderEmail,
      to: user.email,
      subject: "Please use this pin number to reset your password",
      html: `<h1><b>Please use this PIN number to reset your password</b></h1>

                <h5>Let's use this PIN number to reset your password</h5><br>
                <p><b>Email : </b>${user.email}</p>
                <p><b>PIN : </b>${pin}</p><br>`,
    })
    .then(() => {
      console.log("Email Sent to " + user.email + " to reset owner password.");
    })
    .catch(() => {
      console.log(
        "Email Not Sent to " + user.email + " to reset owner password."
      );
    });
};

exports.employeePasswordSender = async function (user, random_password) {
  transport
    .sendMail({
      from: senderEmail,
      to: user.email,
      subject: "Please use this password and email to login your account",
      html: `<h1><b>Please use this password and email to login your account</b></h1>

                <h5>Let's use this password and email to login your account</h5><br>
                <p><b>Email : </b>${user.email}</p>
                <p><b>Password : </b>${random_password}</p><br>`,
    })
    .then(() => {
      console.log("Email Sent to " + user.email + " to reset employee password.");
    })
    .catch(() => {
      console.log(
        "Email Not Sent to " + user.email + " to reset employee password."
      );
    });
};


exports.paymentReminder = async function (owner, medical_center, savedPayment) {
  transport
    .sendMail({
      from: senderEmail,
      to: owner.email,
      subject: "Reminder about the payment related to " + savedPayment.month,
      html: `<h1><b>`+ medical_center.name +`</b></h1>

            <p>You have to pay Rs.`+savedPayment.amount+` for the services received from us by the medical center for the `+savedPayment.month+`.</p>`,
    })
    .then(() => {
      console.log("Email Sent to " + owner.email + " to remind the payment.");
    })
    .catch(() => {
      console.log(
        "Email Not Sent to " + owner.email + " to remind the payment."
      );
    });
};

