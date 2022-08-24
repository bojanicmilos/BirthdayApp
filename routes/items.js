const express = require('express')
const itemsController = require('../controllers/ItemsController')
const body = require('express-validator').body
const validateRequestSchema = require('../middleware/validateRequestSchema')

const router = express.Router()

router.post('/add',
    body('name').isString().isLength({ min: 2 }),
    body('urlLink').optional().isString(),
    validateRequestSchema,
    itemsController.addItem)

router.delete('/delete/:itemId', itemsController.deleteItem)
router.get('/', itemsController.getAllItems)

module.exports = router;
