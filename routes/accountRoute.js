// Account Login Route
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/index')
const accountController = require('../controllers/accountControllers')
const regValidate = require('../utilities/account-validation')

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
  (req, res) => {
    // Temporary response — this would be your login processing function
    res.status(200).send('login process')
  }
)


module.exports = router;