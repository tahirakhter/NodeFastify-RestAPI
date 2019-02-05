const nodemailer = require('nodemailer');

const emailContent = {
    RESET_PASSWORD: '<a href="">Click to Change your password</a>',
}

//configure email to send
var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }, tls: {
        rejectUnauthorized: false
    }
});
module.exports.sendEmail = async (data) => {
    if (data) {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: process.env.EMAIL_USER, // sender email
                to: data.to, // receiver email
                subject: data.subject,
                html: emailContent[data.type]
            }

            //sending email
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(new Error('failed to send email!'));
                }
                else {
                    resolve({message: 'email has been sent successfully!'});
                }
            });
        })
    }
}