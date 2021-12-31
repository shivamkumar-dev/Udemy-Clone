const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  // host: process.env.EMAIL_HOST,
  // port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: options.from,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
