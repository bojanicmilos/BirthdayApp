const expect = require('chai').expect
const sinon = require('sinon')
const User = require('../models/User')
const Item = require('../models/Item')
const UsersController = require('../controllers/UsersController')

describe('UsersController', function() {
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

   describe('UsersController - login', function() {

    it('throws an error because wrong parameter is passed to findOne', function(done) {
        const stub = sinon.stub(User, 'findOne').throws()
        UsersController.login(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(404)
            expect(res.message).to.be.equal('Invalid username error')
            done()
        }).catch(done)
    })

    it('returns not found user', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves(null) })
        UsersController.login(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(404)
            expect(res.message).to.be.equal('User not found')
            done()
        }).catch(done)
    })

    it('returns ok with successful login', function(done) {
        const stub = sinon.stub(User, 'findOne').returns({ exec: sinon.stub().resolves('resolved') })
        UsersController.login(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(200)
            done()
        }).catch(done)
    })
   })

   describe('UsersController - logout', function() {
    it('sends logout message with ok status', function(done) {
        UsersController.logout(req, res).then(result => {
            expect(res.statusCode).to.be.equal(200)
            expect(res.message).to.be.equal('Logout')
            done()
        }).catch(done)
    })
   })

   describe('UsersController - getAllUsersWithUpcomingBirthdays', function() {
    it('returns ok status with list of users', function(done) {
        const stub = sinon.stub(User, 'find').returns(Promise.resolve([]))
        UsersController.getAllUsersWithUpcomingBirthdays(req, res).then(result => {
            stub.restore()
            expect(res.statusCode).to.be.equal(200)
            done()
        }).catch(done)
    })
   })

   describe('UsersController - addUser', function() {
    it('returns bad request because username is not provided', function(done) {
        UsersController.addUser(req, res).then(result => {
            expect(res.message).to.be.equal('Username not provided.')
            expect(res.statusCode).to.be.equal(400)
            done()
        }).catch(done)
    })

    it('returns bad request because date format is wrong', function(done) {
        req.body.name = 'name'
        UsersController.addUser(req, res).then(result => {
            expect(res.message).to.be.equal('Wrong date')
            expect(res.statusCode).to.be.equal(400)
            done()
        }).catch(done)
    })

    it('returns bad request because wish list provided has duplicate IDs', function(done) {
        req.body.name = 'name'
        req.body.birthDate = '2000-05-05'
        req.body.wishList = ['id', 'id']

        UsersController.addUser(req, res).then(result => {
            expect(res.message).to.be.equal('Wish list has duplicate items.')
            expect(res.statusCode).to.be.equal(400)
            done()
        }).catch(done)
    })

    it('returns bad request because ID from wish list does not exist', function(done) {
        req.body.name = 'name'
        req.body.birthDate = '2000-05-05'
        req.body.wishList = ['id1', 'id2']
        const stub = sinon.stub(Item, 'findById').returns(null)

        UsersController.addUser(req, res).then(result => {
            stub.restore()
            expect(res.message).to.be.equal('Invalid item ID')
            expect(res.statusCode).to.be.equal(400)
            done()
        }).catch(done)
    })
   })
})

