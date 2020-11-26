const productCollection = require('../db').db().collection('products')
const ObjectId = require('mongodb').ObjectId
// const categoryCollection = require('../db').db().collection('categories')
const Product = function(products, productId, reqFile) {
  this.products = products
  this.errors = []
  this.reqFile = reqFile
  this.productId = productId
}


Product.prototype.add = async function() {
  let today = new Date()
  

    
  this.products = {
    CategoryId :  this.products.CategoryId,
    ProductName : this.products.ProductName,
    ProductSdesc : this.products.ProductSdesc,
    ProductDemo : this.products.ProductDemo,
    ProductPrice : parseFloat(this.products.ProductPrice),
    ProductVersion : this.products.ProductVersion,
    textProductarea : this.products.textProductarea,
    selectFilesIncluded : this.products.selectFilesIncluded,
    zipProduct : this.reqFile,
    hasReview : [],
    Created_at : today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    Updated_at : today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  }

  
  return new Promise(async(resolve, reject) => {

   let x = await productCollection.insertOne(this.products, async(err, data) => {
     if(err) {
       reject(err)
     } else {
       resolve(data)
     }
   })

  })

} 


Product.prototype.pEdit = function() {
  return new Promise(async(resolve, reject) => {
    let today = new Date()
    await productCollection.updateOne({_id: ObjectId(this.productId)}, {$set : {
      CategoryId :  this.products.CategoryId,
      ProductName : this.products.editProductName,
      ProductSdesc : this.products.ProductSdesc,
      ProductDemo : this.products.ProductDemo,
      ProductPrice : parseFloat(this.products.ProductPrice),
      ProductVersion : this.products.ProductVersion,
      textProductareaUpdates : this.products.textProductareaUpdates,
      selectFilesIncluded : this.products.selectFilesIncluded,
      Updated_at : today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    }})
    resolve()
  })
}

Product.prototype.del = function() {
  return new Promise(async(resolve, reject) => {
    await productCollection.deleteOne({_id: ObjectId(this.productId)})
    resolve()
  })
}

// Product.prototype.found = function() {
//   return new Promise(async(resolve, reject) => {
//     this.founded = await productCollection.findOne({_id: ObjectId(this.productId)}, (err, f) => {
//       if(err) {
//         reject(err)
//       } else {
//         resolve(f)
//       }
//     })
   
//   })
// }
module.exports = Product
