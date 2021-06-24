const { ALL_PERMISSIONS } = require("./permissions")

class User {
    constructor(username, githubUsername, fullname, password, permissions, courseIds) {
        this.username = username
        this.githubUsername = githubUsername
        this.fullname = fullname
        this.password = password
        this.permissions = permissions
        this.courseIds = courseIds
    }

    validate() {
        if (!this.username || !this.username.trim()) {
            throw Error('username should not be empty')
        }
        if (!this.githubUsername || !this.githubUsername.trim()) {
            throw Error('githubUsername should not be empty')
        }
        if (!this.fullname || !this.fullname.trim()) {
            throw Error('fullname should not be empty')
        }
        if (!this.password || !this.password.trim()) {
            throw Error('password should not be empty')
        }
    }

    validatePatch() {
        if (this.username && !this.username.trim()) {
            throw Error('username should not be empty')
        }
        if (this.githubUsername && !this.githubUsername.trim()) {
            throw Error('githubUsername should not be empty')
        }
        if (this.fullname && !this.fullname.trim()) {
            throw Error('fullname should not be empty')
        }
        if (this.password) {
            throw Error('password cannot be changed')
        }
        if (this.permissions && this.permissions.length !== 0) {
            this.permissions.forEach(p => {
                if (!ALL_PERMISSIONS.includes(p)) {
                    throw Error(`permissions '${p}' is invalid`)
                }
            })
        }
    }

    removeEmptyFields() {
        if (this._id == null || this._id == undefined) {
            delete this._id
        }
        if (this.id == null || this.id == undefined) {
            delete this.id
        }
        if (this.username == null || this.username == undefined) {
            delete this.username
        }
        if (this.githubUsername == null || this.githubUsername == undefined) {
            delete this.githubUsername
        }
        if (this.fullname == null || this.fullname == undefined) {
            delete this.fullname
        }
        if (this.password == null || this.password == undefined) {
            delete this.password
        }
        if (this.permissions == null || this.permissions == undefined) {
            delete this.permissions
        }
        if (this.courseIds == null || this.courseIds == undefined) {
            delete this.courseIds
        }
        return this
    }
}

module.exports.User = User