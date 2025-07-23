// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invControllers")
const errorTestController = require("../controllers/errorTestController")
const { classificationRules, checkClassificationData} = require("../utilities/classificationValidation")
const { inventoryRules, checkInventoryData } = require("../utilities/inventoryValidation")

// Route for inventory management
router.get("/", invController.buildInvManagement)


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory by details view
router.get('/detail/:invId', invController.buildByInvId)

// Route for addClassification
router.get("/addClassification", invController.buildAddClassification)

router.post("/addClassification", classificationRules(),
  checkClassificationData,
  invController.addClassification
)

// Route for AddInventory
router.get("/addInventory", invController.buildAddInventory)

router.post("/addInventory", inventoryRules(),
    checkInventoryData,
    invController.addInventory
)

// Error triger route
router.get('/triger-error', errorTestController.triggerError)

module.exports = router;