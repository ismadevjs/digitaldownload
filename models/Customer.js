const customerCollection = require('../db').db().collection('users')
const ObjectId = require('mongodb').ObjectID

const Customer = function(user, userId) {
    this.user = user
    this.userId = userId
}


Customer.prototype.customerEdit = function() {
    return new Promise(async(resolve, reject) => {
        await customerCollection.updateOne({_id: ObjectId(this.userId)}, {$set: {
            name : this.user.customerName,
            email : this.user.customerEmail
        }})
        resolve()
    })
}

Customer.prototype.customerDelete = function() {
    return new Promise(async(resolve, reject) => {
        await customerCollection.deleteOne({_id: ObjectId(this.userId)})
        resolve()
    })
}

module.exports = Customer