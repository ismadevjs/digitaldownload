const settingsCollection = require('../db').db().collection('settings')
const ObjectId = require('mongodb').ObjectId
const Setting = function(setting, file) {
    this.setting = setting
    this.file = file
}


Setting.prototype.edit = function() {
    return new Promise(async(resolve, reject) => {
        await settingsCollection.updateOne({}, {$set:{
            sitename : this.setting.sitename,
            settingsAbout : this.setting.settingsAbout,
            heading : this.setting.heading,
            subHeading : this.setting.subHeading,
            logos : this.file,
            footer : this.setting.footer
        }})
        resolve()
    })
}

module.exports = Setting