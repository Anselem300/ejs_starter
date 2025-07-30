const utilities = require('../utilities/index')
const accountModel = require('../models/account-models')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next){
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        notice: req.flash("notice")
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)

        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        );

        req.flash("notice", `Congratulations, you\'re registered ${account_firstname}! Please log in.`);
        res.status(201).redirect("/account/login");

    } catch (error) {
        console.error("Registration error:", error.message);
        req.flash("notice", "Sorry, the registration failed.");

        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: { errors: [{ msg: error.message }] }, // pass real error to the view
            account_firstname,
            account_lastname,
            account_email
        });
    }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice: req.flash("notice"),
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        notice: req.flash("notice"),
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function accountManagement(req, res) {
  // accountData was set in JWT middleware
  const accountData = res.locals.accountData
    let nav = await utilities.getNav()
    res.render('account/manageAccount', {
        title: "Manage Your Account",
        nav,
        accountData,
        notice: req.flash("notice")
    })
}

async function buildUpdateAccount(req, res) {
  const nav = await utilities.getNav();
  const account_id = req.params.account_id

  // Get the account info from the DB
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/updateAccount", {
    title: "Update Your Account Information",
    nav,
    accountData,
    errors: null,
    notice: req.flash("notice")
  })
}

async function updateAccount(req, res) {
  try{
    const account_id = req.params.account_id;
    const { account_firstname, account_lastname, account_email } = req.body;

    const updateResult = await accountModel.updateAccount(account_id, {
      account_firstname,
      account_lastname, 
      account_email
    });
    if (updateResult) {
      req.flash("notice", "Your account information has been updated.");
      res.redirect("/account/");
    } else {
      req.flash("notice", "Sorry, update failed. Please try again.")
      res.redirect(`/account/updateAccount/${account_id}`);
    }
  } catch (error) {
    req.flash("notice", "An error occurred. Please try again.")
    res.redirect(`/account/updateAccount/${req.params.account_id}`);
  }
}

// Change Password Controller
async function newPassword(req, res) {
  try {
    const { account_id } = req.params;
    const { account_password } = req.body

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(account_password, 10)
    const updateResult =  await accountModel.updatePassword(account_id, hashedNewPassword)

    if (updateResult) {
      req.flash("notice", "Password successfully updated!")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Password update failed. Please try again.")
      return res.redirect(`/account/updateAccount/${account_id}`)
    }
  } catch (error) {
    console.error("Password update error: ", error)
    req.flash("notice", "An error occurred. Please try again.")
    res.redirect(`/account/updateAccount/${req.params.account_id}`)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, accountManagement, buildUpdateAccount, updateAccount, newPassword }