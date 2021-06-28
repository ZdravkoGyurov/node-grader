const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { Assignment } = require("../models/assignment")
const { isValidId, isExistingId } = require("../storage/db")
const { createAssignment, readAssignments, readAssignmentById, deleteAssignment, updateAssignment } = require("../storage/assignmentStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")
const { ObjectID } = require("bson")

const assignmentRouter = Router()

assignmentRouter.get('/', authn, authz(['READ_ASSIGNMENTS']), async (req, res) => {
    try {
        const assignments = await readAssignments(assignmentsCollection(req))
        res.status(200).json(assignments)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

assignmentRouter.post('/', authn, authz(['CREATE_ASSIGNMENT']), async (req, res) => {
    const assignmentBody = req.body
    
    try {
        await validateCourseId(assignmentBody.courseId, coursesCollection(req))
    } catch (err) {
        return sendErrorResponse(req, res, 400, `invalid assignment data`, err)
    }

    try {
        let assignment = new Assignment(assignmentBody.name, assignmentBody.description, assignmentBody.dueDate, new ObjectID(assignmentBody.courseId))
        assignment.validate()

        try {
            assignment = await createAssignment(assignmentsCollection(req), assignment)
            res.status(201).location(`/api/assignments/${assignment.id}`).json(assignment)
        } catch (err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `assignment already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting assignment in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid assignment data`, err)
    }
})

assignmentRouter.get('/:assignmentId', authn, authz(['READ_ASSIGNMENT']), async (req, res) => {
    const assignmentId = req.params.assignmentId

    if(!isValidId(assignmentId)) {
        return sendErrorResponse(req, res, 400, `invalid assignment data`, new Error('invalid assignment id'))
    }

    try {
        const assignment = await readAssignmentById(assignmentsCollection(req), assignmentId)
        res.json(assignment)
    } catch (err) {
        const message = `read from db failed`
        if (err.message && err.message.includes('does not exist')) {
            return sendErrorResponse(req, res, 404, message, err)
        }
        sendErrorResponse(req, res, 500, message, err)
    }
})

assignmentRouter.patch('/:assignmentId', authn, authz(['UPDATE_ASSIGNMENT']), async (req, res) => {
    const assignmentId = req.params.assignmentId
    const assignmentBody = req.body

    if(!isValidId(assignmentId)) {
        return sendErrorResponse(req, res, 400, `invalid assignment data`, new Error('invalid assignment id'))
    }

    if (assignmentBody.courseId != null) {
        try {
            await validateCourseId(assignmentBody.courseId, coursesCollection(req))
        } catch (err) {
            return sendErrorResponse(req, res, 400, `invalid assignment data`, err)
        }
    }

    try {
        let assignment = new Assignment(assignmentBody.name, assignmentBody.description, assignmentBody.dueDate, new ObjectID(assignmentBody.courseId)).removeEmptyFields()
        assignment.validatePatch()
        delete assignment.courseId

        try {
            assignment = await updateAssignment(assignmentsCollection(req), assignmentId, assignment)
            res.json(assignment)
        } catch (err) {
            const message = `error while updating assignment in the database`
            if (err.message && err.message.includes('does not exist')) {
                return sendErrorResponse(req, res, 404, message, err)
            }
            sendErrorResponse(req, res, 500, message, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid assignment data`, err)
    }
})

assignmentRouter.delete('/:assignmentId', authn, authz(['DELETE_ASSIGNMENT']), async (req, res) => {
    const assignmentId = req.params.assignmentId

    if(!isValidId(assignmentId)) {
        return sendErrorResponse(req, res, 400, `invalid assignment data`, new Error('invalid assignment id'))
    }
    
    try {
        await deleteAssignment(assignmentsCollection(req), assignmentId)
        res.status(204).end()
    } catch (err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function assignmentsCollection(req) {
    return req.app.locals.db.collection('assignments')
}

function coursesCollection(req) {
    return req.app.locals.db.collection('courses')
}

async function validateCourseId(courseId, coursesCollection) {
    await isExistingId(courseId, coursesCollection, 'course')
}

module.exports = assignmentRouter