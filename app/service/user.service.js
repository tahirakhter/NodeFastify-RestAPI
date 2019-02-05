const User = require('../model/User');
const bcrypt = require('bcrypt');
const emailService = require('./email.service');

module.exports.signUp = (data) => {
    var user = new User(data);
    //password encryption
    user.password = bcrypt.hashSync(user.password, 10, (err, hash) => {
        if (err) {
            return {message: 'password encryption failed'};
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
        User.findOne({'email': data.email}, async (err, user) => {
            if (err) {
                reject(new Error('failed to resendPassword'));
            } else {
                try {
                    //send email to requester
                    let response = await  emailService.sendEmail({
                        to: user.email,
                        subject: 'Password Reset Request',
                        type: 'RESET_PASSWORD'
                    });
                    return response;
                } catch (e) {
                    reject(new Error('failed to send email!'));
                }
            }
        })
    })
}

module.exports.changePassword = (data) => {
    return new Promise((resolve, reject) => {
        User.findOne({'_id': data.id}, (err, user) => {
            if (err) {
                reject(new Error('failed to changePassword'));
            } else {
                user.password = bcrypt.hashSync(data.newPassword, 10);
                user.lastUpdated = Date.now();
                user.save((err, user2) => {
                    if (err) {
                        resolve(new Error('failed to changePassword'));
                    } else {
                        resolve({message: 'password changed successfully!'});
                    }
                });
            }
        })
    })
}