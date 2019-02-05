const User = require('../model/User');
const UserLogin = require('../model/UserLogin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utility = require('./utility.service');

module.exports.getUserSession = async (token) => {
    let ifTokenExist = await UserLogin.findOne({'token': token, status: true});
    if (ifTokenExist) {
        let user = await utility.getUserIdFromToken(token);
        if (user) {
            return new Promise((resolve, reject) => {
                //PROJECTION => hiding password and id before sending it
                User.findById(user, {password: 0, _id: 0}, (err, user) => {
                    if (err) {
                        reject(new Error('user not found!'));
                    } else {
                        resolve(user);
                    }
                })
            })
        } else {
            return Promise.reject(new Error('failed to authenticate token'));
        }
    } else {
        return Promise.reject(new Error('token not found.'));
    }
}
module.exports.logout = (token) => {
    return new Promise((resolve, reject) => {
        UserLogin.deleteOne({'token': token}, (err, user) => {
            if (err) {
                reject(new Error('Server Error Unable to Logout'));
            } else {
                resolve({auth: false, token: null, message: 'logout successfully!'});
            }
        })
    })
}
module.exports.logoutAllDevices = async (token) => {
    let userId = await utility.getUserIdFromToken(token);
    return new Promise((resolve, reject) => {
        UserLogin.deleteMany({'userId': userId}, (err, user) => {
            if (err) {
                reject(new Error('server error unable to logout all devices'));
            } else {
                resolve({auth: false, token: null, message: 'all devices logout successfully!'});
            }
        })
    })
}
module.exports.authenticateUser = (data) => {
    return new Promise((resolve, reject) => {
        let os = data.headers['user-agent'];
        User.findOne({'userName': data.body.userName}, (err, user) => {
            if (err) {
                resolve({message: 'incorrect userName!'});
            } else {
                if (bcrypt.compareSync(data.body.password, user.password)) {

                    //generate new token
                    let token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
                        expiresIn: 3600 // expires in 1 hour
                    });

                    //check if user already have active token
                    UserLogin.findOne({'userId': user._id, 'status': true, 'os': os}).then((response) => {
                        if (!response) {
                            let obj = {
                                userId: user._id.toString(),
                                token: token,
                                deviceAddress: '',
                                lat: '',
                                long: '',
                                os: os,
                                idAddress: ''
                            }
                            let userLogin = new UserLogin(obj);
                            userLogin.save((err, userLogin) => {
                                if (err) {
                                    reject(new Error('login failed!'));
                                } else {
                                    resolve({auth: true, token: userLogin.token});
                                }
                            });
                        } else {
                            resolve({auth: true, token: response.token});
                        }
                    })
                } else {
                    resolve({message: 'incorrect password'});
                }
            }
        })
    })
}