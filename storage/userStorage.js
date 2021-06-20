const { ObjectID } = require("bson")
const { create, readAll, read, update, deleteBy } = require("./crud")
const entityName = 'user'

async function createUser(collection, user) {
    return create(collection, user, entityName)
}

async function readUsers(collection) {
    return readAll(collection)
}

async function readUser(collection, id) {
    return read(collection, filterById(id), entityName)
}

async function updateUser(collection, id, user) {
    return update(collection, filterById(id), user, entityName)
}

async function deleteUser(collection, id) {
    return deleteBy(collection, filterById(id), entityName)
}

function filterById(id) {
    return { _id: new ObjectID(id) }
}

module.exports.createUser = createUser
module.exports.readUsers = readUsers
module.exports.readUser = readUser
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser