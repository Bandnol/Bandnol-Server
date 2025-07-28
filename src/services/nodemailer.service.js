import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createInquiry } from "../repositories/users.repository.js";
import { InvalidEmailTypeError } from "../errors.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.ADMIN_USER_EMAIL,
    pass: process.env.ADMIN_USER_PASSWORD
  }
});

export const sendEmail = async (userName, userEmail, text) => {
  const recepients = [userEmail, process.env.ADMIN_USER_EMAIL];
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(userEmail)) {
    throw new InvalidEmailTypeError("올바르지 않은 이메일 형식입니다.");
  }

  const mailOptions = {
    from: process.env.ADMIN_USER_EMAIL,
    to: recepients,
    subject: `${userName}님의 문의`,
    text: `${userName}(${userEmail})로부터 전송된 문의내용입니다.\n\n${text}`,
  };
  
  try{
    await transporter.sendMail(mailOptions);

    const inquiryId = await createInquiry( userName, userEmail, text );
    return {id: inquiryId};
  } catch (err) {
    console.error("Nodemailer 요청 실패:",  err.response?.data || err.message);
    throw new Error(`이메일 전송 실패: ${err.message}`);
  }
};