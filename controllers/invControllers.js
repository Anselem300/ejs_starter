const invModel = require("../models/inventory-models")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next){
    try{
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)

        if (!data || data.length === 0){
            const err = new Error("Sorry! But we couldn't find the vehicle you requested for 😔.");
            err.status = 404;
            return next(err); // 🔴 Pass to error handler
        }

        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
    } catch (err) {
         next(err); // 🔴 Catch unexpected error
    }
}

/* ***************************
 *  Build inventory details
 * ************************** */
invCont.buildByInvId = async function(req, res, next){
    try {
        const invId = req.params.invId
        const data = await invModel.getInventoryByInvId(invId)

        if (!data || data.length === 0){
            const err = new Error("Sorry! But we couldn't find the vehicle you requested for 😔.");
            err.status = 404;
            return next(err); // 🔴 Pass to error handler
        }

        const nav = await utilities.getNav()
        const vehicle = data[0]
        const details = await utilities.buildDetailsGrid(vehicle)
        res.render("inventory/details", {
        title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        details,
    });
    } catch (err) {
        next(err); // 🔴 Catch unexpected error
    }
}

module.exports = invCont