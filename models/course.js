class Course {
    constructor(name, description, githubRepoName) {
        this.name = name
        this.description = description
        this.githubRepoName = githubRepoName
    }

    validate() {
        if (!this.name || !this.name.trim()) {
            throw Error('name should not be empty')
        }
        if (!this.description || !this.description.trim()) {
            throw Error('description should not be empty')
        }
        if (!this.githubRepoName || !this.githubRepoName.trim()) {
            throw Error('githubRepoName should not be empty')
        }
    }

    validatePatch() {
        if (this.name && !this.name.trim()) {
            throw Error('name should not be empty')
        }
        if (this.description && !this.description.trim()) {
            throw Error('description should not be empty')
        }
        if (this.githubRepoName && !this.githubRepoName.trim()) {
            throw Error('githubRepoName should not be empty')
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
        if (this.githubRepoName == null || this.githubRepoName == undefined) {
            delete this.githubRepoName
        }
        return this
    }
}

module.exports.Course = Course