const nodemailer = require('nodemailer');
// const config = require('./../../config/mailer.config.json');

// let mailer =  nodemailer.createTransport(config);
let mailer = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

mailer.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

module.exports = {
  send(mailOptions) {
    return mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log('Message sent:', info.messageId);
    });
  },
};
