const expect = require('chai').expect
const sinon = require('sinon')
const Item = require('../models/Item')
const User = require('../models/User')
const ItemsController = require('../controllers/ItemsController')

describe('Items Controller', function () {
    let req, res;
    this.beforeEach(function () {
        req = {
            body: {
                name: '',
                urlLink: ''
            },
            params: {

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
    describe('Items Controller - addItem', function () {
        it('returns bad request because name is not provided', function (done) {
            ItemsController.addItem(req, res).then((result) => {
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('You must provide item name !')
                done()
            }).catch(done)
        })

        it('throws error because duplicate item name is provided', function (done) {
            req.body.name = 'itemname'
            const stub = sinon.stub(Item.prototype, 'save').throws()
            ItemsController.addItem(req, res).then((result) => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Duplicate item name !')
                done()
            }).catch(done)
        })

        it('creates item and returns json', function (done) {
            req.body.name = 'itemname'
            const stub = sinon.stub(Item.prototype, 'save').returns({})
            ItemsController.addItem(req, res).then((result) => {
                stub.restore()
                expect(res.statusCode).to.be.equal(201)
                done()
            }).catch(done)
        })
    })

    describe('Items controller - deleteItem', function () {
        it('throws an error because wrong item ID format is provided', function (done) {
            req.params.itemId = '1'
            const stub = sinon.stub(Item, 'findByIdAndDelete').throws()
            ItemsController.deleteItem(req, res).then((result) => {
                stub.restore()
                expect(res.statusCode).to.be.equal(400)
                expect(res.message).to.be.equal('Wrong Item ID format')
                done()
            }).catch(done)
        })

        it('returns not found because item is not found by ID', function (done) {
            req.params.itemId = '1'
            const stub = sinon.stub(Item, 'findByIdAndDelete').returns(null)
            ItemsController.deleteItem(req, res).then((result) => {
                stub.restore()
                expect(res.statusCode).to.be.equal(404)
                expect(res.message).to.be.equal('Item not found')
                done()
            }).catch(done)
        })

        it('returns ok with message of deletion', function (done) {
            req.params.itemId = '62ff86161211a08902ad14d9'
            const stub = sinon.stub(Item, 'findByIdAndDelete').returns({})
            const stub2 = sinon.stub(User, 'find').returns([{ save: function () { return Promise.resolve({}) }, wishList: [{ _id: 'random id' }] }])
            ItemsController.deleteItem(req, res).then((result) => {
                stub.restore()
                stub2.restore()
                expect(res.statusCode).to.be.equal(200)
                expect(res.message).to.be.equal('Item deleted !')
                done()
            }).catch(done)
        })
    })
})



