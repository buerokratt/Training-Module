import nodemailer from "nodemailer";

// NOTE: This service is only for testing purposes. Needs to be replaced with actual mail service.

const sendMockEmail = async (to, subject, text) => {
  console.log(to, subject, text);
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: testAccount.user,
    to,
    subject,
    text,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return "Preview URL: " + nodemailer.getTestMessageUrl(info);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

export default sendMockEmail;
