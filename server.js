
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')


const app = express();

const userRouter = require('./routes/users')
const itemRouer = require('./routes/items')

app.use(bodyParser.json());
app.use('/users', userRouter)
app.use('/posts', itemRouer)


mongoose.connect('mongodb+srv://milos:milos123@cluster0.dtzemef.mongodb.net/birthdaydb?retryWrites=true&w=majority')
        .then((result) => {
            app.listen(3000)
        })
        .catch((err) => {
            console.log(err)
        })

