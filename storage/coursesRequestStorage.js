const { ObjectID } = require("bson")
const { create, readAll, update, deleteBy } = require("./crud")
const entityName = 'coursesRequest'

async function createCoursesRequest(collection, coursesRequest) {
    return create(collection, coursesRequest, entityName)
}

async function readCoursesRequests(collection, userId) {
    if (userId) {
        return readAll(collection, filterByUserId(userId))
    }
    return readAll(collection, {})
}

async function updateCoursesRequest(collection, id, coursesRequest) {
    const filter = { _id: new ObjectID(id), status: { $eq: 'PENDING' } }
    return update(collection, filter, coursesRequest, entityName)
}

async function deleteCoursesRequest(collection, id) {
    return deleteBy(collection, filterById(id), entityName)
}

function filterById(id) {
    return { _id: new ObjectID(id) }
}

function filterByUserId(userId) {
    return { userId: new ObjectID(userId) }
}

module.exports.createCoursesRequest = createCoursesRequest
module.exports.readCoursesRequests = readCoursesRequests
module.exports.updateCoursesRequest = updateCoursesRequest
module.exports.deleteCoursesRequest = deleteCoursesRequest