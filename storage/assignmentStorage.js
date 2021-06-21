const { ObjectID } = require("bson")
const { create, readAll, read, update, deleteBy } = require("./crud")
const entityName = 'assignment'

async function createAssignment(collection, assignment) {
    return create(collection, assignment, entityName)
}

async function readAssignments(collection) {
    return readAll(collection, {})
}

async function readAssignmentById(collection, id) {
    return read(collection, filterById(id), entityName)
}

async function updateAssignment(collection, id, assignment) {
    return update(collection, filterById(id), assignment, entityName)
}

async function deleteAssignment(collection, id) {
    return deleteBy(collection, filterById(id), entityName)
}


function filterById(id) {
    return { _id: new ObjectID(id) }
}

module.exports.createAssignment = createAssignment
module.exports.readAssignments = readAssignments
module.exports.readAssignmentById = readAssignmentById
module.exports.updateAssignment = updateAssignment
module.exports.deleteAssignment = deleteAssignment