// Account Login Route
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/index')
const accountController = require('../controllers/accountControllers')
const regValidate = require('../utilities/account-validation')

// Default Route
router.get('/', utilities.handleErrors(accountController.accountManagement))

// Deliver Login View
router.get('/login', utilities.handleErrors(accountController.buildLogin))

// Deliver Register View
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post('/register', 
        regValidate.registrationRules(),
        regValidate.checkRegData,
        utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
// router.post('/login', 
//     (req, res) => {
//         res.status(200).send('login process')
//     }
// )

// Process the login attempt
router.post('/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;