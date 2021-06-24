SubmissionStatus = {
    DONE: 'DONE',
    PENDING: 'PENDING'
}

class Submission {
    constructor(userId, assignmentId) {
        this.results = ''
        this.status = SubmissionStatus.PENDING
        this.userId = userId
        this.assignmentId = assignmentId
    }
}

module.exports.SubmissionStatus = SubmissionStatus
module.exports.Submission = Submission