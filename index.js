require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConnect=require('./config/database')
const userRoutes=require('./routes/User.routes')


app.use(bodyParser.json())
app.use(
    cors({
        credentials: true,
    })
);

app.use("/api/users/",userRoutes)
dbConnect()
app.get('/test', (req, res) => {
    console.log("hello")
    res.status(200).json({ message: 'Server is running' })
})


app.listen(process.env.SERVER_PORT, console.log(`Server is running on port ${process.env.SERVER_PORT}`))

