const Admin = require('../models/Admin')

exports.isAuth = function(req, res, next) {
  if(req.session.admin) {
    next()
  } else {
    req.flash('AdloginErr', 'Sorry, you don\'t have access')
    res.redirect('/admin/login')
  }
 }
exports.login = function(req, res) {
  res.render('backend/login', {
    AdloginErr: req.flash('AdloginErr')
  })
}

exports.isLogged = function(req, res, next) {
  if(req.session.admin) {
    req.session.save(function() {
      res.redirect('/admin')
    })
  } else {
    next()
  }
}



  exports.isAuth = function(req, res, next) {
    if(req.session.admin) {
      next()
    } else {
      req.flash('AdloginErr', 'Sorry, you don\'t have access')
      res.redirect('/admin/login')
    }
   }


exports.loginCheck = function(req, res) {
  let admin = new Admin(req.body)
  admin.loggedIn().then(() => {
    req.session.admin = {username: admin.auth.username}
    req.session.save(function() {
      res.redirect('/admin')
    })
  }).catch((e) => {
    res.send(e)
  })
}

exports.isAlreadyHere = function(req ,res, next){
  if (req.session.user) {
    res.redirect('/') // TODO Message error (you have to logout first)
  } else {
    next()
  }
}