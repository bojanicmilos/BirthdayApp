const Present = require('../models/Present')

async function itemIsPresentChecker(req, res, next) {
    const { itemId } = req.params;
    let itemsAsPresent;
    try {
        itemsAsPresent = await Present.find({ presentBought: itemId })
    }
    catch (err) {
        return res.status(400).send('Wrong item ID format !')
    }

    if (itemsAsPresent.length > 0) {
        return res.status(400).send('You cannot delete item because it is present for one or more events !')
    }
    next();
}

module.exports = itemIsPresentChecker;