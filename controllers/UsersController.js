const moment = require('moment');
const User = require('../models/User')
const Item = require('../models/Item')
const isDate = require('../helpers/isDateCheck')
const hasDuplicates = require('../helpers/arrayDuplicatesCheck');
const getCurrentDate = require('../helpers/getCurrentDate');

exports.login = async (req, res) => {
   
    let foundUser;

    try {
         foundUser = await User.findById(req.query.userId)
    }
    catch(err) {
        return res.status(404).send("Invalid ID error")
    }
    
    if (!foundUser) {
        return res.status(404).send("User not found")
    }
    
    else {
        global.userId = req.query.userId
        return res.status(200).send("User logged")
    }
}

exports.logout = (req, res) => {
    global.userId = null;
    return res.status(200).send('Logout')
}

exports.getAllUsersWithUpcomingBirthdays = async (req, res) => {
    console.log(global.userId)
    User.find().then(results => {
        results = results.filter(user => moment(user.birthDate).set(`year`, moment().year()) >= getCurrentDate() && user._id.toString() !== global.userId)

        return res.status(200).json(results)
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

    console.log(req.body.wishList)

    for (const id of req.body.wishList) {
        try {
            const element = await Item.findById(id) 

            if (!element) {
                return res.status(400).send('Invalid ID')
            }
        }
        catch(err) {
            console.log('Invalid ID format')
            return res.status(400).send('Invalid ID format')
        }
    }

    const user = new User({
        name: req.body.name,
        birthDate: req.body.birthDate,
        wishList: req.body.wishList
    })
    const result = await user.save()

    return res.status(201).json(result)
}

exports.addItemToWishList = async (req, res) => {
    let user;
    let item;

    try {
         user = await User.findById(global.userId)
    }
    catch(err) {
        return res.status(400).send('Wrong user ID format !')
    }

    if (!user) {
        return res.status(404).send('User not found !')
    }

    try {
        item = await Item.findById(req.params.itemId)
    }
    catch(err) {
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
