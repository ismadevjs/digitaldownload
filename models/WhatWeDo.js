const WhatWeDoCollection = require('../db').db().collection('whatWeDo')
const ObjectId = require('mongodb').ObjectID
const WhatWeDo = function(wedo, files) {
    this.wedo = wedo
    this.files = files
}

WhatWeDo.prototype.update = function() {
    return new Promise(async(resolve, reject) => { 
        await WhatWeDoCollection.updateOne({}, {$set : {
            weDoOne : this.wedo.weDoOne,
            weDoOneDescription : this.wedo.weDoOneDescription,
            weDoTwo : this.wedo.weDoTwo,
            weDoTwoDescription : this.wedo.weDoTwoDescription,
            weDoAllImages : this.files
        }})
        resolve()
    })
}

module.exports = WhatWeDo