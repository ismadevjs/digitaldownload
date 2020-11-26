let userCollection = require('../db').db().collection('users')
//const ObjectId = require('mongodb').ObjectID
const validator = require('validator')
const bcrypt = require('bcryptjs')
const User = function(data) {
	this.data = data
	this.errors = []
}



User.prototype.validation = function() {
		if(this.data.name == "") {this.errors.push('You must provide a Full name')}
		if(!validator.isEmail(this.data.email)) {this.errors.push('You must provide an Email')}
		if(this.data.password == "") {this.errors.push('You must provide a Password')}
		if(this.data.rpassword == "") {this.errors.push('You must provide a Retyped password')}
		if(this.data.password != this.data.rpassword) {this.errors.push('password dont match')}
		if(this.data.name.length > 0 && this.data.name.length < 3) {this.errors.push('Full name must contain more than 3 charachters')}
		if(this.data.password.length > 0 && this.data.rpassword.length < 6) {this.errors.push('password contain more than 6 charachters')}
}
 User.prototype.AlreadyExist = async function() {
	 return new Promise(async(resolve, reject) => {
		 await userCollection.findOne({email: this.data.email}, (err, user) => {
			 if(user && user.email == this.data.email) {
				 reject('email already taken') // rah yahbess hna
			 } else {
				 resolve()
			 }
		 })
	 })
}

User.prototype.loggedIn = function() {

	return new Promise(async(resolve, reject) => {
		await userCollection.findOne({email: this.data.email}, (err, attempedUser) => {
			if(attempedUser && bcrypt.compareSync(this.data.password, attempedUser.password)) {
				// ovveride data inserted by the data in the db to get result
				this.data._id = attempedUser._id
				this.data.name = attempedUser.name
				resolve()
			}  else {
				reject(err)
			}
		})
	})

}

User.prototype.Ov = function() {
	this.data = {
		name : this.data.name,
		email : this.data.email,
		password : this.data.password,
		rpassword : this.data.rpassword,
		productId : [],
		hasPaymentInfo : []
	}
}

User.prototype.register = function() {
	
	return new Promise(async(resolve,reject) => {
	 this.validation()
	 this.Ov()
	 
	 if(this.errors.length) {
		 reject(this.errors)
	 } else {
		  // Bug Fixed
		 await this.AlreadyExist().then(() => {
				let salt = bcrypt.genSaltSync(12)
				this.data.password = bcrypt.hashSync(this.data.password, salt)
				this.data.rpassword = bcrypt.hashSync(this.data.rpassword, salt)
				userCollection.insertOne(this.data)
				resolve()
		 }).catch((e) => {
				reject(this.errors)
		 })
	 }



})
}
module.exports = User
