const pageCollection = require('../db').db().collection('pages')
const ObjectId = require('mongodb').ObjectId

const Page = function(page, id, file) {
    this.page = page
    this.id = id
    this.file = file
}

Page.prototype.addPage = function() {
    this.page = {
        pageTitle : this.page.pageTitle,
        pageBody  : this.page.pageBody,
        textAreaForPages : this.page.textAreaForPages,
        background : this.file
    }
    return new Promise(async(resolve, reject) => {
        await pageCollection.insertOne(this.page)
        resolve()
    })
}

Page.prototype.edit = function() {
    return new Promise(async(resolve, reject) => {
        await pageCollection.updateOne({_id: ObjectId(this.id)}, {$set: {
            pageTitle : this.page.pageTitle,
            pageBody  : this.page.pageBody,
            textAreaForPages : this.page.textAreaForPages,
        }})
        resolve()
    })
}

Page.prototype.delete = function() {
    return new Promise(async(resolve, reject) => {
        await pageCollection.deleteOne({_id: ObjectId(this.id)})
        resolve()
    })
}

Page.prototype.getPage = function() {
    return new Promise(async(resolve, reject) => {
        await pageCollection.findOne({_id: ObjectId(this.id)}, (err, foundedUrl) => {
          if(foundedUrl && foundedUrl._id == this.id) {
            resolve(foundedUrl)
          } else {
            reject(ObjectId(err))
          }
        })

    })
}

module.exports = Page