module.exports.sendErrorResponse = function(req, res, status, message, err) {
    if (!err) {
        err = new Error(message)
    }

    console.error(err.message)

    if(status === 500) {
        err.message = ''
    }
    
    res.status(status).json({
        code: status,
        message,
        error: err.message
    })
}