import nodemailer from "nodemailer";

const sendEmail = async (userEmail, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to : userEmail,
    subject,
    text,
  }

  await transporter.sendMail(mailOptions)
   
}

export default sendEmail;
