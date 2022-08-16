const expect = require('chai').expect
const sinon = require('sinon')
const User = require('../models/User')
const Item = require('../models/Item')
const BirthdayEvent = require('../models/BirthdayEvent')
const BirthdayEventsController = require('../controllers/BirthdayEventsController')

describe('BirthdayEventsController', function() {
    let req, res;

    this.beforeEach(function() {
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
           status: function(statusCode) {
               this.statusCode = statusCode
               return this
           },
           send: function(message) {
               this.message = message
           },
           json: function(data) {
               return data
           }
       }
   })

   describe('BirthdayEventsController - addEvent', function() {
    it('returns bad request because username format of event creator is bad', function(done) {
        const stub = sinon.stub(User, 'findOne').throws()

        BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(400)
            expect(res.message).to.be.equal('Wrong username format for event creator!')
            done()
        }).catch(done)
    })

    it('returns bad request because event creator is not found', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves(null)})

        BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(404)
            expect(res.message).to.be.equal('Event creator not found !')
            done()
        }).catch(done)
    })

    it('returns bad request because wrong ID format for birthday person is specified', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({})})
        const stub2 = sinon.stub(User, 'findById').throws()

        BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
            stub.restore()
            stub2.restore()
            expect(res.statusCode).to.be.equal(400)
            expect(res.message).to.be.equal('Wrong ID format for birthday person')
            done()
        }).catch(done)
    })

    it('returns bad request because birthday person is not found', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({})})
        const stub2 = sinon.stub(User, 'findById').returns(null)

        BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
            stub.restore()
            stub2.restore()
            expect(res.statusCode).to.be.equal(400)
            expect(res.message).to.be.equal('Birthday person not found !')
            done()
        }).catch(done)
    })

    it('returns bad request because event creator cant make event for himself', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({_id: 'id'})})
        const stub2 = sinon.stub(User, 'findById').returns({_id: 'id'})

        BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
            stub.restore()
            stub2.restore()
            expect(res.statusCode).to.be.equal(400)
            expect(res.message).to.be.equal('You cant make event for yourself !')
            done()
        }).catch(done)
    })

    it('returns bad request because birthday of a person is not in the future', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({_id: 'id'})})
        const stub2 = sinon.stub(User, 'findById').returns({_id: 'id2', birthDate: '2000-01-01'})

        BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
            stub.restore()
            stub2.restore()
            expect(res.statusCode).to.be.equal(400)
            expect(res.message).to.be.equal('Birthday of a person is not in the future !')
            done()
        }).catch(done)
    })

    it('returns bad request because birthday person already has upcoming event created.', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({_id: 'id'})})
        const stub2 = sinon.stub(User, 'findById').returns({_id: 'id2', birthDate: '2000-12-31'})
        const stub3 = sinon.stub(BirthdayEvent, 'find').returns([{event: 'random event'}])

        BirthdayEventsController.addBirthdayEvent(req, res).then(result => {
            stub.restore()
            stub2.restore()
            stub3.restore()
            expect(res.statusCode).to.be.equal(400)
            expect(res.message).to.be.equal('Person already got upcomming event created !')
            done()
        }).catch(done)
    })

    it('returns bad request because wrong event data is provided', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({_id: 'id'})})
        const stub2 = sinon.stub(User, 'findById').returns({_id: 'id2', birthDate: '2000-12-31'})
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

    it('returns created result', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves({_id: 'id'})})
        const stub2 = sinon.stub(User, 'findById').returns({_id: 'id2', birthDate: '2000-12-31'})
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

   describe('BirthdayEventsController - getCurrentEvents', function() {
    it('returns list of current events', function(done){
        const stub = sinon.stub(BirthdayEvent, 'find').returns({populate: sinon.stub().returns([{ birthdayPerson: { name: 'random name' } }])})

        BirthdayEventsController.getCurrentEvents(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(200)
            done()
        }).catch(done)
    })
   })

   describe('BirthdayEventsController - getAllEvents', function() {
    it('returns list of all events', function(done) {
        const stub = sinon.stub(BirthdayEvent, 'find').returns({populate: sinon.stub().returns(Promise.resolve([{birthdayPerson: {name: 'name'}}]))})
        BirthdayEventsController.getAllEvents(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(200)
            done()
        }).catch(done)
    })
   })
})
