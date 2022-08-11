const express = require('express')
const birthdayEventsController = require('../controllers/BirthdayEventsController')

const router = express.Router()

router.post('/add', birthdayEventsController.addBirthdayEvent)
router.get('/allcurrent', birthdayEventsController.getCurrentEvents)
router.get('/', birthdayEventsController.getAllEvents)

module.exports = router;