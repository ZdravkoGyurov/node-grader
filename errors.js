module.exports.sendErrorResponse = function(req, res, status, message, err) {
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

module.exports.to = function(promise){
    return promise
        .then((data) => [data, null])
        .catch((err) => [null, err]);
}