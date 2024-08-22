const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

const sendWelcomeEmail = async (to, subject, text,pathOrder) => {
  const mailOptions = {
    from: 'anikvohra3@gmail.com',
    to,
    subject,
    text,
    attachments: [
      {
        filename: pathOrder ? path.basename(pathOrder) :'images.png',
        path: pathOrder ? pathOrder :path.join(__dirname, '../../public/temp/images.png'),
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};

module.exports = { sendWelcomeEmail };
