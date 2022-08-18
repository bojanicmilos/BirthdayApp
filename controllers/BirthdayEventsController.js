const User = require('../models/User')
const moment = require('moment');
const getCurrentDate = require('../helpers/getCurrentDate');
const BirthdayEvent = require('../models/BirthdayEvent');
const UserPayment = require('../models/UserPayment');
const Present = require('../models/Present');
const Item = require('../models/Item');
const giveProperPageAndLimit = require('../helpers/giveProperPageAndLimit');

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
            notes: `Birthday for ${birthdayPerson.name}`,
            isBoughtPresent: false,
            totalMoneyAmount: 0
        })

        const result = await birthdayEvent.save()

        return res.status(201).send(result)
    }
    catch(err) {
        res.status(400).send('Wrong event data provided !')
    }
}

exports.getCurrentEvents = async (req, res) => {
    const { page, limit } = giveProperPageAndLimit(req.query.page, req.query.limit);

    const currentEvents =  await BirthdayEvent.find({eventDate: { $gte: getCurrentDate()}}).populate('birthdayPerson')
    const currentEventsWithoutLoggedUser = currentEvents.filter(event => event.birthdayPerson.name !== global.userName)
    const paginatedResults = currentEventsWithoutLoggedUser.slice((page - 1) * limit, page * limit)
    return res.status(200).json({paginatedResults, totalFound: currentEventsWithoutLoggedUser.length})
}

exports.getAllEvents = async (req, res) => {
    const { page, limit } = giveProperPageAndLimit(req.query.page, req.query.limit);

    BirthdayEvent.find().populate('birthdayPerson')
                 .then(events => {
                    const eventsWithoutLoggedUser = events.filter(event => event.birthdayPerson.name !== global.userName)
                    const paginatedResults = eventsWithoutLoggedUser.slice((page - 1) * limit, page * limit)
                    res.status(200).json({paginatedResults, totalFound: eventsWithoutLoggedUser.length})
                 })
}

exports.addParticipant = async (req, res) => {
    let birthdayEvent;
    let user;
    try {
        birthdayEvent = await BirthdayEvent.findById(req.body.birthdayEventId).populate('participants')
    }
    catch(err) {
        return res.status(400).send('Wrong birthday event ID format !')
    }
    
    try {
        user = await User.findOne({ name: global.userName }).exec()
    }
    catch(err) {
        return res.status(400).send('Wrong username format !')
    }

    if (!req.body.amount) {
        return res.status(400).send('You must fill amount field !')
    }

    if (!req.body.message) {
        return res.status(400).send('You must fill message field !')
    }

    if (!user) {
        return res.status(400).send('User not found !')
    }
   
    if (!birthdayEvent) {
        return res.status(400).send('Event not found !')
    }

    if (user._id.toString() === birthdayEvent.birthdayPerson.toString()) {
        return res.status(400).send('You cant pay for your birthday !')
    }
    
    if (birthdayEvent.isBoughtPresent) {
        return res.status(400).send('Present is already bought for this birthday event !')
    }

    if (birthdayEvent.eventDate < getCurrentDate()) {
        return res.status(400).send('Birthay event is in the past !')
    }

    for (const participant of birthdayEvent.participants) {
        if (participant.userId.toString() === user._id.toString()) {
            return res.status(400).send('You are already participant in this birthday event')
        }
    }

    const userPayment = new UserPayment({
        amount: +req.body.amount,
        message: req.body.message,
        birthdayEventId: req.body.birthdayEventId,
        userId: user._id
    })

    const result = await userPayment.save()

    birthdayEvent.totalMoneyAmount = birthdayEvent.totalMoneyAmount + result.amount
    birthdayEvent.participants = [...birthdayEvent.participants, result._id]

    const updatedEvent = await birthdayEvent.save()

    return res.status(200).json(updatedEvent)
}

exports.buyPresent = async (req, res) => {
    const { birthdayEventId, presentToBuyId } = req.body;

    let birthdayEvent;

    try {
         birthdayEvent = await BirthdayEvent.findById(birthdayEventId)
                                           .populate('eventCreator')
                                           .populate('birthdayPerson');
    }
    catch(err) {
        return res.status(400).send('Invalid birthday event ID format !')
    }
    
    if (!birthdayEvent) {
        return res.status(400).send('Birthday event not found !') 
    }

    if (birthdayEvent.eventCreator.name !== global.userName) {
        return res.status(400).send('Only event creator can buy a present !')
    }

    if (birthdayEvent.totalMoneyAmount <= 0) {
        return res.status(400).send('There is no money to buy a present !')
    }

    if (birthdayEvent.isBoughtPresent) {
        return res.status(400).send('Present is already bought for this event !')
    }

    const strWishListIDs = birthdayEvent.birthdayPerson.wishList.map(wish => wish.toString())

    if (!strWishListIDs.includes(presentToBuyId?.toString())) {
        
        if (!req.body.itemName) {
            return res.status(400).send('You must provide item name if item is not chosen from the wish list !')
        }
        
        const item = await Item.findOne({ name: req.body.itemName.toLowerCase() }).exec()
        
        if (!item) {
            return res.status(400).send('Item not found by name !')
        }
        const present = new Present({
            birthdayEventId: birthdayEventId,
            presentBought: item._id
        })
        birthdayEvent.isBoughtPresent = true

        const result = await Promise.all([present.save(), birthdayEvent.save()])

        return res.status(200).json(result[0])
    }

    const present = new Present({
        birthdayEventId: birthdayEventId,
        presentBought: presentToBuyId
    })
    birthdayEvent.isBoughtPresent = true

    const result = await Promise.all([present.save(), birthdayEvent.save()]);
    
    return res.status(200).json(result[0])
}