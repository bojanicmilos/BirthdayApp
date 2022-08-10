
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

const userRouter = require('./routes/users')
const itemRouter = require('./routes/items')
const birthdayEventRouter = require('./routes/birthdayEvents')

app.use(bodyParser.json());
app.use('/api/users', userRouter)
app.use('/api/posts', itemRouter)
app.use('/api/birthdayevents', birthdayEventRouter)


mongoose.connect('mongodb+srv://milos:milos123@cluster0.dtzemef.mongodb.net/birthdaydb?retryWrites=true&w=majority')
        .then((result) => {
            app.listen(3000)
        })
        .catch((err) => {
            console.log(err)
        })

