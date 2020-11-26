const productCollection = require('../db').db().collection('products')

const Pay = function(pay, id) {
    this.pay = pay
    this.id = id
}


Pay.prototype.pay = function() {
    return new Promise(async(resolve, reject) => {
        let x = await productCollection.findOne({_id: ObjectID(this.id)})
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": x.ProductName,
                        "sku": "001",
                        "price": x.ProductPrice,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": x.ProductPrice
                },
                "description": x.ProductSdesc
            }]
        }
        
        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
              throw error
          } else {
              for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                  res.redirect(payment.links[i].href)
                }
              }
          }
        })	
        resolve()
    })
}