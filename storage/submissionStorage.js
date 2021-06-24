const { ObjectID } = require("bson")
const { create, read, readAll, update, deleteBy } = require("./crud")
const entityName = 'submission'

async function createSubmission(collection, submission) {
    return create(collection, submission, entityName)
}

async function readAllSubmissions(collection) {
    return readAll(collection, {})
}

async function readSubmissions(collection, userId, assignmentId) {
    return readAll(collection, filterByUserIdAndAssignmentId(userId, assignmentId))
}

async function readSubmissionById(collection, id) {
    return read(collection, filterById(id), entityName)
}

async function updateSubmission(collection, id, submission) {
    delete submission.id
    return update(collection, filterById(id), submission, entityName)
}

async function deleteSubmission(collection, id) {
    return deleteBy(collection, filterById(id), entityName)
}

function filterById(id) {
    return { _id: new ObjectID(id) }
}

function filterByUserIdAndAssignmentId(userId, assignmentId) {
    return { userId: new ObjectID(userId), assignmentId: new ObjectID(assignmentId) }
}

module.exports.createSubmission = createSubmission
module.exports.readAllSubmissions = readAllSubmissions
module.exports.readSubmissions = readSubmissions
module.exports.readSubmissionById = readSubmissionById
module.exports.updateSubmission = updateSubmission
module.exports.deleteSubmission = deleteSubmission