// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invControllers")
const utilities = require("../utilities/index")
const errorTestController = require("../controllers/errorTestController")
const { classificationRules, checkClassificationData} = require("../utilities/classificationValidation")
const { inventoryRules, checkInventoryData, checkUpdateData } = require("../utilities/inventoryValidation")

// Route for inventory management
router.get("/", utilities.checkEmployeeOrAdmin, invController.buildInvManagement)


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory by details view
router.get('/detail/:inv_id', invController.buildByInvId)

// Route for addClassification // Protected routes (require Employee/Admin)
router.get("/addClassification", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification))

router.post("/addClassification", classificationRules(),
  checkClassificationData, utilities.checkEmployeeOrAdmin,
  invController.addClassification
)

// Route for getInventory
router.get("/getInventory/:classification_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.getInventoryJSON))

// Route to editInventory
router.get("/edit/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.editInventory))

// Route to deleteInventory
router.get("/delete/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteView))

// Route for AddInventory
router.get("/addInventory", utilities.checkEmployeeOrAdmin, invController.buildAddInventory)

// Router for update
router.post("/update/", inventoryRules(),
  checkUpdateData,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.updateInventory))

// Router for delete 
router.post("/delete/", utilities.checkEmployeeOrAdmin,
   utilities.handleErrors(invController.deleteInventory)
)

router.post("/addInventory", inventoryRules(),
    checkInventoryData,
    utilities.checkEmployeeOrAdmin,
    invController.addInventory
)

// Error triger route
router.get('/triger-error', errorTestController.triggerError)

module.exports = router;