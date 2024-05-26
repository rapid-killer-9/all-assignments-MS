const express = require("express")
const { authenticateJwt, SECRET } = require('../middleware/authMiddleware');
const { Todo, User } = require("../db");
const router = express.Router();

router.post('/', authenticateJwt, async (req, res) => {
    const { title, description} = req.body;
    const {email, id} = req.user;
    
    try {
      const user = await User.findById(id);
      if (!user || user.email !== email) {
        return res.status(403).send("User does not exist");
      }

      const newTodo = new Todo({
        user: id,
        title,
        description
      });
      const todo = await newTodo.save();
      user.todo.push(todo._id);
      await user.save();
      res.json(todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  router.get('/', authenticateJwt, async (req, res) => {
    const { email, id } = req.user;
    try {
      const user = await User.findById(id).populate('todo');
      if (!user || user.email !== email) {
        return res.status(403).send("User does not exist");
      }
      
      res.json(user.todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  router.put('/:id', authenticateJwt, async (req, res) => {
    const { id } = req.params;
    const updateTodo = req.body;
    try {
      const todo = await Todo.findOneAndUpdate(
        { _id: id, user: req.user.id },
        updateTodo,
        { new: true }
      );
      if (!todo) {
        return res.status(404).json({ msg: 'Todo not found' });
      }
      res.json(todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  router.delete('/:id', authenticateJwt, async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });
        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }
        res.send('Todo Deleted');
    }  catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
  });

  
  module.exports = router;