const express = require('express')
const userController = require('./controllers/userController')
const adminController = require('./controllers/adminController')
const authController = require('./controllers/authController')
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

const upload = multer({ storage: storage })


  


const router = express.Router()

// user routes
router.get('/', userController.index)
router.post('/', userController.mailchimp)
router.get('/signup', authController.isAlreadyHere, userController.register)
router.post('/ok', userController.fixedAndRedirected, userController.ok)
router.get('/login', userController.isAuth, userController.login)
router.post('/login', userController.loggedIn)
router.get('/logout', userController.isReady, userController.logout)
router.get('/product/:productId', userController.findProductById)
router.post('/product/:productId/reviews', userController.isReady, userController.reviews)
router.get('/user/:id/profile', userController.isReady, userController.profile)
router.get('/pages/:pageid',  userController.pageId)
router.get('/browse/:catId',  userController.browse)
router.get('/contact', userController.isReady, userController.contact)
router.post('/contact', userController.isReady, userController.contactPost)
// paypal 
router.post('/pay/:id', userController.isReady, userController.pay)
router.get('/success/:id', userController.isReady, userController.success)
router.get('/cancel/:id', userController.isReady, userController.cancel)
// download 
router.get('/downloads/user/:userid', userController.isReady, userController.downloads)
// Admin routes
//router.get('/uploads/:id', adminController.uploadRandom)
router.get('/admin', authController.isAuth, adminController.index)
router.get('/admin/login', authController.isLogged, authController.login)
router.post('/admin/login', authController.loginCheck)
router.get('/admin/categories', authController.isAuth, adminController.categories)
router.post('/admin/categories', adminController.category)
router.get('/admin/logout', authController.isAuth, adminController.logout)
router.post('/admin/categories/:id/delete', authController.isAuth, adminController.deleteCats)
router.post('/admin/categories/:id/edit', authController.isAuth, adminController.editCats)
router.get('/404', adminController.page404)
router.get('/admin/items', authController.isAuth, adminController.items)
router.get('/admin/free_item', authController.isAuth, adminController.free_item)
router.post('/admin/free_item', authController.isAuth, upload.fields([{name : 'zip', maxCount : 1}, {name : 'cover', maxCount: 1}]), adminController.freeItemPost)
router.post('/admin/items', authController.isAuth, upload.fields([{name : 'zip', maxCount : 1}, {name : 'cover', maxCount: 1}, {name : 'screenshots', maxCount: 10}]), adminController.addItem)
router.post('/admin/items/:id/edit', authController.isAuth, adminController.productEdit)
router.post('/admin/items/:id/delete', authController.isAuth, adminController.productDelete)
router.get('/admin/customers', authController.isAuth, adminController.customers)
router.post('/admin/customers/:id/edit', authController.isAuth, adminController.customersEdit)
router.post('/admin/customers/:id/delete', authController.isAuth, adminController.customersDelete)
router.get('/admin/services', authController.isAuth, adminController.services)
router.post('/admin/services', authController.isAuth, upload.single('serviceimage'), adminController.postServices)
router.post('/admin/services/:url/edit', authController.isAuth, adminController.serviceEdit)
router.post('/admin/services/:url/delete', authController.isAuth, adminController.serviceDelete)
router.get('/admin/settings', authController.isAuth, adminController.settings)
router.post('/admin/settings', authController.isAuth, upload.single('logos'),adminController.settingsUpdate)
router.get('/admin/pages', authController.isAuth, adminController.pages)
router.post('/admin/pages', authController.isAuth, upload.single('background'), adminController.addPage)
router.post('/admin/pages/:id/edit', authController.isAuth, adminController.editPage)
router.post('/admin/pages/:id/delete', authController.isAuth, adminController.deletePage)
router.get('/admin/ourteam', authController.isAuth, adminController.ourteam)
router.post('/admin/ourteam', authController.isAuth, upload.single('memberAvatar'), adminController.memberAvatar)
router.post('/admin/ourteam/:id/edit', authController.isAuth , adminController.memberEdit)
router.post('/admin/ourteam/:id/delete', authController.isAuth , adminController.memberdelete)
router.get('/admin/downloads', authController.isAuth, adminController.downloads)
router.get('/admin/testimonial', authController.isAuth, adminController.testimonial)
router.post('/admin/testimonial', authController.isAuth, upload.single('avatar'), adminController.testimonialAdd)
router.post('/admin/testimonial/:id/edit', authController.isAuth, adminController.testimonialEdit)
router.post('/admin/testimonial/:id/delete', authController.isAuth, adminController.testimonialDel)
router.get('/admin/whatWeDo', authController.isAuth, adminController.WhatWeDo)
router.post('/admin/whatWeDo', authController.isAuth, upload.fields([{name : "background", maxCount : 1}, {name : "logo", maxCount : 1}]), adminController.WhatWeDoEdit)
router.get('/admin/socialNetwork', authController.isAuth, adminController.socialNetwork)
router.post('/admin/socialNetwork', authController.isAuth, adminController.socialNetworkPost)
module.exports = router