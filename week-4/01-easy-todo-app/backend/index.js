const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todosRouter = require("./routes/todos");
const userRouter = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/todos', todosRouter);

mongoose.connect('mongodb+srv://hjha0695:UlQR6IrzmggVBY9A@cluster0.gangkxh.mongodb.net/todo-test', { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));