const ObjectID = require('mongodb').ObjectID

SubmissionStatus = {
    DONE: 'DONE',
    PENDING: 'PENDING'
}

class Submission {
    constructor(userId, assignmentId) {
        this.results = ''
        this.status = SubmissionStatus.PENDING
        this.userId = ObjectID.createFromHexString(userId)
        this.assignmentId = ObjectID.createFromHexString(assignmentId)
    }

    validate() {
        
    }

    removeEmptyFields() {
        if (this._id == null || this._id == undefined || this._id == '') {
            delete this._id
        }
        if (this.id == null || this.id == undefined || this.id == '') {
            delete this.id
        }
        if (this.results == null || this.results == undefined || this.results == '') {
            delete this.results
        }
        if (this.status == null || this.status == undefined || this.status == '') {
            delete this.status
        }
        if (this.userId == null || this.userId == undefined || this.userId == '') {
            delete this.userId
        }
        if (this.assignmentId == null || this.assignmentId == undefined || this.assignmentId == '') {
            delete this.assignmentId
        }
        return this
    }
}

module.exports.SubmissionStatus = SubmissionStatus
module.exports.Submission = Submission