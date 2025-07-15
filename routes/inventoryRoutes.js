// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invControllers")
const errorTestController = require("../controllers/errorTestController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory by details view
router.get('/detail/:invId', invController.buildByInvId)

// Error triger route
router.get('/triger-error', errorTestController.triggerError)

module.exports = router;