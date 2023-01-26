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

