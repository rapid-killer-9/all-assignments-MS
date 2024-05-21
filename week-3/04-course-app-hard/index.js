const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

// mongoose schema
const userSchema = new mongoose.Schema({
  username:  String,
  password: String,
  purchasedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const adminSchema = new mongoose.Schema({
  username:  String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
})

// mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

// secret key for jwt
const adminKey = 'Adm!N@k3y@n0th!Ng';
const userKey = 'Us3R@k3y@n0th!Ng';

const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, adminKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, userKey, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

// connect to mongoDb
mongoose.connect('mongodb+srv://hjha0695:WzVrf5PECPbOPHE2@cluster0.95jmj00.mongodb.net/courses')

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  const admin = await Admin.findOne({username});
  
  if(admin){
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    const newAdmin = new Admin({ username, password});
    await newAdmin.save();
    const token = jwt.sign({username, role: 'admin'}, adminKey, {expiresIn: '1h'});
    res.json({message: 'Admin Created Successfully', token});
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const admin = await Admin.findOne({username, password});

  if(admin){
    const token = jwt.sign({username, role: 'admin'}, adminKey, {expiresIn: '1h'});
    res.json({message: 'Logged in successfully', token});
  } else {
    res.status(403).json({message: 'Admin authentication failed'})
  }
});

app.post('/admin/courses', authenticateAdminJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  res.json({message: 'Course Created Successfully', courseId: course.id});
});

app.put('/admin/courses/:courseId', authenticateAdminJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {new: true});
  if(course){
    res.json({message: 'Course Updated Successfully'})
  } else {
    res.status(404).json({message: 'Course Not Found'})
  }
});

app.get('/admin/courses', authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({courses});
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  const user = await  User.findOne({username});

  if(user) {
    res.status(403).json({message: 'User Already exists'});
  } else {
    const newUser = new User({username, password});
    await newUser.save();
    const token = jwt.sign({username, role: 'user'}, userKey, {expiresIn: '1h'});
    res.json({message: 'User Created Successfully', token});
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const user = await  User.findOne({username, password});

  if(user) {
    const token = jwt.sign({username, role: 'user'}, userKey, {expiresIn: '1h'});
    res.json({message: 'Logged in Successfully', token});
  } else {
    res.status(403).json({message: 'User Authenticate failed'});
  }
});

app.get('/users/courses', authenticateUserJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({published: true});
  res.json({courses});
});

app.post('/users/courses/:courseId', authenticateUserJwt, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    return res.status(403).json({ message: 'User not found' });
  }

  if (user.purchasedCourses.includes(course._id)) {
    return res.status(400).json({ message: 'Course already purchased' });
  }

  user.purchasedCourses.push(course._id);
  await user.save();
  res.json({ message: 'Course purchased successfully' });
});

app.get('/users/purchasedCourses', authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({username: req.user.username}).populate('purchasedCourses');
  if(user) {
    res.json({purchasedCourses: user.purchasedCourses || []});
  } else {
    res.status(403).json({message: 'User Not Found'});
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});