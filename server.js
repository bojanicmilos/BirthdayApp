
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config()

const { DBCONNECTION, PORT} = process.env

const app = express();

const userRouter = require('./routes/users')
const itemRouter = require('./routes/items')
const birthdayEventRouter = require('./routes/birthdayEvents')

app.use(bodyParser.json());
app.use('/api/users', userRouter)
app.use('/api/items', itemRouter)
app.use('/api/birthdayevents', birthdayEventRouter)


mongoose.connect(DBCONNECTION)
        .then((result) => {
            app.listen(parseInt(PORT))
        })
        .catch((err) => {
            console.log(err)
        })

