const User = require('../models/User')
const moment = require('moment');
const getCurrentDate = require('../helpers/getCurrentDate');
const BirthdayEvent = require('../models/BirthdayEvent');

exports.addBirthdayEvent = async (req, res) => {
    let eventCreator;
    let birthdayPerson;

    try {
        eventCreator = await User.findOne({ name: global.userName }).exec()
    }
    catch(err) {
        return res.status(400).send('Wrong username format for event creator!')
    }

    if (!eventCreator) {
        return res.status(404).send('Event creator not found !')
    }

    try {
        birthdayPerson = await User.findById(req.body.birthdayPerson)
    }
    catch (err) {
        return res.status(400).send('Wrong ID format for birthday person')
    }

    if (!birthdayPerson) {
        return res.status(400).send('Birthday person not found !')
    }

    if (eventCreator._id.toString() === birthdayPerson._id.toString()) {
        return res.status(400).send('You cant make event for yourself !')
    }

    if (!(moment(birthdayPerson.birthDate).set(`year`, moment().year()) >= getCurrentDate())) {
        return res.status(400).send('Birthday of a person is not in the future !')
    }

    let existingFutureEventsForPerson = await BirthdayEvent.find({ birthdayPerson: req.body.birthdayPerson, eventDate: { $gte: getCurrentDate()}})

    if (existingFutureEventsForPerson.length > 0) {
        return res.status(400).send('Person already got upcomming event created !')
    }

    try {
        const birthdayEvent = new BirthdayEvent({
            birthdayPerson: req.body.birthdayPerson,
            eventCreator: eventCreator._id.toString(),
            eventDate: moment(birthdayPerson.birthDate).set('year', moment().year()),
            notes: `Birthday for ${birthdayPerson.name}`
        })

        const result = await birthdayEvent.save()

        return res.status(201).send(result)
    }
    catch(err) {
        res.status(400).send('Wrong event data provided !')
    }
    
}