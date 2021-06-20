const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { Assignment } = require("../models/assignment")
const { isValidId } = require("../storage/db")
const { createAssignment, readAssignments, readAssignmentById, deleteAssignment, updateAssignment } = require("../storage/assignmentStorage")

const assignmentRouter = Router()

assignmentRouter.get('/', async (req, res) => {
    try {
        const assignments = await readAssignments(assignmentsCollection(req))
        res.status(200).json(assignments)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

assignmentRouter.post('/', async (req, res) => {
    const assignmentBody = req.body
    
    try {
        let assignment = new Assignment(assignmentBody.id, assignmentBody.name, assignmentBody.description, assignmentBody.dueDate, assignmentBody.courseId)
        assignment.validate()

        try {
            assignment = await createAssignment(assignmentsCollection(req), assignment)
            res.status(201).location(`/api/assignments/${assignment.id}`).json(assignment)
        } catch(err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `assignment already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting assignment in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid assignment data`, err)
    }
})

assignmentRouter.get('/:assignmentId', async (req, res) => {
    const assignmentId = req.params.assignmentId

    if(!isValidId(assignmentId)) {
        return sendErrorResponse(req, res, 400, `invalid assignment data`, new Error('invalid assignment id'))
    }

    try {
        const assignment = await readAssignmentById(assignmentsCollection(req), assignmentId)
        res.json(assignment)
    } catch(err) {
        const message = `read from db failed`
        if (err.message && err.message.includes('does not exist')) {
            return sendErrorResponse(req, res, 404, message, err)
        }
        sendErrorResponse(req, res, 500, message, err)
    }
})

assignmentRouter.patch('/:assignmentId', async (req, res) => {
    const assignmentId = req.params.assignmentId
    const assignmentBody = req.body

    if(!isValidId(assignmentId)) {
        return sendErrorResponse(req, res, 400, `invalid assignment data`, new Error('invalid assignment id'))
    }

    try {
        let assignment = new Assignment(assignmentBody.id, assignmentBody.name, assignmentBody.description, assignmentBody.dueDate, assignmentBody.courseId).removeEmptyFields()
        assignment.validate()

        try {
            assignment = await updateAssignment(assignmentsCollection(req), assignmentId, assignment)

            res.json(assignment)
        } catch(err) {
            sendErrorResponse(req, res, 500, `error while inserting assignment in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid assignment data`, err)
    }
})

assignmentRouter.delete('/:assignmentId', async (req, res) => {
    const assignmentId = req.params.assignmentId

    if(!isValidId(assignmentId)) {
        return sendErrorResponse(req, res, 400, `invalid assignment data`, new Error('invalid assignment id'))
    }
    
    try {
        await deleteAssignment(assignmentsCollection(req), assignmentId)
        res.status(204).end()
    } catch(err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function assignmentsCollection(req) {
    return req.app.locals.db.collection('assignments')
}

module.exports = assignmentRouter