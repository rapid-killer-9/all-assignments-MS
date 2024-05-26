const mongoose = require("mongoose");
const express = require("express");
const { User , Course } = require("../db/index");
const jwt = require('jsonwebtoken');
const { SECRET, authenticateJwt, authorizeRole } = require("../middleware/auth");
const router = express.Router();

// me routes
router.get('/me', authenticateJwt, authorizeRole('user'), async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user){
        return res.status(403).json({msg: "User doesnt exist"});
    }
    return res.json({
        email: user.email
    });
})


// signup routes
router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    try{
    const user = await User.findOne({email})
    if(user){
        return res.status(403).json({ message: 'User already exists' });
    }
    
    const newUser = new User({ email, password });
    await newUser.save();

    const payload = {id: newUser.id, email: email, role: 'user'};
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// login routes
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email, password});
        if(!user) {
            return res.status(403).json({ message: 'Invalid username or password' });
        } 

        const payload = {id: user.id, email: email, role: 'user'};
        const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// all published courses
router.get('/courses', authenticateJwt, authorizeRole('user'), async (req, res) => {
    try {
        const course =  await Course.find({published: true});
        res.json({course: course});
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
})

// a single course
router.get('/course/:id', authenticateJwt, authorizeRole('user'), async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.json({course: course});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// purchase course
router.post('/purchaseCourse/:id', authenticateJwt, authorizeRole('user'), async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ message: 'Course not found' });
        }
         
        const user = await User.findOne({ email: req.user.email });
        if(user) {
            user.purchasedCourses.push(course._id);
            await user.save();
            return res.json({ message: 'Course purchased successfully' , course});
        } else {
            return res.status(404).json({message: 'User Not Found'})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// list of purchased course
router.get('/purchasedCourses', authenticateJwt, authorizeRole('user'), async (req, res) => {
    const user = await User.findById(req.user.id);
    try {
        if(user) {
            const courses = user.populate('purchasedCourses');
            return res.json({PurchasedCourses: courses})
        } else {
            return res.status(404).json({message: 'User Not found'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router