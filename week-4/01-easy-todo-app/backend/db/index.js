const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true },
    todo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
});

const TodoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', UserSchema);
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    User,
    Todo
}