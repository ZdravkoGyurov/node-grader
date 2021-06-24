const { RequestStatus } = require("./requestStatus")

class CoursesRequest {
    constructor(courseId, status = RequestStatus.PENDING, userId) {
        this.courseId = courseId
        this.status = status
        this.userId = userId
    }

    validate() {
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
        if (this._id == null || this._id == undefined) {
            delete this._id
        }
        if (this.id == null || this.id == undefined) {
            delete this.id
        }
        if (this.courseId == null || this.courseId == undefined) {
            delete this.courseId
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

module.exports.CoursesRequest = CoursesRequest