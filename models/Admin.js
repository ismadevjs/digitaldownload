const adminCollection = require("../db").db().collection("admin");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const Admin = function (auth) {
  this.auth = auth;
  this.log = [];
};

Admin.prototype.clean = function () {
  if (typeof this.auth.username != "string") {
    this.auth.username = "";
  }

  this.auth = {
    username: this.auth.username.toLowerCase(),
    password: this.auth.password
  };
};

Admin.prototype.validate = function () {
  if ((this.auth.username = "")) {
    this.log.push("You must provide a username");
  }
  if ((this.auth.password = "")) {
    this.log.push("You must provide a password");
  }
};

Admin.prototype.loggedIn = function () {
  return new Promise(async (resolve, reject) => {
    // this.clean()
    // this.validate()
    if (!this.log.length) {
      await adminCollection.findOne({ username: this.auth.username }, (err, attempedAdmin) => {
        if (attempedAdmin && bcrypt.compareSync(this.auth.password, attempedAdmin.password)) {
          resolve();
        } else {
          reject(this.log);
        } // end else
      }); // end of await adminCollection
    } // end if log length
  }); // end of promise
}; // parent function

module.exports = Admin;
