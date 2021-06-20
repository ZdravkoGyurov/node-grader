const ObjectID = require('mongodb').ObjectID

class User {
    constructor(id, username, githubUsername, fullname, password, permissions, courseIds) {
        if (id) {
            this._id = ObjectID.createFromHexString(id)
        }
        this.username = username || ''
        this.githubUsername = githubUsername || ''
        this.fullname = fullname || ''
        this.password = password
        this.permissions = permissions || [] 
        this.courseIds = (courseIds && courseIds.map(p => ObjectID.createFromHexString(p))) || []
    }

    validate() {
        if (this.username && this.username.length < 1) {
            throw Error('username should not be empty')
        }
        if (this.githubUsername && this.githubUsername.length < 1) {
            throw Error('githubUsername should not be empty')
        }
        if (this.fullname && this.fullname.length < 1) {
            throw Error('fullname should not be empty')
        }
        if (this.password && this.password.length < 1) {
            throw Error('password should not be empty')
        }
    }

    removeEmptyFields() {
        if (this._id == null || this._id == undefined || this._id == '') {
            delete this._id
        }
        if (this.id == null || this.id == undefined || this.id == '') {
            delete this.id
        }
        if (this.username == null || this.username == undefined || this.username == '') {
            delete this.username
        }
        if (this.githubUsername == null || this.githubUsername == undefined || this.githubUsername == '') {
            delete this.githubUsername
        }
        if (this.fullname == null || this.fullname == undefined || this.fullname == '') {
            delete this.fullname
        }
        if (this.password == null || this.password == undefined || this.password == '') {
            delete this.password
        }
        if (this.permissions == null || this.permissions == undefined || this.permissions.length == 0) {
            delete this.permissions
        }
        if (this.courseIds == null || this.courseIds == undefined || this.courseIds.length == 0) {
            delete this.courseIds
        }
        return this
    }
}

module.exports.User = User