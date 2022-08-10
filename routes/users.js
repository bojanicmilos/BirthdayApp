const express = require('express')
const usersController = require('../controllers/UsersController')
const User = require('../models/User');

const router = express.Router()

router.post('/', usersController.addUser)
router.get('/', usersController.login)
router.get('/upcomingbirthdays', usersController.getAllUsersWithUpcomingBirthdays)

module.exports = router;
//asd