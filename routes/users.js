const express = require('express')
const usersController = require('../controllers/UsersController')
const body = require('express-validator').body
const validateRequestSchema = require('../middleware/validateRequestSchema')

const router = express.Router()

router.post('/',
    body('name').isString().isLength({ min: 3 }),
    body('wishList').isArray(),
    validateRequestSchema,
    usersController.addUser)
router.get('/login', usersController.login)
router.get('/logout', usersController.logout)
router.get('/upcomingbirthdays', usersController.getAllUsersWithUpcomingBirthdays)
router.patch('/additemtowishlist/:itemId', usersController.addItemToWishList)
router.get('/:username', usersController.getUserByUsername)
router.delete('/itemfromwishlist/:itemId', usersController.deleteItemFromWishList)

module.exports = router;
