const mongoose = require("mongoose");
const express = require("express");
const { Admin, Course } = require("../db/index");
const jwt = require('jsonwebtoken');
const { SECRET, authenticateJwt, authorizeRole } = require("../middleware/auth");
const router = express.Router();

// me routes for admin
router.get('/me', authenticateJwt, authorizeRole('admin'), async (req, res) => {
    const admin = await Admin.findById(req.user.id);
    if(!admin){
        return res.status(403).json({msg: "Admin doesnt exist"});
    }
    return res.json({
        email: admin.email
    });
})

// signup for admim
router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    try{
    const admin = await Admin.findOne({email})
    if(admin){
        return res.status(403).json({ message: 'Admin already exists' });
    }
    
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    const payload = {id: newAdmin.id, email: email, role: 'admin'};
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// login for admin
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const admin = await Admin.findOne({email, password});
        if(!admin) {
            return res.status(403).json({ message: 'Invalid username or password' });
        } 

        const payload = {id: admin.id, email: email, role: 'admin'};
        const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// get all the courses created by admin 
router.get('/courses', authenticateJwt, authorizeRole('admin'), async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).populate('createdCourses');
        if (!admin) {
            return res.status(403).json({ msg: 'Admin doesn\'t exist' });
        }
        
        res.json(admin.createdCourses);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
})

// get single course by id
router.get('/course/:id', authenticateJwt, authorizeRole('admin'), async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        return res.json({ course });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// create a course 
router.post('/course', authenticateJwt, authorizeRole('admin'), async (req, res) => {
    const { title, description, price, imageLink, published } = req.body;
    try{
        const admin = await Admin.findById(req.user.id);
        if (!admin) {
            return res.status(403).json({ msg: 'Admin doesn\'t exist' });
        }
        const newCourse = new Course({
            title,
            description,
            price,
            imageLink,
            published,
            admin: admin._id
        });
        const course = await newCourse.save();
        admin.createdCourses.push(course._id);
        await admin.save();
        return  res.json({ message: 'Course created successfully', courseId: course._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// update a course
router.put('/course/:id', authenticateJwt, authorizeRole('admin'), async (req, res) => {
    const courseId = req.params.id;
    const { title, description, price, imageLink, published } = req.body;
    try {
        const course = await Course.findByIdAndUpdate(courseId, {
            title,
            description,
            price,
            imageLink,
            published
        }, { new: true });
        return  res.json({ message: 'Course updated successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// delete a course
router.delete('/course/:id', authenticateJwt, authorizeRole('admin'), async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const admin = await Admin.findById(req.user.id);
        const index = admin.createdCourses.indexOf(course._id);

        if (index !== -1) {
            admin.createdCourses.splice(index, 1);
            await admin.save();
        }
        return  res.json({ message: 'Course Deleted successfully'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router