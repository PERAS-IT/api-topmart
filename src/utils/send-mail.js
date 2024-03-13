const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASS_MAIL,
    },
  });
}

async function sendEmail(to, subject, text) {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.USER_MAIL,
      to: to,
      subject: subject,
      html: text,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

exports.sendEmail = sendEmail;
