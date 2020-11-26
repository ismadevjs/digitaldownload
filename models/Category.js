const categoryCollection = require('../db').db().collection('categories')
const ObjectId = require('mongodb').ObjectId
const Category = function(data, userId) {
  this.data = data
  this.errors = []
  this.userId = userId
}
const Delcat = function(userId) {
  this.userId = userId
}

Category.prototype.addCategory = function() {
  return new Promise(async (resolve, reject) => {
        let cats = await categoryCollection.insertOne(this.data)
        resolve(cats)
  })
}

Category.showCategory = function() {
  return new Promise(async (resolve, reject) => {
        let cats = await categoryCollection.find()
        if(cats) {
          resolve(cats)
        } else {
          reject()
        }

  })
}

Category.prototype.ditCats = function() {
  return new Promise(async (resolve, reject) => {

    await categoryCollection.updateOne({_id: ObjectId(this.userId)}, {$set: {categoryName: this.data.categoryName, categoryShortDescription: this.data.categoryShortDescription}})
    resolve()

  })
}

Category.prototype.del = function() {
  return new Promise(async(resolve, reject) => {
    await categoryCollection.deleteOne({_id: ObjectId(this.userId)})
    resolve()
  })
}
module.exports = Category
