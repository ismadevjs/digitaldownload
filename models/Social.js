const socialCollection = require('../db').db().collection('socials')
const ObjectID = require('mongodb').ObjectID

const Social = function(social) {
    this.social = social
}

Social.prototype.edit = function() {
    return new Promise(async(resolve, reject) => {
        await socialCollection.updateOne({}, {
            $set : {
                facebook : this.social.facebook,
                twitter : this.social.twitter,
                google : this.social.google,
                dribble : this.social.dribble,
                behance : this.social.behance
            }
        })
        resolve()
    })
}

module.exports = Social