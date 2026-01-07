import nodemailer from "nodemailer";
import config from "./../config/config";
import CustomError from "./custom-error";
import logger from "./logger";

const { SMTP_SERVICE, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = config;

interface Options {
  from?: string;
  email: string;
  subject?: string;
  html?: string;
  message: string;
}

const sendEmail = async (options: Options) => {
  const transporter = nodemailer.createTransport({
    service: SMTP_SERVICE,
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: "Sanctum",
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.response);
  } catch (error: any) {
    logger(JSON.stringify(`Email error: ${error}\n`));
    return new CustomError(
      500,
      `Email could not be sent${error?.message ? ": " + error.message : ""}`
    );
  }
};

export default sendEmail;
