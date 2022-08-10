const express = require('express')
const birthdayEventsController = require('../controllers/BirthdayEventsController')

const router = express.Router()

router.post('/', birthdayEventsController.addBirthdayEvent)

module.exports = router;