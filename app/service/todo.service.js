const Todo = require('../model/Todo');
const utility = require('./utility.service');

module.exports.addTodo = async (data) => {
    let todo = new Todo(data.body);
    let valid = await utility.getUserIdFromToken(data.headers.token);
    if (valid) {
        todo.userId = valid;
        return new Promise((resolve, reject) => {
            todo.save((err, todo) => {
                if (err) {
                    reject(new Error('failed to add todo'));
                } else {
                    resolve({data: todo.task, message: 'added successfully!'});
                }
            });
        })
    } else {
        return Promise.reject(new Error('failed to authenticate token'));
    }
}

module.exports.updateTodo = (data) => {
    return new Promise((resolve, reject) => {
        Todo.findByIdAndUpdate(data.params.id, {$set: data.body}, (err, todo) => {
            if (err) {
                reject(new Error('failed to update'));
            } else {
                resolve({message: 'updated successfully!'});
            }
        })
    })
}

module.exports.deleteTodo = (data) => {
    return new Promise((resolve, reject) => {
        Todo.findByIdAndRemove(data.params.id, (err, todo) => {
            if (err) {
                reject(new Error('failed to delete'));
            } else {
                resolve({message: 'deleted successfully!'});
            }
        })
    })
}

module.exports.getAllTodoList = (data) => {
    return new Promise((resolve, reject) => {
        Todo.find({}, (err, todos) => {
            if (err) {
                reject(new Error('failed to get todos'));
            } else {
                resolve(todos);
            }
        })
    })
}

module.exports.getTodoListByUserId = (data) => {
    return new Promise((resolve, reject) => {
        Todo.find({'userId': data.params.id}, (err, todo) => {
            if (err) {
                reject(new Error('failed to get todos'));
            } else {
                resolve(todo);
            }
        })
    })
}