const mongoose = require('mongoose');

module.exports = mongoose.model('Todo', new mongoose.Schema({
        task: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    }, {
        timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
    })
)