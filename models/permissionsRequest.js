const ObjectID = require('mongodb').ObjectID
const { RequestStatus } = require("./requestStatus")

class PermissionsRequest {
    constructor(permissions, status = RequestStatus.PENDING, userId) {
        this.permissions = permissions
        this.status = status
        this.userId = ObjectID.createFromHexString(userId)
    }

    validate() {
        if (!this.permissions || this.permissions.length == 0) {
            throw Error(`permissions cannot be empty`)
        }
        this.permissions.forEach(p => {
            if (p.length === 0) {
                throw Error(`permissions cannot be empty`)
            }
        })
        if (this.status != RequestStatus.APPROVED && this.status != RequestStatus.PENDING && this.status != RequestStatus.DECLINED) {
                throw Error(`status ${this.status} is invalid, must be one of [APPROVED, PENDING, DECLINED]`)
        }
    }

    validatePatch() {
        if (this.status != RequestStatus.APPROVED && this.status != RequestStatus.PENDING && this.status != RequestStatus.DECLINED) {
                throw Error(`status ${this.status} is invalid, must be one of [APPROVED, PENDING, DECLINED]`)
        }
    }

    removeEmptyFields() {
        if (this._id == null || this._id == undefined || this._id == '') {
            delete this._id
        }
        if (this.id == null || this.id == undefined || this.id == '') {
            delete this.id
        }
        if (this.permissions == null || this.permissions == undefined || this.permissions.length == 0) {
            delete this.permissions
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

module.exports.PermissionsRequest = PermissionsRequest