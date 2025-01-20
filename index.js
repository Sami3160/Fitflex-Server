require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConnect=require('./config/database')



app.use(bodyParser.json())
app.use(
    cors({
        credentials: true,
    })
);

dbConnect()


app.listen(process.env.SERVER_PORT, console.log(`Server is running on port ${process.env.SERVER_PORT}`))

