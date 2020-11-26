const testimonialCollection = require('../db').db().collection('testimonials')
const ObjectId = require('mongodb').ObjectId
const Testimonial = function(testimonial, id, avatar) {
    this.testimonial = testimonial
    this.id = id
    this.avatar = avatar
}


Testimonial.prototype.add = function() {
    this.testimonial = {
        TestimonialName : this.testimonial.TestimonialName,
        avatar : this.avatar,
        TestimonialDescription : this.testimonial.TestimonialDescription,
        TestimonialWork : this.testimonial.TestimonialWork
    }
 return new Promise(async(resolve, reject) => {
    let testimonial = await testimonialCollection.insertOne(this.testimonial)
    resolve(testimonial)
 })
}

Testimonial.prototype.edit = function() {
    return new Promise(async(resolve, reject) => {
        await testimonialCollection.updateOne({_id: ObjectId(this.id)}, {$set: {
            TestimonialName : this.testimonial.TestimonialName,
            TestimonialDescription : this.testimonial.TestimonialDescription,
            TestimonialWork : this.testimonial.TestimonialWork
        }})
        resolve()
    })
}

Testimonial.prototype.delete = function() {
    return new Promise(async(resolve, reject) => {
        await testimonialCollection.deleteOne({_id: ObjectId(this.id)})
        resolve()
    })
}

module.exports = Testimonial