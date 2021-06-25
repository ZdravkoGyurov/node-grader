const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { Submission, SubmissionStatus } = require("../models/submission")
const { isValidId, isExistingId } = require("../storage/db")
const { createSubmission, readSubmissions, readSubmissionById, deleteSubmission, updateSubmission, readAllSubmissions } = require("../storage/submissionStorage")
const { readAssignmentById } = require("../storage/assignmentStorage")
const { readCourseById } = require("../storage/courseStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")
const { runTests } = require("../exec/exec")
const { ObjectID } = require("bson")

const submissionRouter = Router()

submissionRouter.get('/all', authn, authz(['READ_ALL_SUBMISSIONS']), async (req, res) => {
    try {
        const submissions = await readAllSubmissions(submissionsCollection(req))
        res.status(200).json(submissions)
    } catch (err) {
        sendErrorResponse(req, res, 500, message, err)
    }
})

submissionRouter.get('/', authn, authz(['READ_SUBMISSIONS']), async (req, res) => {
    const body = req.body

    if (!isValidId(body.assignmentId)) {
        return sendErrorResponse(req, res, 400, `assignmentId is invalid`)
    }

    try {
        const submissions = await readSubmissions(submissionsCollection(req), req.userId, body.assignmentId)
        res.status(200).json(submissions)
    } catch (err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

submissionRouter.post('/', authn, authz(['CREATE_SUBMISSION']), async (req, res) => {
    const body = req.body

    try {
        await validateAssignmentId(body.assignmentId, assignmentsCollection(req))
    } catch (err) {
        return sendErrorResponse(req, res, 400, `invalid submission data`, err)
    }
    try {
        await validateUserId(req.userId, usersCollection(req))
    } catch (err) {
        return sendErrorResponse(req, res, 400, `invalid submission data`, err)
    }

    try {
        let submission = new Submission(new ObjectID(req.userId), new ObjectID(body.assignmentId))

        try {
            submission = await createSubmission(submissionsCollection(req), submission)
            res.status(202).location(`/api/submissions/${submission.id}`).json(submission)

            try {
                submission = await testSubmission(req, submission)
            } catch (err) {
                console.error(err)
            }
        } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

async function testSubmission(req, submission) {
    const assignment = await readAssignmentById(assignmentsCollection(req), submission.assignmentId)
    const course = await readCourseById(coursesCollection(req), assignment.courseId)

    const submissionResults = await runTests(randomString(), randomString(), assignment.name, req.githubUsername, course.githubRepoName, "ZdravkoGyurov", "grader-docker-tests", "./exec/.")
    submission.results = submissionResults
    submission.status = SubmissionStatus.DONE

    const updatedSubmission = await updateSubmission(submissionsCollection(req), submission.id, submission)
    return updatedSubmission
}

function coursesCollection(req) {
    return req.app.locals.db.collection('courses')
}

function assignmentsCollection(req) {
    return req.app.locals.db.collection('assignments')
}

function submissionsCollection(req) {
    return req.app.locals.db.collection('submissions')
}

function usersCollection(req) {
    return req.app.locals.db.collection('users')
}

async function validateAssignmentId(assignmentId, assignmentsCollection) {
    await isExistingId(assignmentId, assignmentsCollection, 'assignment')
}

async function validateUserId(userId, usersCollection) {
    await isExistingId(userId, usersCollection, 'user')
}

function randomString() {
    return new ObjectID().toHexString()
}

module.exports = submissionRouter