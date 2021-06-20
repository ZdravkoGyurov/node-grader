const ObjectID = require('mongodb').ObjectID

class Course {
    constructor(id, name, description, githubRepoName) {
        if (id) {
            this._id = ObjectID.createFromHexString(id)
        }
        this.name = name || ''
        this.description = description || ''
        this.githubRepoName = githubRepoName || ''
    }

    validate() {
        if (this.name && this.name.length < 1) {
            throw Error('name should not be empty')
        }
        if (this.description && this.description.length < 1) {
            throw Error('description should not be empty')
        }
        if (this.githubRepoName && this.githubRepoName.length < 1) {
            throw Error('githubRepoName should not be empty')
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
        if (this.githubRepoName == null || this.githubRepoName == undefined || this.githubRepoName == '') {
            delete this.githubRepoName
        }
        return this
    }
}

module.exports.Course = Course