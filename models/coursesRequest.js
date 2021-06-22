const ObjectID = require('mongodb').ObjectID
const { RequestStatus } = require("./requestStatus")

class CoursesRequest {
    constructor(courseIds, status = RequestStatus.PENDING, userId) {
        this.courseIds = courseIds
        this.status = status
        this.userId = ObjectID.createFromHexString(userId)
    }

    validate() {
        if (!this.courseIds || this.courseIds.length == 0) {
            throw Error(`courseIds cannot be empty`)
        }
        this.courseIds.forEach(c => {
            if (!ObjectID.isValid(c)) {
                throw Error(`course id ${c} is invalid object id`)
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