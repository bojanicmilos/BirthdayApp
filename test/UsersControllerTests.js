const expect = require('chai').expect
const sinon = require('sinon')
const User = require('../models/User')
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
})

