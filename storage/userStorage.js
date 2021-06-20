const { create, readAll, read, update, deleteEntity } = require("./crud")
const entityName = 'user'

async function createUser(collection, user) {
    return create(collection, user, entityName)
}

async function readUsers(collection) {
    return readAll(collection)
}

async function readUser(collection, id) {
    return read(collection, id, entityName)
}

async function updateUser(collection, id, user) {
    return update(collection, id, user, entityName)
}

async function deleteUser(collection, id) {
    return deleteEntity(collection, id, entityName)
}

module.exports.createUser = createUser
module.exports.readUsers = readUsers
module.exports.readUser = readUser
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser