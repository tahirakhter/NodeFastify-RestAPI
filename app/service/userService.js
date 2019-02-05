const User = require('../model/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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

module.exports.signUp = (data) => {
    var user = new User(data);
    //password encryption
    user.password = bcrypt.hashSync(user.password, 10, function (err, hash) {
        if (err) {
            return 'password encryption failed';
        } else {
            hash;
        }
    });

    return new Promise((resolve, reject) => {
        user.save((err, user) => {
            if (err) {
                reject(new Error('failed to create user'));
            } else {
                delete user._doc['password'];
                delete user._doc['_id'];
                resolve(user);
            }
        });
    })

}

module.exports.resetPassword = (data) => {
    return new Promise((resolve, reject) => {
        User.findOne({'email': data.email}).then((response) => {
            if (response) {
                const mailOptions = {
                    from: 'test@gmail.com', // sender email
                    to: response.email, // receiver email
                    subject: 'New Password Change Request',
                    html: '<a href="">Click to Change your password</a>'
                };

                //sending email
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        //resolve(new Error('failed to send email!'));
                        reject(new Error('failed to send email!'));
                    }
                    else {
                        console.log(info);
                        resolve('user password change request emailed successfully!');
                    }
                });
            } else {
                reject(new Error('failed to resendPassword'));
            }
        })
    })
}

module.exports.changePassword = (data) => {
    return new Promise((resolve, reject) => {
        User.findOne({'_id': data.userId}, (err, user) => {
            if (err) {
                reject(new Error('failed to changePassword'));
            } else {
                user.password = bcrypt.hashSync(data.newPassword, 10);
                user.lastUpdated = Date.now();
                user.save((err, user2) => {
                    if (err) {
                        resolve(new Error('failed to changePassword'));
                    } else {
                        resolve('password changed successfully!');
                    }
                });
            }
        })
    })
}