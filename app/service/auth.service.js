const User = require('../model/User');
const UserLogin = require('../model/UserLogin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/secret');

module.exports.getUserSession = async (token) => {
    let user = await config.getUserIdFromToken(token);
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

}
module.exports.logout = async (token) => {
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
    let userId = await config.getUserIdFromToken(token);
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
module.exports.authenticateToken = async (req, res, next) => {
    let token = req.headers.token;

    //check if token exist in DB
    let ifTokenExist = await UserLogin.findOne({'token': token});
    if (ifTokenExist) {
        //authenticate token
        jwt.verify(token, config.getSecretKey(), async (err, decoded) => {
            if (err) {
                //update token status
                let userLogin = new UserLogin(ifTokenExist);
                userLogin.status = false;
                userLogin.save((err, userLogin) => {
                    if (err) {
                        return res.status(500).send({auth: false, message: 'token expired!'});
                    } else {
                        return res.status(200).send({auth: false,message: 'failed to authenticate with expired token!'});
                    }
                });
            } else {
                return next();
            }
        });
    } else {
        return res.status(401).send({auth: false, message: 'token not found.'});
    }
}
module.exports.authenticateUser = async (data) => {
    return new Promise((resolve, reject) => {
        let os = data.headers['user-agent'];
        User.findOne({'userName': data.body.userName}, (err, user) => {
            if (err) {
                resolve({message: 'incorrect userName!'});
            } else {
                if (bcrypt.compareSync(data.body.password, user.password)) {
                    let token = jwt.sign({id: user._id}, config.getSecretKey(), {
                        expiresIn: 3600 // expires in 1 hour
                    });
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