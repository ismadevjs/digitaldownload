
const memberCollection = require('../db').db().collection('ourteam')
const ObjectId = require('mongodb').ObjectID
const Member = function(member, memberId, avatar) {
    this.member = member
    this.memberId = memberId
    this.avatar = avatar
}

Member.prototype.add = function() {
    this.member = {
        memberName : this.member.memberName,
        memberWork : this.member.memberWork,
        memberAvatar : this.avatar
    }
    return new Promise(async(resolve, reject) => {
        await memberCollection.insertOne(this.member)
        resolve()
    })
}

Member.prototype.edit = function() {
    return new Promise(async(resolve, reject) => {

        await memberCollection.updateOne({_id: ObjectId(this.memberId)}, {$set : {
            memberName : this.member.memberName,
            memberWork : this.member.memberWork,
        }})
        resolve()
    })
}

Member.prototype.delete = function() {
    return new Promise(async(resolve, reject) => {
        await memberCollection.deleteOne({_id: ObjectId(this.memberId)})
        resolve()
    })
}

module.exports = Member