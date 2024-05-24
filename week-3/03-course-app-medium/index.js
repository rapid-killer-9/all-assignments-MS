const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const adminFile = 'admin.json';
const userFile = 'user.json';
const coursesFile = 'courses.json';

const readDataFromFile = (file) => {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file);
    return JSON.parse(data);
  }
  return [];
};

const writeDataToFile = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

let ADMINS = readDataFromFile(adminFile);
let USERS = readDataFromFile(userFile);
let COURSES = readDataFromFile(coursesFile);

// admin jwt and auth
const adminKey = 'Adm!N@k3y@n0th!Ng';

const generateAdminJwt = (user) => {
  const payload = { username: user.username };
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
const userKey = 'Us3R@k3y@n0th!Ng';

const generateUserJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userKey, { expiresIn: '1h' });
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

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    writeDataToFile(adminFile, ADMINS);
    const token = generateAdminJwt(admin);
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);

  if (admin) {
    const token = generateAdminJwt(admin);
    res.json({
      message: 'Logged in successfully', 
      token
    });
  } else {
    res.status(403).json({
      message: 'Admin authentication failed'
    });
  }
});

app.post('/admin/courses', authenticateAdminJwt, (req, res) => {
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  writeDataToFile(coursesFile, COURSES);
  res.json({
    message: 'Course Created',
    courseId: course.id
  });
});

app.put('/admin/courses/:courseId', authenticateAdminJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    writeDataToFile(coursesFile, COURSES);
    res.json({
      message: 'Course Updated Successfully'
    });
  } else {
    res.status(404).json({
      message: 'Course not found'
    });
  }
});

app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
  return res.json({ Courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = req.body;
  const existingUser = USERS.find(u => u.username === user.username);
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    user.purchasedCourses = [];
    USERS.push(user);
    writeDataToFile(userFile, USERS);
    const token = generateUserJwt(user);
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);

  if (user) {
    const token = generateUserJwt(user);
    res.json({
      message: 'Logged in successfully', 
      token
    });
  } else {
    res.status(403).json({
      message: 'User authentication failed'
    });
  }
});

app.get('/users/courses', authenticateUserJwt, (req, res) => {
  res.json({
    courses: COURSES.filter(c => c.published)
  });
});

app.post('/users/courses/:courseId', authenticateUserJwt, (req, res) => {
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
      writeDataToFile(userFile, USERS);
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
  const user = USERS.find(u => u.username === req.user.username);
  const purchasedCourses = COURSES.filter(c => user.purchasedCourses.includes(c.id));
  return res.json(purchasedCourses);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
