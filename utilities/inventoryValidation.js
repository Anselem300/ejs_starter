const { body, validationResult } = require("express-validator");
const utilities = require("./");

const inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Classification is required."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ gt: 0 }).withMessage("Valid price required."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Valid year required."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Valid mileage required."),
    body("inv_color").trim().notEmpty().withMessage("Color is required.")
  ];
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);

  if (!errors.isEmpty()) {
    return res.render("inventory/addInventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors,
      notice: null,
      ...req.body // for stickiness
    });
  }

  next();
};

// Check update data: if errors exist, redirect back to the edit view
const checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);

  // Pull all fields from req.body, including inv_id
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body

  if (!errors.isEmpty()) {
    const itemName = `${inv_make} ${inv_model}`;
    return res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors,
      notice: null,
      inv_id: inv_id,
      classification_id: classification_id,
      inv_make: inv_make,
      inv_model: inv_model,
      inv_description: inv_description,
      inv_image: inv_image,
      inv_thumbnail: inv_thumbnail,
      inv_price: inv_price,
      inv_year: inv_year,
      inv_miles: inv_miles,
      inv_color: inv_color
    });
  }

  next();
};


module.exports = { inventoryRules, checkInventoryData, checkUpdateData };