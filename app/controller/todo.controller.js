const boom = require('boom');
const {addTodo, updateTodo, deleteTodo, getAllTodoList, getTodoListByUserId, getThirdPartyUsersList} = require('../service/todo.service');

//add todoItem
module.exports.addTodo = async (req, reply) => {
    try {
        let response = await addTodo(req);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

//update by todoId
module.exports.updateTodo = async (req, reply) => {
    try {
        let response = await updateTodo(req);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

//delete by todoId
module.exports.deleteTodo = async (req, reply) => {
    try {
        let response = await deleteTodo(req);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

//get all todoItems
module.exports.getAllTodoList = async (req, reply) => {
    try {
        let response = await getAllTodoList(req);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}

//get todoItem by UserId
module.exports.getTodoListByUserId = async (req, reply) => {
    try {
        let response = await getTodoListByUserId(req);
        return response;
    } catch (e) {
        throw boom.boomify(e);
    }
}