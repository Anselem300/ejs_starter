const errorTestController = {}

errorTestController.triggerError = (req, res, next) => {
    // Intentionally throw an error
    const err = new Error("This is an international 500 server error!");
    err.status = 500;
    throw err;
}

module.exports = errorTestController