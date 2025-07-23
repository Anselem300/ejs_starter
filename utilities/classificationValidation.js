const utilities = require('.')
const {body, validationResult} = require("express-validator")

const classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength ({min: 1})
        .withMessage("Classification name required")
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("No spaces or special characters allowed.")
    ];
};

const checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    const errors = validationResult(req);
    const nav = await utilities.getNav();

    if(!errors.isEmpty()){
        return res.render("inventory/addClassification", {
            title: "Add Classification",
            nav,
            errors,
            notice: null,
            classification_name
        });
    }
    next();
}

module.exports = { classificationRules, checkClassificationData };