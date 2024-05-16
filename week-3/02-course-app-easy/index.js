const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuth = (req, res, next) => {
  const {username, password} = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if(admin){
    next();
  } else {
    res.status(403).json({
      message: 'Admin authentication failed'
    })
  }
}

const userAuth = (req, res, next) => {
  const {username, password} = req.headers;
  const user = USERS.find(a => a.username === username && a.password === password);
  if(user){
    req.user = user;
    next();
  } else {
    res.status(403).json({
      message: 'User authentication failed'
    })
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if(existingAdmin){
    res.status(403).json({
      message: "Admin already exists"
    })
  } else{
    ADMINS.push(admin);
    res.json({
      message: "Admin Created Successfully"
    })
  }
});

app.post('/admin/login', adminAuth, (req, res) => {
  // logic to log in admin
  res.json({
    message: "Logged in Successfully"
  })
});

app.post('/admin/courses',adminAuth, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = Date.now();
  if(!course.title || !course.description || !course.price || !course.imageLink || !course.published){
    res.status(411).json({
      message: "Data is Incomplete"
    })
  }
  COURSES.push(course);
  res.json({
    message: "Course Created Successfully",
    courseId: course.id
  })
});

app.put('/admin/courses/:courseId', adminAuth,  (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if(course){
    Object.assign(course,req.body);
    res.json({
      message: 'Course Updated Successfully'
    })
  } else {
    res.status(404).json({
      message: "Course not found"
    })
  }
});

app.get('/admin/courses', adminAuth, (req, res) => {
  // logic to get all courses
  return res.json({Courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = {...req.body, purchasedCouses: []};
  USERS.push(user);
  return res.json({
    message: 'User created successfully'
  })
});

app.post('/users/login', userAuth, (req, res) => {
  // logic to log in user
  res.json({
    message: "Logged in Successfully"
  })
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  res.json({
    courses: COURSES.filter(c => c.published)
  })
});

app.post('/users/courses/:courseId', userAuth, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if(course){
    req.user.purchasedCouses.push(courseId);
    res.json({
      message: 'Course Purchased Successfully'
    })
  } else {
    res.status(404).json({
      message: "Course Not Found or not available"
    })
  }
});

app.get('/users/purchasedCourses', userAuth, (req, res) => {
  // logic to view purchased courses
  const purchasedCouses = COURSES.filter(c => req.user.purchasedCouses.includes(c.id));
  return res.json(purchasedCouses)
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
