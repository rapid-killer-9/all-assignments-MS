const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// admin jwt and auth
const adminKey = 'Adm!N@k3y@n0th!Ng';

const generateAdminJwt = (user) => {
  const payload = { username: user.username, };
  return jwt.sign(payload, adminKey, { expiresIn: '1h' });
};

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

// User JWT and auth
const userKey = 'Us3R@k3y@n0th!Ng'

const generateUserJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userKey, { expiresIn: '1h' });
};

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[1];

    jwt.verify(token, userKey, (err, user) => {
      if(err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }
      req.user= user;
      next();
    });
  }else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    const token = generateAdminJwt(admin);
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);

  if(admin){
    const token = generateAdminJwt(admin);
    res.json({
      message: 'Logged in successfully', 
      token
    })
  } else {
    res.status(403).json({
      message: 'Admin authentication failed'
    })
  }
});

app.post('/admin/courses', authenticateAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  res.json({
    message: 'Course Created',
    courseId: course.id
  })
});

app.put('/admin/courses/:courseId', authenticateAdminJwt, (req, res) => {
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

app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  return res.json({Courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  const existingUser = USERS.find(u => u.username === user.username);
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    user.purchasedCourses = [];
    USERS.push(user);
    const token = generateUserJwt(user);
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);

  if(user){
    const token = generateUserJwt(user);
    res.json({
      message: 'Logged in successfully', 
      token
    })
  } else {
    res.status(403).json({
      message: 'User authentication failed'
    })
  }
});

app.get('/users/courses', authenticateUserJwt, (req, res) => {
  // logic to list all courses
  res.json({
    courses: COURSES.filter(c => c.published)
  })
});

app.post('/users/courses/:courseId', authenticateUserJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    const user = USERS.find(u => u.username === req.user.username);
    if (user.purchasedCourses.includes(courseId)) {
      res.status(400).json({
        message: 'Course already purchased'
      });
    } else {
      user.purchasedCourses.push(courseId);
      res.json({
        message: 'Course Purchased Successfully'
      });
    }
  } else {
    res.status(404).json({
      message: 'Course Not Found or not available'
    });
  }
});

app.get('/users/purchasedCourses', authenticateUserJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(u => u.username === req.user.username);
  const purchasedCourses = COURSES.filter(c => user.purchasedCourses.includes(c.id));
  return res.json(purchasedCourses);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
