const utilities = require('../utilities/index')
const accountModel = require('../models/account-models')
const bcrypt = require("bcryptjs")

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

        // res.status(201).render('account/login', {
        //     title: "Login",
        //     nav,
        //     errors: { errors: [] } // pass empty errors object
        // });
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

module.exports = { buildLogin, buildRegister, registerAccount }