const { ALL_PERMISSIONS } = require("./permissions")
const { RequestStatus } = require("./requestStatus")

class PermissionsRequest {
    constructor(permissions, status = RequestStatus.PENDING, userId) {
        this.permissions = permissions
        this.status = status
        this.userId = userId
    }

    validate() {
        if (!this.permissions || this.permissions.length == 0) {
            throw Error(`permissions cannot be empty`)
        }
        this.permissions.forEach(p => {
            if (!ALL_PERMISSIONS.includes(p)) {
                throw Error(`permissions ${p} doesn't exist`)
            }
        })
        if (this.status != RequestStatus.APPROVED && this.status != RequestStatus.PENDING && this.status != RequestStatus.DECLINED) {
                throw Error(`status ${this.status} is invalid, must be one of [APPROVED, PENDING, DECLINED]`)
        }
    }

    validatePatch() {
        if (this.permissions && this.permissions.length > 0) {
            this.permissions.forEach(p => {
                if (!ALL_PERMISSIONS.includes(p)) {
                    throw Error(`permissions ${p} doesn't exist`)
                }
            })
        }
        if (this.status != RequestStatus.APPROVED && this.status != RequestStatus.PENDING && this.status != RequestStatus.DECLINED) {
                throw Error(`status ${this.status} is invalid, must be one of [APPROVED, PENDING, DECLINED]`)
        }
    }

    removeEmptyFields() {
        if (this._id == null || this._id == undefined) {
            delete this._id
        }
        if (this.id == null || this.id == undefined) {
            delete this.id
        }
        if (this.permissions == null || this.permissions == undefined || this.permissions.length == 0) {
            delete this.permissions
        }
        if (this.status == null || this.status == undefined) {
            delete this.status
        }
        if (this.courseId == null || this.courseId == undefined) {
            delete this.courseId
        }
        return this
    }
}

module.exports.PermissionsRequest = PermissionsRequest