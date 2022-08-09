const TestModel = require('./models/TestModel');

const express = require('express');


const app = express();
const mongoConnect = require('./mongo').mongoConnect


app.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const testModel = await TestModel.getById(id);
    res.json(testModel)
})

mongoConnect(() => {
    app.listen(3000)
})

