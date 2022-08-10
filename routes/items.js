const express = require('express')
const itemsController = require('../controllers/ItemsController')


const router = express.Router()

router.post('/add', itemsController.addItem)

router.delete('/delete/:itemId', itemsController.deleteItem)

module.exports = router;
