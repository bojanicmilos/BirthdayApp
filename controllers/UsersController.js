const moment = require('moment');
const User = require('../models/User')
const user = require('../models/User')

exports.login = async (req, res) => {
    console.log(req.query.userId)
    let foundUser;

    try {
         foundUser = await User.findById(req.query.userId)
    }
    catch(err) {
        return res.status(404).send("Invalid ID error")
    }
    
    if (!foundUser) {
        return res.status(404).json({notFound: 'User not found.'})
    }
    
    else {
        global.userId = req.query.userId
        return res.status(200).send("User found")
    }
}

exports.getAllUsersWithUpcomingBirthdays = async (req, res) => {
    console.log(global.userId)
    User.find().then(results => {
        results = results.filter(user => moment(user.birthDate).set(`year`, moment().year()) > moment())
        return res.status(200).json(results)
    })
// '$where': 'this.birthDate.set(`year`, moment().year()) > moment()'
   // return res.status(200).json(foundUsers)
}

exports.addUser = (req, res) => {
    const user = new User({
        name: req.body.name,
        birthDate: req.body.birthDate,
        wishList: req.body.wishList
    })
    return res.json({nesto: "nesto"})
}
