const boom = require('boom');
const {signUp} = require('../service/userService');

module.exports.signUp = async (req, res) => {
    try {
        let response = await signUp(req.body);
       return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}


module.exports.resetPassword = async (req, res) => {
    try {
        let response = await resetPassword(req.body);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        let response = await changePassword(req.body);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}