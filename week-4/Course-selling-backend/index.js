const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/admin', adminRouter);

mongoose.connect('mongodb+srv://hjha0695:WzVrf5PECPbOPHE2@cluster0.95jmj00.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));