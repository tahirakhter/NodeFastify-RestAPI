const nodemailer = require('nodemailer');

const emailContent = {
    RESET_PASSWORD: '<a href="">Click to Change your password</a>',
}

//configure email to send
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'test@gmail.com',
        pass: 'testPass'
    }, tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    sendEmail: function (data) {
        if (data) {
            const mailOptions = {
                from: 'test@gmail.com', // sender email
                to: data.to, // receiver email
                subject: data.subject,
                html: emailContent[data.type]
            }
            //sending email
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    return 'failed to send email!';
                }
                else {
                    console.log(info);
                    return 'user password change request emailed successfully!';
                }
            });
        }
    }
}