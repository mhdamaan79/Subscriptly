import nodemailer from "nodemailer";

import { EMAIL_PASSWORD } from "./env.js";

export const accountEmail = "axthetic7@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "axthetic7@gmail.com",
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
