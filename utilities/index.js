const invModel = require("../models/inventory-models");
const Util = {};
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = "<ul>";
  list += '<li><a href="/" title="Home Page">Home</a></li>';

  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });

  list += "</ul>";
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' // /inv/detail/this will still work
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsGrid = function(v){
  let details = `
  <section class="detail-card">
    <img src="${v.inv_image}" alt="Image of ${v.inv_make} ${v.inv_model}" loading="lazy">
    <div class="info">
      <h3>${v.inv_make} ${v.inv_model} Details</h3>
      <ul class="paragraph"> 
        <li><strong>Price: $${Number(v.inv_price).toLocaleString("en-US")}</strong></li>
        <li><strong>Description: </strong>${v.inv_description}</li>
        <li><strong>Color: </strong>${v.inv_color}</li>
        <li><strong>Miles: </strong>${Number(v.inv_miles).toLocaleString("en-US")}</li>
      </ul>
    </div>
  </section>`
  return details
}

Util.buildClassificationList = async function (selected_id = null) {
  try {
    let data = await invModel.getClassifications();
    console.log("Classifications fetched:", data.rows);

    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";

    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (selected_id && row.classification_id === selected_id) {
        classificationList += " selected";
      }
      classificationList += `>${row.classification_name}</option>`;
    });

    classificationList += "</select>";
    return classificationList;
  } catch (err) {
    console.error("Error building classification list:", err.message);
    return "<select><option value=''>Error loading classifications</option></select>";
  }
};


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if(req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if(err){
          req.flash("Please log in")
          res.clearCookie("jwt")
          return redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedIn = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
* Middleware to check account type
**************************************** */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  // Make sure JWT is already verified by checkJWTToken
  if(res.locals.accountData) {
    const { account_type } = res.locals.accountData;
    if (account_type === "Employee" || account_type === "Admin") {
      return next(); // ✅ authorized
    } else {
    req.flash("notice", "Sorry, but your access to this view is restricted.");
    res.redirect("/");
  }
  } else {
    req.flash("notice", "Please log in to continue.")
    res.redirect("account/login");
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;
