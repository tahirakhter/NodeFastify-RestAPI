// Import our Controllers
const {signUp} = require('../controller/userController');

module.exports = routes = [
    {
        method: 'POST',
        url: '/api/signUp',
        handler: signUp
    }
]