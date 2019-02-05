const boom = require('boom');
const {signUp, resetPassword, changePassword} = require('../service/user.service');

module.exports.signUp = async (req, reply) => {
    try {
        let response = await signUp(req.body);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}


module.exports.resetPassword = async (req, reply) => {
    try {
        let response = await resetPassword(req.body);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

module.exports.changePassword = async (req, reply) => {
    try {
        let response = await changePassword(req.body);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}