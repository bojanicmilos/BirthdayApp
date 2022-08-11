const express = require('express')
const birthdayEventsController = require('../controllers/BirthdayEventsController')

const router = express.Router()

router.post('/add', birthdayEventsController.addBirthdayEvent)
router.get('/allcurrent', birthdayEventsController.getCurrentEvents)
router.get('/', birthdayEventsController.getAllEvents)
router.post('/addparticipant', birthdayEventsController.addParticipant)

module.exports = router;