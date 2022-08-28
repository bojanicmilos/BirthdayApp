const Item = require("../models/Item")
const capitalizeFirstLetter = require('../helpers/capitalizeFirstLetter')
const User = require("../models/User")
const { default: mongoose } = require("mongoose")

exports.addItem = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).send('You must provide item name !')
    }

    try {
        const item = new Item({
            name: capitalizeFirstLetter(req.body.name),
            urlLink: req.body.urlLink,
            price: req.body.price
        })

        const result = await item.save()
        return res.status(201).json(result)
    }
    catch (err) {
        return res.status(400).send('Duplicate item name !')
    }

}

exports.deleteItem = async (req, res) => {
    const { itemId } = req.params;
    let result;
    try {
        result = await Item.findByIdAndDelete(itemId)
    }
    catch (err) {
        return res.status(400).send('Wrong Item ID format')
    }

    if (!result) {
        return res.status(404).send('Item not found')
    }

    const usersWithDeletedItem = await User.find({ wishList: mongoose.Types.ObjectId(itemId) })

    const newUsers = usersWithDeletedItem.map(async (user) => {
        user.wishList = user.wishList.filter(item => item._id.toString() !== itemId)
        await user.save()
        return user
    })

    await Promise.all([...newUsers])

    return res.status(200).send('Item deleted !')
}

exports.getAllItems = async (req, res) => {

    const items = await Item.find()

    return res.status(200).json(items)
}