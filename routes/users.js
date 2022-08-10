const express = require('express')
const usersController = require('../controllers/UsersController')

const router = express.Router()

router.post('/', usersController.addUser)
router.get('/login', usersController.login)
router.get('/logout', usersController.logout)
router.get('/upcomingbirthdays', usersController.getAllUsersWithUpcomingBirthdays)
router.get('/additemtowishlist/:itemId', usersController.addItemToWishList)

module.exports = router;
