const { ObjectID } = require("bson")
const { create, readAll, read, update, deleteBy } = require("./crud")
const entityName = 'course'

async function createCourse(collection, course) {
    return create(collection, course, entityName)
}

async function readCourses(collection) {
    return readAll(collection)
}

async function readCourseById(collection, id) {
    return read(collection, filterById(id), entityName)
}

async function updateCourse(collection, id, course) {
    return update(collection, filterById(id), course, entityName)
}

async function deleteCourse(collection, id) {
    return deleteBy(collection, filterById(id), entityName)
}


function filterById(id) {
    return { _id: new ObjectID(id) }
}

module.exports.createCourse = createCourse
module.exports.readCourses = readCourses
module.exports.readCourseById = readCourseById
module.exports.updateCourse = updateCourse
module.exports.deleteCourse = deleteCourse