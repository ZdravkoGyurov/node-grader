const { ObjectID } = require("bson")
const { create, readAll, update, deleteBy } = require("./crud")
const entityName = 'permissionsRequest'

async function createPermissionsRequest(collection, permissionsRequest) {
    return create(collection, permissionsRequest, entityName)
}

async function readPermissionsRequests(collection, userId) {
    if (userId) {
        return readAll(collection, filterByUserId(userId))
    }
    return readAll(collection, {})
}

async function updatePermissionsRequest(collection, id, permissionsRequest) {
    return update(collection, filterById(id), permissionsRequest, entityName)
}

async function deletePermissionsRequest(collection, id) {
    return deleteBy(collection, filterById(id), entityName)
}

function filterById(id) {
    return { _id: new ObjectID(id) }
}

function filterByUserId(userId) {
    return { userId: new ObjectID(userId) }
}

module.exports.createPermissionsRequest = createPermissionsRequest
module.exports.readPermissionsRequests = readPermissionsRequests
module.exports.updatePermissionsRequest = updatePermissionsRequest
module.exports.deletePermissionsRequest = deletePermissionsRequest