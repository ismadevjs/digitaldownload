const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Page = require("../models/Page");
const Contact = require("../models/Contact");
const nodeMailer = require("nodemailer");
const path = require("path");
const categoryCollection = require("../db").db().collection("categories");
const usersCollection = require("../db").db().collection("users");
const productCollection = require("../db").db().collection("products");
const reviewCollection = require("../db").db().collection("reviews");
const serviceCollection = require("../db").db().collection("services");
const settingsCollection = require("../db").db().collection("settings");
const pageCollection = require("../db").db().collection("pages");
const memberCollection = require("../db").db().collection("ourteam");
const testimonialCollection = require("../db").db().collection("testimonials");
const paymentsCollection = require("../db").db().collection("payments");
const freeItemCollection = require("../db").db().collection("freeItem");
const WhatWeDoCollection = require("../db").db().collection("whatWeDo");
const socialCollection = require("../db").db().collection("socials");
const htmlspecialchars = require("htmlspecialchars");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const ObjectID = require("mongodb").ObjectID;
const request = require("superagent");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "AabNr02KOV_6FdDidTTslVlR_JNFk8p5AvYfszljBsgpn5eTe4qK-9FfCGnxXnep_6Q9Q9AUvvP8nqTz",
  client_secret: "EBO8n-ERj9xowsw8O_Z67djId_dVknGSPT_f6ZM9JKn8mKbFvQcVe5Co49ZBw9UHkXj4UEBEvP1toshx"
});

exports.index = async function (req, res) {
  let salt = bcrypt.genSaltSync(10);

  if (req.session.user) {
    res.render("frontend/index", {
      free: await freeItemCollection.findOne(),
      testimonials: await testimonialCollection.findOne(),
      pages: await pageCollection.find().toArray(),
      cats: await categoryCollection.find().toArray(),
      catsLimite: await categoryCollection.find().limit(5).toArray(),
      products: await productCollection.find().limit(12).toArray(),
      settings: await settingsCollection.findOne(),
      wedo: await WhatWeDoCollection.findOne(),
      socials: await socialCollection.findOne(),
      randCategory: await categoryCollection.aggregate([{ $sample: { size: 1 } }]).toArray(),
      logError: req.flash("pushError")
    });
  } else {
    res.render("frontend/index", {
      free: await freeItemCollection.findOne(),
      signin: "Sign In",
      testimonials: await testimonialCollection.findOne(),
      pages: await pageCollection.find().toArray(),
      cats: await categoryCollection.find().toArray(),
      catsLimite: await categoryCollection.find().limit(5).toArray(),
      products: await productCollection.find().limit(12).toArray(),
      settings: await settingsCollection.findOne(),
      wedo: await WhatWeDoCollection.findOne(),
      socials: await socialCollection.findOne(),
      randCategory: await categoryCollection.aggregate([{ $sample: { size: 1 } }]).toArray(),
      logError: req.flash("pushError")
    });
  }
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/login");
};
exports.isAuth = function (req, res, next) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

exports.isReady = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash("pushError", "You have To LogIn/ Register First");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};

exports.fixedAndRedirected = function (req, res, next) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

exports.login = async function (req, res) {
  res.render("frontend/login", {
    logginError: req.flash("logginError"),
    settings: await settingsCollection.findOne(),
    cats: await categoryCollection.find().toArray(),
    catsLimite: await categoryCollection.find().limit(5).toArray(),
    pages: await pageCollection.find().toArray(),
    free: await freeItemCollection.findOne(),
    socials: await socialCollection.findOne(),
    randCategory: await categoryCollection.aggregate([{ $sample: { size: 1 } }]).toArray()
  });
};

exports.loggedIn = function (req, res) {
  let user = new User(req.body);
  user
    .loggedIn()
    .then(() => {
      req.session.user = { _id: user.data._id, name: user.data.name, email: user.data.email };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(e => {
      req.flash("logginError", e);
      req.session.save(function () {
        res.redirect("/login");
      });
    });
};

exports.register = async function (req, res) {
  res.render("frontend/signup", {
    errors: req.flash("regErr"),
    settings: await settingsCollection.findOne(),
    cats: await categoryCollection.find().toArray(),
    catsLimite: await categoryCollection.find().limit(5).toArray(),
    pages: await pageCollection.find().toArray(),
    free: await freeItemCollection.findOne(),
    socials: await socialCollection.findOne(),
    randCategory: await categoryCollection.aggregate([{ $sample: { size: 1 } }]).toArray()
  });
};

exports.ok = function (req, res) {
  let user = new User(req.body);

  user
    .register()
    .then(() => {
      req.session.user = { _id: user.data._id, name: user.data.name, email: user.data.email };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(result => {
      req.flash("regErr", result);
      req.session.save(function () {
        res.redirect("/signup");
      });
    });
};

exports.findProductById = async function (req, res) {
  try {
    let productPage = await productCollection.findOne({ _id: ObjectID(req.params.productId) });
    let products = await productCollection.find().limit(3).toArray();
    let reviewsOfPAge = await reviewCollection.find().limit(6).toArray();
    let yu = await reviewCollection.find({ product: ObjectID(req.params.productId) }).toArray();
    let users = await usersCollection.find().toArray();
    let services = await serviceCollection.find().toArray();
    let categories = await categoryCollection.find().limit(4).toArray();
    // push reviews to product
    res.render("frontend/product", {
      socials: await socialCollection.findOne(),
      product: productPage,
      reviews: yu,
      users: users,
      products: products,
      services: services,
      cats: await categoryCollection.find().toArray(),
      pages: await pageCollection.find().toArray(),
      settings: await settingsCollection.findOne(),
      categories: categories,
      catsLimite: await categoryCollection.find().limit(5).toArray(),
      userNow: req.session.user
    });
  } catch (e) {
    res.send("eror");
  }
};

exports.reviews = function (req, res) {
  let rev = new Review(req.body, req.session.user, req.params.productId);
  rev
    .userReview()
    .then(() => {
      res.redirect("/product/" + req.params.productId);
    })
    .catch(() => {
      console.log("review not added");
    });
};

exports.mailchimp = function (req, res) {
  let mailchimpInstance = "us16";
  let listUniqueId = "2a0aadc615";
  let mailchimpApiKey = "956d82e307ef6b3d1cffce2fb2a16d1e-us16";
  request
    .post("https://" + mailchimpInstance + ".api.mailchimp.com/3.0/lists/" + listUniqueId + "/members/")
    .set("Content-Type", "application/json;charset=utf-8")
    .set("Authorization", "Basic " + new Buffer("any:" + mailchimpApiKey).toString("base64"))
    .send({
      email_address: req.body.emailMailChimp,
      status: "subscribed"
    })
    .end(function (err, response) {
      if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
        res.redirect("/"); // add subscribed message with flush
      } else {
        res.redirect("/"); // send error flash
      }
    });
};

exports.profile = async function (req, res) {
  if (req.session.user._id == req.params.id) {
    res.render("frontend/profile", {
      socials: await socialCollection.findOne(),
      pages: await pageCollection.find().toArray(),
      products: await productCollection.find().toArray(),
      catsLimite: await categoryCollection.find().limit(5).toArray(),
      cats: await categoryCollection.find().toArray(),
      settings: await settingsCollection.findOne()
    });
  } else {
    res.redirect("/");
  }
};

exports.pay = async function (req, res) {
  await productCollection.findOne({ _id: ObjectID(req.params.id) }, (err, o) => {
    if (o) {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal"
        },
        redirect_urls: {
          return_url: "http://localhost:3000/success/" + req.params.id,
          cancel_url: "http://localhost:3000/cancel"
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: o.ProductName,
                  sku: "001",
                  price: o.ProductPrice,
                  currency: "USD",
                  quantity: 1
                }
              ]
            },
            amount: {
              currency: "USD",
              total: o.ProductPrice
            },
            description: o.ProductSdesc
          }
        ]
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
    } else {
      res.send(err);
    }
  });
};

exports.success = async function (req, res) {
  await productCollection.findOne({ _id: ObjectID(req.params.id) }, (err, o) => {
    if (o) {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;

      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: o.ProductPrice
            }
          }
        ]
      };

      paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          let today = new Date();
          // find and delete repétition

          await usersCollection
            .updateOne(
              { _id: ObjectID(req.session.user._id) },
              {
                $push: {
                  productId: o._id,
                  purshased_at: today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(),
                  hasPaymentInfo: payment
                }
              }
            )
            .then(() => {
              // console.log(JSON.stringify(payment));
              res.redirect("/downloads/user/" + req.session.user._id);
            })
            .catch(() => {
              res.redirect("/cancel");
            });

          // , async(err, foundedUserItem) => {

          // 	await paymentsCollection.insertOne(payment)
          // 		console.log(JSON.stringify(payment));
          // 		res.redirect('/downloads/user/' + req.session.user._id);
          // 	// }
          // })
        }
      });
    } else {
      res.send(err);
    }
  });
};

exports.cancel = function (req, res) {
  res.send("Cancelled");
};

exports.downloads = async function (req, res) {
  res.render("frontend/downloads", {
    categories: await categoryCollection.find().toArray(),
    pages: await pageCollection.find().toArray(),
    products: await productCollection.find().toArray(),
    users: await usersCollection
      .aggregate([
        { $match: { _id: ObjectID(req.params.userid) } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productsFounded"
          }
        }
      ])
      .toArray(),
    catsLimite: await categoryCollection.find().limit(5).toArray(),
    settings: await settingsCollection.findOne(),
    cats: await categoryCollection.find().toArray()
  });
};

exports.pageId = function (req, res) {
  let pages = new Page(req.body, req.params.pageid);
  pages
    .getPage()
    .then(async () => {
      res.render("frontend/pageid", {
        socials: await socialCollection.findOne(),
        settings: await settingsCollection.findOne(),
        pages: await pageCollection.find().toArray(),
        pageId: await pageCollection.findOne({ _id: ObjectID(req.params.pageid) }),
        cats: await categoryCollection.find().toArray(),
        catsLimite: await categoryCollection.find().limit(5).toArray(),
        members: await memberCollection.find().toArray(),
        htmlspecialchars: htmlspecialchars()
      });
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.browse = async function (req, res) {
  await categoryCollection.findOne({ _id: ObjectID(req.params.catId) }, async (err, founded) => {
    if (err) {
      res.redirect("/404");
    } else {
      // check if url is emty
      if (req.originalUrl == "/browse/" + founded._id) {
        res.redirect("/browse/" + founded._id + "?page=1&limit=6");
      } // end url check

      // pagination
      let resPerPage = 6;
      let limit = req.query.limit;
      let page = req.query.page;
      const searchQuery = req.query.search;
      const foundCats = await productCollection
        .aggregate([
          {
            $lookup: {
              from: "categories",
              localField: "CategoryId",
              foreignField: "categoryName",
              as: "categoryFounded"
            }
          }
        ])
        .skip(limit * page - limit)
        .toArray();
      // count how many categories founded
      const numOfCategories = await productCollection.countDocuments();

      // end pagination
      res.render("frontend/browse", {
        socials: await socialCollection.findOne(),
        founded: founded,
        settings: await settingsCollection.findOne(),
        pages: await pageCollection.find().toArray(),
        catsLimite: await categoryCollection.find().limit(5).toArray(),
        products: foundCats,
        cats: await categoryCollection.find().toArray(),
        services: await serviceCollection.find().toArray(),
        currentPage: page,
        limit: limit,

        //pagesCato: Math.ceil(numOfCategories / resPerPage),
        numOfResults: numOfCategories
      });
    }
  });
};
exports.contact = async function (req, res) {
  try {
    res.render("frontend/contact", {
      socials: await socialCollection.findOne(),
      settings: await settingsCollection.findOne(),
      pages: await pageCollection.find().toArray(),
      catsLimite: await categoryCollection.find().limit(5).toArray(),
      products: await productCollection.find().toArray(),
      cats: await categoryCollection.find().toArray()
    });
  } catch (e) {
    res.send("error rendering contact");
  }
};
exports.contactPost = function (req, res) {
  let contact = new Contact(req.body);
  contact
    .send()
    .then(() => {
      res.redirect("/contact");
    })
    .catch(() => {
      res.redirect("/404");
    });
};
