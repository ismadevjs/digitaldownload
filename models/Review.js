const reviewCollection = require('../db').db().collection('reviews')
const productCollection = require('../db').db().collection('products')
const usersCollection = require('../db').db().collection('users')
const authorId = require('../db').db().collection('users')
const ObjectId = require('mongodb').ObjectId
const Review = function(reviews, author, productId, user) {
    this.reviews = reviews
    this.author = author
    this.productId = productId

}


Review.prototype.userReview = function() {
    return new Promise(async(resolve, reject) => {
         await productCollection.findOne({_id: ObjectId(this.productId)}, async(err, founded) => {
            if(err) {
                reject(err)
            } else {
                this.reviews = {
                    author: this.author.name,
                    product: founded._id,
                    rating: this.reviews.rating,
                    reviews: this.reviews.reviews,
                    reviewDescription: this.reviews.reviewDescription
                }
                await productCollection.updateOne({_id: ObjectId(this.productId)}, {$push : {
                    hasReview : this.reviews
                }})
                await usersCollection.updateOne({_id: ObjectId(this.author._id)}, {$set : {
                    hasItemReviewed : this.reviews
                }})
                await reviewCollection.insertOne(this.reviews)
                resolve()
            }
         })
    })
}
module.exports = Review