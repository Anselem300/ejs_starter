// Account Login Route
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/index')
const accountController = require('../controllers/accountControllers')
const regValidate = require('../utilities/account-validation')
const invCont = require('../controllers/invControllers')

// Default Route
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.accountManagement))

// Deliver Login View
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Deliver Register View
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post('/register', 
        regValidate.registrationRules(),
        regValidate.checkRegData,
        utilities.handleErrors(accountController.registerAccount))

// Update account info form
router.get("/updateAccount/:account_id", utilities.checkLogin, // ensure the user is logged in
  utilities.handleErrors(accountController.buildUpdateAccount) )

// Process update submission
router.post("/updateAccount/:account_id",
  utilities.checkLogin, // ensure the user is logged in
  regValidate.updateAccountRules(), // add validation rules for update
  regValidate.checkUpdateData, // handle validation errors
  utilities.handleErrors(accountController.updateAccount)
)

// Change password
router.post("/changePassword/:account_id", utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.newPassword)
)

// Process the login attempt
router.post('/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Log out route
router.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // delete the JWT cookie
  req.flash("notice", "You have been logged out successfully!"); // Flash message for logout
  res.redirect("/"); // go back to home page
})

module.exports = router;