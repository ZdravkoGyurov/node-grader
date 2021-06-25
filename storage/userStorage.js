const { ObjectID } = require("bson")
const { create, readAll, read, update, deleteBy } = require("./crud")
const entityName = 'user'

async function createUser(collection, user) {
    return create(collection, user, entityName)
}

async function readUsers(collection) {
    return readAll(collection, {})
}

async function readUserById(collection, id) {
    return read(collection, filterById(id), entityName)
}

async function readUserByUsername(collection, username) {
    return read(collection, filterByUsername(username), entityName)
}

async function updateUser(collection, id, user) {
    return update(collection, filterById(id), user, entityName)
}

async function addUserPermissions(collection, id, permissions) {
    const updateResult = await collection.updateOne(
        filterById(id),
        { $addToSet: { permissions: { $each: permissions } } }
    )
    
    if (!updateResult.result.ok) {
        throw Error(`failed to update ${entityName} in the database`)
    }
    if (!updateResult.matchedCount) {
        throw Error(`failed to update ${entityName}, does not exist in the database`)
    }
}

async function addUserCourse(collection, id, courseId) {
    const updateResult = await collection.updateOne(
        filterById(id),
        { $addToSet: { courseIds: courseId } }
    )

    if (!updateResult.result.ok) {
        throw Error(`failed to update ${entityName} in the database`)
    }
    if (!updateResult.matchedCount) {
        throw Error(`failed to update ${entityName}, does not exist in the database`)
    }
}

async function deleteUser(collection, id) {
    return deleteBy(collection, filterById(id), entityName)
}

function filterById(id) {
    return { _id: new ObjectID(id) }
}

function filterByUsername(username) {
    return { username: username }
}

module.exports.createUser = createUser
module.exports.readUsers = readUsers
module.exports.readUserById = readUserById
module.exports.readUserByUsername = readUserByUsername
module.exports.addUserPermissions = addUserPermissions
module.exports.addUserCourse = addUserCourse
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser