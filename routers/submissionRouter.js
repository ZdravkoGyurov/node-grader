const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { Submission, SubmissionStatus } = require("../models/submission")
const { isValidId } = require("../storage/db")
const { createSubmission, readSubmissionByUserIdAndAssignmentId, readSubmissionById, deleteSubmission, updateSubmission } = require("../storage/submissionStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")

const submissionRouter = Router()

submissionRouter.get('/', authn, authz(['READ_SUBMISSIONS']), async (req, res) => {
    const body = req.body

    if (!isValidId(body.assignmentId)) {
        return sendErrorResponse(req, res, 400, `assignmentId is invalid`)
    }

    try {
        const submissions = await readSubmissionByUserIdAndAssignmentId(submissionsCollection(req), req.userId, body.assignmentId)
        res.status(200).json(submissions)
    } catch (err) {
        const message = `read from db failed`
        if (err.message && err.message.includes('does not exist')) {
            return sendErrorResponse(req, res, 404, message, err)
        }
        sendErrorResponse(req, res, 500, message, err)
    }
})

submissionRouter.post('/', authn, authz(['CREATE_SUBMISSION']), async (req, res) => {
    const body = req.body
    
    try {
        let submission = new Submission(req.userId, body.assignmentId)
        submission.validate()

        try {
            submission = await createSubmission(submissionsCollection(req), submission)
            res.status(202).location(`/api/submissions/${submission.id}`).json(submission)

            // execute docker tests
            setTimeout(() => {
                submission.results = 'tests results'
                submission.status = SubmissionStatus.DONE
                updateSubmission(submissionsCollection(req), submission.id, submission)
                    .then(submission => {
                        console.log(submission)
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }, 5000)
        } catch(err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `submission already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting submission in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid submission data`, err)
    }
})

submissionRouter.get('/:submissionId', authn, authz(['READ_SUBMISSION']), async (req, res) => {
    const submissionId = req.params.submissionId

    if(!isValidId(submissionId)) {
        return sendErrorResponse(req, res, 400, `invalid submission data`, new Error('invalid submission id'))
    }

    try {
        const submission = await readSubmissionById(submissionsCollection(req), submissionId)
        res.json(submission)
    } catch(err) {
        const message = `read from db failed`
        if (err.message && err.message.includes('does not exist')) {
            return sendErrorResponse(req, res, 404, message, err)
        }
        sendErrorResponse(req, res, 500, message, err)
    }
})

submissionRouter.delete('/:submissionId', authn, authz(['DELETE_SUBMISSION']), async (req, res) => {
    const submissionId = req.params.submissionId

    if(!isValidId(submissionId)) {
        return sendErrorResponse(req, res, 400, `invalid submission data`, new Error('invalid submission id'))
    }
    
    try {
        await deleteSubmission(submissionsCollection(req), submissionId)
        res.status(204).end()
    } catch(err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function submissionsCollection(req) {
    return req.app.locals.db.collection('submissions')
}

module.exports = submissionRouter