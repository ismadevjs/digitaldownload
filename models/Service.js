const serviceCollection = require('../db').db().collection('services')
const ObjectId = require('mongodb').ObjectId
const Service = function(service, url, reqFile) {
    this.service = service
    this.reqFile = reqFile
    this.url = url
}


Service.prototype.post = function() {
    
    return new Promise(async (resolve, reject) => {

        this.data = {
            ServiceName : this.service.ServiceName,
            textProductarea : this.service.textProductarea,
            imageService : this.reqFile
        }

        await serviceCollection.insertOne(this.data)
        resolve()
    })
}

Service.prototype.edit = function() {
    return new Promise(async(resolve, reject) => {
      await serviceCollection.updateOne({_id: ObjectId(this.url)}, {$set: {
        ServiceName: this.service.ServiceName,
        textProductarea: this.service.textProductarea
      }})
      resolve()  
    })
}

Service.prototype.delete = function() {
    return new Promise(async(resolve, reject) => { 
        await serviceCollection.deleteOne({_id: ObjectId(this.url)})
        resolve()
    })
}

module.exports = Service