const Category = require("../models/Category");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Service = require("../models/Service");
const Setting = require("../models/Setting");
const Page = require("../models/Page");
const Member = require("../models/Member");
const WhatWeDo = require("../models/WhatWeDo");
const Testimonial = require("../models/Testimonial");
const FreeItem = require("../models/FreeItem");
const Social = require("../models/Social");
const categoryCollection = require("../db").db().collection("categories");
const productCollection = require("../db").db().collection("products");
const customerCollection = require("../db").db().collection("users");
const serviceCollection = require("../db").db().collection("services");
const settingsCollection = require("../db").db().collection("settings");
const pagesCollection = require("../db").db().collection("pages");
const memberCollection = require("../db").db().collection("ourteam");
const testimonialCollection = require("../db").db().collection("testimonials");
const WhatWeDoCollection = require("../db").db().collection("whatWeDo");
const freeItemCollection = require("../db").db().collection("freeItem");
const reviewCollection = require("../db").db().collection("reviews");

const ObjectID = require("mongodb").ObjectID;

function url(site) {
  if (req.originalUrl == "/admin/" + site) {
    res.redirect("/admin/" + site + "?page=1&limit=5");
  }
}

exports.index = async function (req, res) {
  let orders = 0;
  let customers = await customerCollection.find().toArray();
  customers.forEach(function (customer) {
    orders = orders + customer.productId.length;
  });
  res.render("backend/index", {
    settings: await settingsCollection.findOne(),
    orders: orders,
    users: customers.length,
    products: await productCollection.find().toArray(),
    reviews: await reviewCollection.find().toArray()
  });
};
exports.categories = async function (req, res) {
  try {
    let cats = await categoryCollection.find().toArray();
    // check if url is emty
    if (req.originalUrl == "/admin/categories") {
      res.redirect("/admin/categories?page=1");
    } // end url check

    // pagination
    let resPerPage = 5;
    let page = req.query.page;
    const searchQuery = req.query.search;
    const foundCats = await categoryCollection
      .find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .toArray();
    // count how many categories founded
    const numOfCategories = await categoryCollection.countDocuments();

    // end pagination
    res.render("backend/categories", {
      settings: await settingsCollection.findOne(),
      cato: foundCats,
      currentPage: page,
      pagesCato: Math.ceil(numOfCategories / resPerPage),
      numOfResults: numOfCategories
    });
  } catch (e) {
    res.send(e);
  }
};

exports.category = function (req, res) {
  // check if url is emty
  if (req.originalUrl == "/admin/items") {
    res.redirect("/admin/items?page=1&limit=5");
  } // end url check

  let cat = new Category(req.body);
  cat
    .addCategory()
    .then(() => {
      res.redirect("/admin/categories");
    })
    .catch(() => {
      res.redirect("404");
    });
};
exports.page404 = function (req, res) {
  res.render("backend/404");
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/admin/login");
};

exports.editCats = function (req, res) {
  let catt = new Category(req.body, req.params.id);
  catt
    .ditCats()
    .then(() => {
      res.redirect("/admin/categories");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.deleteCats = function (req, res) {
  let delcat = new Category(req.body, req.params.id);
  delcat
    .del()
    .then(() => {
      res.redirect("/admin/categories");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.items = async function (req, res) {
  // check if url is emty
  if (req.originalUrl == "/admin/items") {
    res.redirect("/admin/items?page=1");
  } // end url check

  try {
    let colors = ["primary", "secondary", "success", "danger", "warning", "info"];
    let categories = await categoryCollection.find().toArray();

    // pagination
    let resPerPage = 5;
    let page = req.query.page;
    const searchQuery = req.query.search;
    const foundProduct = await productCollection
      .find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .toArray();
    // count how many categories founded
    const numOfProducts = await productCollection.countDocuments();

    // end pagination

    //  // pagination
    //   let page = req.query.page
    //   let limit = req.query.limit

    //   let startIndex = (page - 1) * limit
    //   let endIndex = page * limit

    //   let pagination = products.slice(startIndex, endIndex)

    // // end pagination
    res.render("backend/items", {
      settings: await settingsCollection.findOne(),
      // counterProducts : products,
      // products : pagination,
      // colors : colors,
      categories: categories,
      products: foundProduct,
      currentPage: page,
      colors: colors,
      pagesProducts: Math.ceil(numOfProducts / resPerPage),
      numOfResults: numOfProducts
      //site : process.env.SITENAME,
    });
  } catch (e) {
    res.send(e);
  }
};

exports.addItem = function (req, res) {
  let addProduct = new Product(req.body, req.params.id, req.files);
  addProduct
    .add()
    .then(() => {
      req.session.product = { _id: addProduct._id, name: addProduct.products.ProductName, ProductSdesc: addProduct.products.ProductSdesc, ProductPrice: parseFloat(addProduct.products.ProductPrice) };
      res.redirect("/admin/items");
    })
    .catch(e => {
      res.send(e);
    });
};
// dont forget to add error message to the edited file
exports.productEdit = function (req, res) {
  let itemEdited = new Product(req.body, req.params.id);
  itemEdited
    .pEdit()
    .then(() => {
      res.redirect("/admin/items");
    })
    .catch(() => {
      res.redirect("/404");
    });
};
// dont forget to add error message to the deleted file
exports.productDelete = function (req, res) {
  let itemDel = new Product(req.body, req.params.id);
  itemDel
    .del()
    .then(() => {
      res.redirect("/admin/items");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.customers = async function (req, res) {
  try {
    // check if url is emty
    if (req.originalUrl == "/admin/customers") {
      res.redirect("/admin/customers?page=1");
    } // end url check
    let customer = await customerCollection.find().toArray();
    // pagination
    let resPerPage = 5;
    let page = req.query.page;
    const searchQuery = req.query.search;
    const foundCats = await customerCollection
      .find()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .toArray();
    // count how many categories founded
    const numOfCategories = await customerCollection.countDocuments();

    // end pagination

    res.render("backend/customers", {
      settings: await settingsCollection.findOne(),
      countercustomers: customer,
      users: await customerCollection
        .aggregate([
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
      customer: foundCats,
      currentPage: page,
      pagesCato: Math.ceil(numOfCategories / resPerPage),
      numOfResults: numOfCategories
    });
  } catch (e) {
    throw e;
  }
};

exports.customersEdit = function (req, res) {
  let user = new Customer(req.body, req.params.id);
  user
    .customerEdit()
    .then(() => {
      res.redirect("/admin/customers");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.customersDelete = function (req, res) {
  let userDel = new Customer(req.body, req.params.id);
  userDel
    .customerDelete()
    .then(() => {
      res.redirect("/admin/customers");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.services = async function (req, res) {
  try {
    let services = await serviceCollection.find().toArray();
    res.render("backend/services", {
      settings: await settingsCollection.findOne(),
      services: services
    });
  } catch (e) {
    console.log(e);
  }
};

exports.postServices = function (req, res) {
  let servicePost = new Service(req.body, req.params.url, req.file);
  servicePost
    .post()
    .then(() => {
      res.redirect("/admin/services");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.serviceEdit = function (req, res) {
  const serviceEdit = new Service(req.body, req.params.url);
  serviceEdit
    .edit()
    .then(() => {
      res.redirect("/admin/services");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.serviceDelete = function (req, res) {
  const serviceDelete = new Service(req.body, req.params.url);
  serviceDelete
    .delete()
    .then(() => {
      res.redirect("/admin/services");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.settings = async function (req, res) {
  res.render("backend/settings", {
    settings: await settingsCollection.findOne()
  });
};

exports.settingsUpdate = function (req, res) {
  let settingsEdit = new Setting(req.body, req.file);
  settingsEdit
    .edit()
    .then(() => {
      res.redirect("/admin/settings");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.pages = async function (req, res) {
  // check if url is emty
  if (req.originalUrl == "/admin/pages") {
    res.redirect("/admin/pages?page=1");
  } // end url check

  let pages = await pagesCollection.find().toArray();
  // pagination
  let resPerPage = 5;
  let page = req.query.page;
  const searchQuery = req.query.search;
  const foundCats = await pagesCollection
    .find()
    .skip(resPerPage * page - resPerPage)
    .limit(resPerPage)
    .toArray();
  // count how many categories founded
  const numOfPages = await pagesCollection.countDocuments();

  // end pagination
  try {
    res.render("backend/pages", {
      settings: await settingsCollection.findOne(),
      pages: foundCats,
      currentPage: page,
      pagesCato: Math.ceil(numOfPages / resPerPage),
      numOfResults: numOfPages
    });
  } catch (e) {
    res.send(e);
  }
};

exports.addPage = function (req, res) {
  let page = new Page(req.body, req.params.id, req.file);
  page
    .addPage()
    .then(() => {
      res.redirect("/admin/pages");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.editPage = function (req, res) {
  let edit = new Page(req.body, req.params.id);
  edit
    .edit()
    .then(() => {
      res.redirect("/admin/pages");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.deletePage = function (req, res) {
  let del = new Page(req.body, req.params.id);
  del
    .delete()
    .then(() => {
      res.redirect("/admin/pages");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.ourteam = async function (req, res) {
  try {
    res.render("backend/ourteam", {
      settings: await settingsCollection.findOne(),
      members: await memberCollection.find().toArray()
    });
  } catch (e) {
    res.send(e);
  }
};

exports.memberAvatar = function (req, res) {
  let members = new Member(req.body, req.params.id, req.file);
  members
    .add()
    .then(() => {
      res.redirect("/admin/ourteam");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.memberEdit = function (req, res) {
  let membersEdit = new Member(req.body, req.params.id, req.file);
  membersEdit
    .edit()
    .then(() => {
      res.redirect("/admin/ourteam");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.memberdelete = function (req, res) {
  let memberdelete = new Member(req.body, req.params.id, req.file);

  memberdelete
    .delete()
    .then(() => {
      res.redirect("/admin/ourteam");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.downloads = async function (req, res) {
  try {
    // check if url is emty
    if (req.originalUrl == "/admin/downloads") {
      res.redirect("/admin/downloads?page=1");
    } // end url check

    // pagination
    let resPerPage = 5;
    let page = req.query.page;
    const searchQuery = req.query.search;
    const foundCats = await customerCollection
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productsFounded"
          }
        }
      ])
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage)
      .toArray();
    // count how many categories founded
    const numOfPages = await customerCollection.countDocuments();

    // end pagination

    res.render("backend/downloads", {
      settings: await settingsCollection.findOne(),
      users: foundCats,
      currentPage: page,
      pagesCato: Math.ceil(numOfPages / resPerPage),
      numOfResults: numOfPages
    });
  } catch (e) {
    res.redirect("/404");
  }
};

exports.testimonial = async function (req, res) {
  try {
    res.render("backend/testimonial", {
      settings: await settingsCollection.findOne(),
      testimonials: await testimonialCollection.find().toArray()
    });
  } catch (e) {
    res.redirect("/404");
  }
};

exports.testimonialAdd = function (req, res) {
  let testimonial = new Testimonial(req.body, req.params.testimonialid, req.file);
  testimonial
    .add()
    .then(() => {
      res.redirect("/admin/testimonial");
    })
    .then(() => {
      res.redirect("/404");
    });
};

exports.testimonialEdit = function (req, res) {
  let testimonialEdit = new Testimonial(req.body, req.params.id, req.file);
  testimonialEdit
    .edit()
    .then(() => {
      res.redirect("/admin/testimonial");
    })
    .then(() => {
      res.redirect("/404");
    });
};

exports.testimonialDel = function (req, res) {
  let testimonialDel = new Testimonial(req.body, req.params.id, req.file);
  testimonialDel
    .delete()
    .then(() => {
      res.redirect("/admin/testimonial");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.WhatWeDo = async function (req, res) {
  try {
    res.render("backend/WhatWeDo", {
      settings: await settingsCollection.findOne(),
      whatWeDo: await WhatWeDoCollection.findOne()
    });
  } catch (e) {
    res.redirect("/404");
  }
};

exports.WhatWeDoEdit = function (req, res) {
  let whatWeDoEdit = new WhatWeDo(req.body, req.files);
  whatWeDoEdit
    .update()
    .then(() => {
      res.redirect("/admin/whatWeDo");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.free_item = async function (req, res) {
  try {
    res.render("backend/free_item", {
      settings: await settingsCollection.findOne(),
      free: await freeItemCollection.findOne()
    });
  } catch (e) {
    res.send(e);
  }
};

exports.freeItemPost = function (req, res) {
  let post = new FreeItem(req.body, req.files);
  post
    .post()
    .then(() => {
      res.redirect("/admin/free_item");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.socialNetwork = async function (req, res) {
  try {
    res.render("backend/socialnetwork", {
      settings: await settingsCollection.findOne()
    });
  } catch (e) {
    res.redirect("/404");
  }
};

exports.socialNetworkPost = function (req, res) {
  let social = new Social(req.body);
  social
    .edit()
    .then(() => {
      res.redirect("/admin/socialNetwork");
    })
    .catch(() => {
      res.redirect("/404");
    });
};

exports.profile = async function (req, res) {
  try {
    res.render("backend/profile", {
      settings: await settingsCollection.findOne()
    });
  } catch (e) {
    res.redirect("/404");
  }
};
