const ObjectID = require('mongodb').ObjectID

class Assignment {
    constructor(id, name, description, dueDate, courseId) {
        if (id) {
            this._id = ObjectID.createFromHexString(id)
        }
        this.name = name || ''
        this.description = description || ''
        this.dueDate = dueDate
        this.courseId = (courseId && ObjectID.createFromHexString(courseId)) || ''
    }

    validate() {
        if (this.name && this.name.length < 1) {
            throw Error('name cannot be empty')
        }
        if (this.description && this.description.length < 1) {
            throw Error('description cannot be empty')
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
        if (this.dueDate == null || this.dueDate == undefined) {
            delete this.dueDate
        }
        if (this.courseId == null || this.courseId == undefined || this.courseId == '') {
            delete this.courseId
        }
        return this
    }
}

module.exports.Assignment = Assignment