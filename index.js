require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConnect = require('./config/database')
const userRoutes = require('./routes/User.routes')
const workoutRoutes = require('./routes/Workouts.routes')
const multer=require('multer')
const upload=multer()
// for parsing application/json
app.use(express.json())

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true }))


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(
    cors({
        credentials: true,
    })
);

dbConnect()
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    res.json(formData);
});
app.use("/api/users/", userRoutes)
app.use("/api/workouts/", workoutRoutes)
app.post('/test', (req, res) => {
    console.log(req.body)
    console.log("hello")
    res.status(200).json({ message: 'Server is running' })
})


app.listen(process.env.SERVER_PORT, console.log(`Server is running on port ${process.env.SERVER_PORT}`))

