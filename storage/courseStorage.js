const { ObjectID } = require("bson")
const { create, readAll, read, update, deleteBy } = require("./crud")
const entityName = 'course'

async function createCourse(collection, course) {
    return create(collection, course, entityName)
}

async function readAllCourses(collection) {
    return readAll(collection, {})
}

async function readCourses(collection, excludeCourses) {
    return readAll(collection, filterOutUserCourses(excludeCourses))
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

function filterOutUserCourses(userCourses) {
    userCourses = userCourses.map(c => new ObjectID(c))
    return { _id: { $in: userCourses } }
}

function filterById(id) {
    return { _id: new ObjectID(id) }
}

module.exports.createCourse = createCourse
module.exports.readAllCourses = readAllCourses
module.exports.readCourses = readCourses
module.exports.readCourseById = readCourseById
module.exports.updateCourse = updateCourse
module.exports.deleteCourse = deleteCourse