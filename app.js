const express = require('express')
const router = require('./router')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(session)
const htmlspecialchars = require('htmlspecialchars')

const app = express()
// app.use((req, res) => {
// 	res.locals.user = req.session.user
// })

let sessionOptions = session({
  secret: 'trying to learn some code by my self',
  store : new MongoStore({
    client : require('./db'),
    httpOnly : true
  }),
  resave: false,
  saveUninitialized: true,
  maxAge : 1000 * 60 * 60 * 24,
  cookies : {secure : true}
})

app.use(sessionOptions)
app.use(cookieParser())

app.use(function(req, res, next) {
  res.locals.user = req.session.user
  next()
})

app.use(function(req, res, next) {
  res.locals.admin = req.session.admin
  next()
})
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(flash())
app.use('/', router)
module.exports = app
