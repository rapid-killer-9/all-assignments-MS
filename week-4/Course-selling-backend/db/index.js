const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
  
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true},
    password: { type: String, required: true },
    createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
  
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    price: {type: Number, required: true},
    imageLink: {type: String, required: true},
    published: {type: Boolean,required: true, default: true},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = {
    User,
    Admin,
    Course
}