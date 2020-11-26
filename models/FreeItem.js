const freeItemCollection = require('../db').db().collection('freeItem')
const ObjectId = require('mongodb').ObjectID

const FreeItem = function(item, zipAndImage) {
    this.item = item
    this.files = zipAndImage
}

FreeItem.prototype.post = function() {
    return new Promise(async(resolve, reject) => {
        let free = await freeItemCollection.updateOne({}, {$set : {
            heading : this.item.heading,
            subHeading : this.item.subHeading,
            ZipAndImage : this.files
        }})
        resolve(free)
    })
}

module.exports = FreeItem