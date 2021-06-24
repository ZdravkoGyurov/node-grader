class Assignment {
    constructor(name, description, dueDate, courseId) {
        this.name = name
        this.description = description
        this.dueDate = dueDate
        this.courseId = courseId
    }

    validate() {
        if (!this.name || !this.name.trim()) {
            throw Error('name cannot be empty')
        }
        if (!this.description || !this.description.trim()) {
            throw Error('description cannot be empty')
        }
        if (isNaN(Date.parse(this.dueDate))) {
            throw Error('dueDate is invalid')
        }
    }

    validatePatch() {
        if (this.name && !this.name.trim()) {
            throw Error('name should not be empty')
        }
        if (this.description && !this.description.trim()) {
            throw Error('description should not be empty')
        }
        if (this.dueDate != null && isNaN(Date.parse(this.dueDate))) {
            throw Error('dueDate is invalid')
        }
    }

    removeEmptyFields() {
        if (this._id == null || this._id == undefined) {
            delete this._id
        }
        if (this.id == null || this.id == undefined) {
            delete this.id
        }
        if (this.name == null || this.name == undefined) {
            delete this.name
        }
        if (this.description == null || this.description == undefined) {
            delete this.description
        }
        if (this.dueDate == null || this.dueDate == undefined) {
            delete this.dueDate
        }
        if (this.courseId == null || this.courseId == undefined) {
            delete this.courseId
        }
        return this
    }
}

module.exports.Assignment = Assignment