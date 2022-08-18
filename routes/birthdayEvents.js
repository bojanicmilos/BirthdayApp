const express = require('express')
const birthdayEventsController = require('../controllers/BirthdayEventsController')
const body = require('express-validator').body
const validateRequestSchema = require('../middleware/validateRequestSchema')

const router = express.Router()

router.post('/add', birthdayEventsController.addBirthdayEvent)
router.get('/allcurrent', birthdayEventsController.getCurrentEvents)
router.get('/', birthdayEventsController.getAllEvents)
router.post('/addparticipant',
             body('amount').isFloat({ min: 50 }),
             body('message').isString().isLength({ min: 10 }),
             body('birthdayEventId').exists({ checkFalsy: true }),
             validateRequestSchema,
              birthdayEventsController.addParticipant)
router.post('/buypresent', 
            body('itemName').optional().isString(), 
            validateRequestSchema, 
            birthdayEventsController.buyPresent)

module.exports = router;