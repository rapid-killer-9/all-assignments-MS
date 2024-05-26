const express = require("express");
const jwt = require('jsonwebtoken');
const { authenticateJwt, SECRET} = require("../middleware/authMiddleware");
const { User } = require("../db");
const router = express.Router();

router.get('/me', authenticateJwt, async (req, res) => {
  const user = await User.findById(req.user.id)
  if(!user) {
    res.status(403).json({msg: "User doesnt exist"})
    return
  } else {
  res.json({
      username: user.email
  })
  }
})

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({email});
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      const newUser = new User({ email, password});
      await newUser.save()
      const payload = {id: newUser.id, email: email };
      jwt.sign(payload, SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({email: email, password: password});
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = {id: user.id, email: email };
      // console.log(payload);
      jwt.sign(payload, SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = router;