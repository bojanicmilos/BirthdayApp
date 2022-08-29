const expect = require('chai').expect
const sinon = require('sinon')
const User = require('../models/User')
const Item = require('../models/Item')
const BirthdayEvent = require('../models/BirthdayEvent')
const BirthdayEventsController = require('../controllers/BirthdayEventsController')
const UserPayment = require('../models/UserPayment')
const Present = require('../models/Present')

describe('BirthdayEventsController', function () {
    let req, res;

    this.beforeEach(function () {
        req = {
            body: {
                name: '',
                urlLink: ''
            },
            params: {

            },
            query: {

            }
        }
        res = {
            message: null,
            statusCode: 500,
            status: function (statusCode) {
                this.statusCode = statusCode
                return this
            },
            send: function (message) {
                this.message = message
            },
            json: function (data) {
                return data
            }
        }
    })

    describe('BirthdayEventsController - addEvent', function () {
        it('returns bad request because username format of event creator is bad', function (done) {
            const stub = sinon.stub(User, 'findOne').throws()

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong username format for event creator!')
                done()
            }).catch(done)
        })

        it('returns bad request because event creator is not found', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves(null) })

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(404)
                expect(res.message).to.be.equal('Event creator not found !')
                done()
            }).catch(done)
        })

        it('returns bad request because wrong ID format for birthday person is specified', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({}) })
            const stub2 = sinon.stub(User, 'findById').throws()

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong ID format for birthday person')
                done()
            }).catch(done)
        })

        it('returns bad request because birthday person is not found', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({}) })
            const stub2 = sinon.stub(User, 'findById').returns(null)

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Birthday person not found !')
                done()
            }).catch(done)
        })

        it('returns bad request because event creator cant make event for himself', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({ _id: 'id' }) })
            const stub2 = sinon.stub(User, 'findById').returns({ _id: 'id' })

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('You cant make event for yourself !')
                done()
            }).catch(done)
        })

        it('returns bad request because birthday of a person is not in the future', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({ _id: 'id' }) })
            const stub2 = sinon.stub(User, 'findById').returns({ _id: 'id2', birthDate: '2000-01-01' })

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Birthday of a person is not in the future !')
                done()
            }).catch(done)
        })

        it('returns bad request because birthday person already has upcoming event created.', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({ _id: 'id' }) })
            const stub2 = sinon.stub(User, 'findById').returns({ _id: 'id2', birthDate: '2000-12-31' })
            const stub3 = sinon.stub(BirthdayEvent, 'find').returns([{ event: 'random event' }])

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                stub2.restore()
                stub3.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Person already got upcomming event created !')
                done()
            }).catch(done)
        })

        it('returns bad request because wrong event data is provided', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({ _id: 'id' }) })
            const stub2 = sinon.stub(User, 'findById').returns({ _id: 'id2', birthDate: '2000-12-31' })
            const stub3 = sinon.stub(BirthdayEvent, 'find').returns([])
            const stub4 = sinon.stub(BirthdayEvent.prototype, 'save').throws()

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                stub2.restore()
                stub3.restore()
                stub4.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong event data provided !')
                done()
            }).catch(done)
        })

        it('returns created result', function (done) {
            const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({ _id: 'id' }) })
            const stub2 = sinon.stub(User, 'findById').returns({ _id: 'id2', birthDate: '2000-12-31' })
            const stub3 = sinon.stub(BirthdayEvent, 'find').returns([])
            const stub4 = sinon.stub(BirthdayEvent.prototype, 'save').returns({})

            BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
                stub.restore()
                stub2.restore()
                stub3.restore()
                stub4.restore()
                expect(res.statusCode).to.be.equal(201)
                done()
            }).catch(done)
        })
    })

    describe('BirthdayEventsController - getCurrentEvents', function () {
        it('returns list of current events', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'find').returns({ populate: sinon.stub().returns({ populate: sinon.stub().returns({ populate: sinon.stub().returns([{ birthdayPerson: { name: 'random name' } }]) }) }) })

            BirthdayEventsController.getCurrentEvents(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(200)
                done()
            }).catch(done)
        })
    })

    describe('BirthdayEventsController - getAllEvents', function () {
        it('returns list of all events', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'find').returns({ populate: sinon.stub().returns({ populate: sinon.stub().returns({ populate: sinon.stub().returns(Promise.resolve([{ birthdayPerson: { name: 'name' } }])) }) }) })
            BirthdayEventsController.getAllEvents(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(200)
                done()
            }).catch(done)
        })
    })

    describe('BirthdayEventsController - addParticipant', function () {
        it('returns bad request because of wrong birthday event ID format', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').throws()
            BirthdayEventsController.addParticipant(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong birthday event ID format !')
                done()
            }).catch(done)
        })

        it('returns bad request because of wrong username format', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({}) } })
            const stub2 = sinon.stub(User, 'findOne').throws()
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong username format !')
                done()
            }).catch(done)
        })

        it('returns bad request because amount field is falsy', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({}) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({}) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('You must fill amount field !')
                done()
            }).catch(done)
        })

        it('returns bad request because message field is falsy', function (done) {
            req.body.amount = 15
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({}) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({}) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('You must fill message field !')
                done()
            }).catch(done)
        })

        it('returns bad request because user is not found', function (done) {
            req.body.amount = 15
            req.body.message = 'random message'
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({}) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve(null) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('User not found !')
                done()
            }).catch(done)
        })

        it('returns bad request because birthday event is not found', function (done) {
            req.body.amount = 15
            req.body.message = 'random message'
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve(null) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({}) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Event not found !')
                done()
            }).catch(done)
        })

        it('returns bad request because user cant pay for his own birthday', function (done) {
            req.body.amount = 15
            req.body.message = 'random message'
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({ birthdayPerson: 'value' }) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({ _id: 'value' }) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('You cant pay for your birthday !')
                done()
            }).catch(done)
        })

        it('returns bad request because present is already bought for birthday event', function (done) {
            req.body.amount = 15
            req.body.message = 'random message'
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({ birthdayPerson: 'value1', isBoughtPresent: true }) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({ _id: 'value2' }) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Present is already bought for this birthday event !')
                done()
            }).catch(done)
        })

        it('returns bad request because birthday event is in the past', function (done) {
            req.body.amount = 15
            req.body.message = 'random message'
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({ birthdayPerson: 'value1', isBoughtPresent: false, eventDate: new Date(2000, 10, 10) }) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({ _id: 'value2' }) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Birthay event is in the past !')
                done()
            }).catch(done)
        })

        it('returns bad request because user is already participant in this birthday event', function (done) {
            req.body.amount = 15
            req.body.message = 'random message'
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({ birthdayPerson: 'value1', isBoughtPresent: false, participants: [{ userId: 'id1' }, { userId: 'id2' }], eventDate: new Date(3025, 10, 10) }) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({ _id: 'id1' }) } })
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('You are already participant in this birthday event')
                done()
            }).catch(done)
        })

        it('returns ok with updated event', function (done) {
            req.body.amount = 15
            req.body.message = 'random message'
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return Promise.resolve({ birthdayPerson: 'value1', isBoughtPresent: false, participants: [{ userId: 'id1' }, { userId: 'id2' }], eventDate: new Date(3025, 10, 10), save: function () { return ({}) } }) } })
            const stub2 = sinon.stub(User, 'findOne').returns({ exec: function () { return Promise.resolve({ _id: 'id3' }) } })
            const stub3 = sinon.stub(UserPayment.prototype, 'save').returns({})
            BirthdayEventsController.addParticipant(req, res).then(results => {
                stub.restore()
                stub2.restore()
                stub3.restore()
                expect(res.statusCode).to.be.equal(200)
                done()
            }).catch(done)
        })

    })

    describe('BirthdayEventsController - buyPresent', function () {
        it('returns bad request because invalid birthday event ID format is provided', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').throws()
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Invalid birthday event ID format !')
                done()
            }).catch(done)
        })

        it('returns bad request because birthday event is not found', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { } }) } })
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Birthday event not found !')
                done()
            }).catch(done)
        })

        it('returns bad request because only event creator can buy a present', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { return ({ eventCreator: { name: 'name' } }) } }) } })
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Only event creator can buy a present !')
                done()
            }).catch(done)
        })

        it('returns bad request because there is no money to buy a present', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { return ({ totalMoneyAmount: 0, eventCreator: { name: undefined } }) } }) } })
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('There is no money to buy a present !')
                done()
            }).catch(done)
        })

        it('returns bad request because present is already bought for this event ', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { return ({ isBoughtPresent: true, totalMoneyAmount: 100, eventCreator: { name: undefined } }) } }) } })
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Present is already bought for this event !')
                done()
            }).catch(done)
        })

        it('returns bad request because item ID format is bad', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { return ({ isBoughtPresent: false, totalMoneyAmount: 100, eventCreator: { name: undefined } }) } }) } })
            const stub2 = sinon.stub(Item, 'findById').throws()
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong item ID format')
                done()
            }).catch(done)
        })

        it('returns bad request because item is not found', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { return ({ isBoughtPresent: false, totalMoneyAmount: 100, eventCreator: { name: undefined } }) } }) } })
            const stub2 = sinon.stub(Item, 'findById').returns(null)
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Item not found !')
                done()
            }).catch(done)
        })

        it('returns bad request because there is no enough money for present to be bought', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { return ({ isBoughtPresent: false, totalMoneyAmount: 100, eventCreator: { name: undefined } }) } }) } })
            const stub2 = sinon.stub(Item, 'findById').returns({ price: 150 })
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('You dont have enough money to buy a present !')
                done()
            }).catch(done)
        })

        it('returns ok with bought present', function (done) {
            const stub = sinon.stub(BirthdayEvent, 'findById').returns({ populate: function () { return ({ populate: function () { return ({ save: function () { return Promise.resolve({}) }, isBoughtPresent: false, totalMoneyAmount: 100, eventCreator: { name: undefined } }) } }) } })
            const stub2 = sinon.stub(Item, 'findById').returns({ price: 90 })
            const stub3 = sinon.stub(Present.prototype, 'save').returns(Promise.resolve({}))
            BirthdayEventsController.buyPresent(req, res).then(results => {
                stub.restore()
                stub2.restore()
                stub3.restore()
                expect(res.statusCode).to.be.equal(200)
                done()
            }).catch(done)
        })
    })

    describe('BirthdayEventsController - getPresentByBirthdayEventId', function () {
        it('returns bad request because birthday event ID has wrong format', function (done) {
            const stub = sinon.stub(Present, 'findOne').throws();
            BirthdayEventsController.getPresentByBirthdayEventId(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong birthday event ID format !')
                done()
            }).catch(done)
        })

        it('returns not found because present is not found', function (done) {
            const stub = sinon.stub(Present, 'findOne').returns({ populate: function () { return null } })
            BirthdayEventsController.getPresentByBirthdayEventId(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(404)
                expect(res.message).to.be.equal('Present not found for birthday event !')
                done()
            }).catch(done)
        })

        it('returns ok with found present', function (done) {
            const stub = sinon.stub(Present, 'findOne').returns({ populate: function () { return ({}) } })
            BirthdayEventsController.getPresentByBirthdayEventId(req, res).then(result => {
                stub.restore()
                expect(res.statusCode).to.be.equal(200)
                done()
            }).catch(done)
        })
    })
})
