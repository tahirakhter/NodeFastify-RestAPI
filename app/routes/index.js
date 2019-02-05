// Import our Controllers
const {signUp, changePassword, resetPassword} = require('../controller/user.controller');
const {authenticateUser, getUserSession, logout, logoutAllDevices} = require('../controller/auth.controller');
const {addTodo, updateTodo, deleteTodo, getAllTodoList, getTodoListByUserId} = require('../controller/todo.controller');

module.exports = routes = [
    {
        method: 'POST',
        url: '/api/signUp',
        handler: signUp
    },
    {
        method: 'POST',
        url: '/api/login',
        handler: authenticateUser
    },
    {
        method: 'GET',
        url: '/api/getUserSession',
        handler: getUserSession
    },
    {
        method: 'POST',
        url: '/api/logout',
        handler: logout
    },
    {
        method: 'POST',
        url: '/api/logoutAllDevices',
        handler: logoutAllDevices
    },
    {
        method: 'PUT',
        url: '/api/user/changePassword',
        handler: changePassword
    },
    {
        method: 'POST',
        url: '/api/user/resetPassword',
        handler: resetPassword
    },
    {
        method: 'POST',
        url: '/api/todo',
        handler: addTodo
    },
    {
        method: 'PUT',
        url: '/api/todo/:id',
        handler: updateTodo
    },
    {
        method: 'DELETE',
        url: '/api/todo/:id',
        handler: deleteTodo
    },
    {
        method:'GET',
        url:'/api/todo',
        handler:getAllTodoList
    },
    {
        method:'GET',
        url:'/api/todo/:id',
        handler:getTodoListByUserId
    }
]