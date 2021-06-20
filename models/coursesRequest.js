const ObjectID = require('mongodb').ObjectID

class CoursesRequest {
    constructor(id, name, description, courseIds, status = 'PENDING', userId) {
        if (id) {
            this._id = ObjectID.createFromHexString(id)
        }
        this.name = name || ''
        this.description = description || ''
        this.courseIds = courseIds || []
        this.status = status || ''
        this.userId = (userId && ObjectID.createFromHexString(userId)) || ''
    }

    validate() {
        if (this.name && this.name.length < 1) {
            throw Error('name should not be empty')
        }
        if (this.description && this.description.length < 1) {
            throw Error('description should not be empty')
        }
    }

    removeEmptyFields() {
        if (this._id == null || this._id == undefined || this._id == '') {
            delete this._id
        }
        if (this.id == null || this.id == undefined || this.id == '') {
            delete this.id
        }
        if (this.name == null || this.name == undefined || this.name == '') {
            delete this.name
        }
        if (this.description == null || this.description == undefined || this.description == '') {
            delete this.description
        }
        if (this.courseIds == null || this.courseIds == undefined || this.courseIds.length == 0) {
            delete this.courseIds
        }
        if (this.status == null || this.status == undefined || this.status == '') {
            delete this.status
        }
        if (this.courseId == null || this.courseId == undefined || this.courseId == '') {
            delete this.courseId
        }
        return this
    }
}

module.exports.CoursesRequest = CoursesRequest