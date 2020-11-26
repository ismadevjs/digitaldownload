const contactCollection = require('../db').db().collection('contact')
const nodeMailer = require('nodemailer')

const Contact = function(info) {
    this.info = info
}

Contact.prototype.send = function() {
    return new Promise(async(resolve, reject) => {


	let transporter = nodeMailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			// TODO : should be replaced with real sender's account
			user: '', 
			pass: ''
		}
	})
	let mailOptions = {
		// should be replaced with real recipient's account
        to: 'info@gmail.com',
        name : this.info.name,
		email: this.info.email,
		body: this.info.description
	}
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message %s sent: %s', info.messageId, info.response);
	})
        await contactCollection.insertOne(this.info)
        resolve()
    })
}

module.exports = Contact