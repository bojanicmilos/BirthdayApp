const moment = require('moment');
const User = require('../models/User')
const Item = require('../models/Item')
const isDate = require('../helpers/isDateCheck')
const hasDuplicates = require('../helpers/arrayDuplicatesCheck');
const getCurrentDate = require('../helpers/getCurrentDate');
const giveProperPageAndLimit = require('../helpers/giveProperPageAndLimit')

exports.login = async (req, res) => {

    let foundUser;

    try {
        foundUser = await User.findOne({ name: req.query.userName }).exec()
    }
    catch (err) {
        return res.status(404).send("Invalid username error")
    }

    if (!foundUser) {
        return res.status(404).send("User not found")
    }

    else {
        global.userName = req.query.userName
        return res.status(200).json(foundUser)
    }
}

exports.logout = async (req, res) => {
    global.userName = null;
    return res.status(200).send('Logout')
}

exports.getAllUsersWithUpcomingBirthdays = async (req, res) => {
    const { page, limit } = giveProperPageAndLimit(req.query.page, req.query.limit);

    User.find().then(results => {
        results = results.filter(user => moment(user.birthDate).set(`year`, moment().year()) >= getCurrentDate() && user.name !== global.userName)
        results.sort((a, b) => moment(a.birthDate).set('year', moment().year()) - moment(b.birthDate).set('year', moment().year()))

        const paginatedResults = results.slice((page - 1) * limit, page * limit)
        return res.status(200).json({ paginatedResults, totalFound: results.length, numOfPages: Math.ceil(results.length / limit) })
    })
    // '$where': 'this.birthDate.set(`year`, moment().year()) >= getCurrentDate()'
    // return res.status(200).json(results)
}

exports.addUser = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).send('Username not provided.')
    }

    if (!req.body.birthDate || !isDate(req.body.birthDate)) {
        return res.status(400).send('Wrong date')
    }

    if (!req.body.wishList) {
        req.body.wishList = []
    }

    if (hasDuplicates(req.body.wishList)) {
        return res.status(400).send('Wish list has duplicate items.')
    }

    for (const id of req.body.wishList) {
        try {
            const element = await Item.findById(id)

            if (!element) {
                return res.status(400).send('Invalid item ID')
            }
        }
        catch (err) {
            return res.status(400).send('Invalid item ID format')
        }
    }

    try {
        const user = new User({
            name: req.body.name,
            birthDate: req.body.birthDate.slice(0, 10),
            wishList: req.body.wishList
        })
        const result = await user.save()
        return res.status(201).json(result)
    }
    catch (err) {
        return res.status(400).send('Username already exists !')
    }

}

exports.addItemToWishList = async (req, res) => {
    let user;
    let item;

    try {
        user = await User.findOne({ name: global.userName }).exec()
    }
    catch (err) {
        return res.status(400).send('Wrong username format !')
    }

    if (!user) {
        return res.status(404).send('User not found !')
    }

    try {
        item = await Item.findById(req.params.itemId)
    }
    catch (err) {
        return res.status(400).send('Wrong item ID format !')
    }

    if (!item) {
        return res.status(404).send('Item not found !')
    }

    const strItemIDs = [...user.wishList.map(item => item.toString()), req.params.itemId]

    user.wishList = [...user.wishList, req.params.itemId]

    if (hasDuplicates(strItemIDs)) {
        return res.status(400).send('User cannot have same items in his wish list !')
    }

    user.save().then(result => {
        return res.status(200).json(result)
    })
}
