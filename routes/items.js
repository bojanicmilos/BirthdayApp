const express = require('express')
const itemsController = require('../controllers/ItemsController')
const body = require('express-validator').body
const validateRequestSchema = require('../middleware/validateRequestSchema')
const itemIsPresentChecker = require('../middleware/itemIsPresentChecker')

const router = express.Router()

router.post('/add',
    body('name').isString().isLength({ min: 2 }),
    body('urlLink').optional().isString(),
    body('price').isNumeric(),
    validateRequestSchema,
    itemsController.addItem)

router.delete('/delete/:itemId', itemIsPresentChecker, itemsController.deleteItem)
router.get('/', itemsController.getAllItems)

module.exports = router;
