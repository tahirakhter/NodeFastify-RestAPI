const boom = require('boom');
const {getUserSession, logout, logoutAllDevices, authenticateUser} = require('../service/auth.service');

module.exports.getUserSession = async (req, reply) => {
    try {
        let response = await getUserSession(req.headers.token);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

module.exports.logout = async (req, reply) => {
    try {
        let response = await logout(req.headers.token);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

module.exports.logoutAllDevices = async (req, reply) => {
    try {
        let response = await logoutAllDevices(req.headers.token);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

module.exports.authenticateUser = async (req, reply) => {
    try {
        let response = await authenticateUser(req);
        return response;
    }
    catch (e) {
        throw boom.boomify(e);
    }
}