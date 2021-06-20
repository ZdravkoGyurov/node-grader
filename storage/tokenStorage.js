const { create, read } = require("./crud")
const entityName = 'token'

async function createToken(collection, token) {
    return create(collection, {'token': token}, entityName)
}

async function readToken(collection, token) {
    return read(collection, {'token': token}, entityName)
}

module.exports.createToken = createToken
module.exports.readToken = readToken