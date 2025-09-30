import nodemailer from "nodemailer";
import { ApiError } from "./apiError.js";
import messages from "../config/messages.js";
import config from "../config/settings.js";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: config.ETHEREAL_USERNAME,
    pass: config.ETHEREAL_PASSWORD,
  },
});

export async function sendEmail(to, subject, html) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(messages.EMAIL_FAILED, 500);
  }
}
