const jwt = require('jsonwebtoken');

module.exports = {
    getSecretKey: function () {
        return 'R892$rf3200';
    },
    getUserIdFromToken: function (token) {
        if (!token) {
            return false;
        } else {
            return jwt.verify(token, this.getSecretKey(), (err, decoded) => {
                if (err) {
                    return false;
                } else {
                    return decoded.id;
                }
            });
        }
    }
}
