const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { CoursesRequest } = require("../models/coursesRequest")
const { isValidId } = require("../storage/db")
const { createCoursesRequest, readCoursesRequests, deleteCoursesRequest, updateCoursesRequest } = require("../storage/coursesRequestStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")
const { RequestStatus } = require("../models/requestStatus")

const coursesRequestRouter = Router()

coursesRequestRouter.get('/all', authn, authz(['READ_ALL_COURSESREQUESTS']), async (req, res) => {
    try {
        const coursesRequests = await readCoursesRequests(coursesRequestsCollection(req))
        res.status(200).json(coursesRequests)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

coursesRequestRouter.get('/', authn, authz(['READ_COURSESREQUESTS']), async (req, res) => {
    try {
        const coursesRequests = await readCoursesRequests(coursesRequestsCollection(req), req.userId)
        res.status(200).json(coursesRequests)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

coursesRequestRouter.post('/', authn, authz(['CREATE_COURSESREQUEST']), async (req, res) => {
    const body = req.body
    
    try {
        let coursesRequest = new CoursesRequest(body.courseIds, RequestStatus.PENDING, req.userId)
        coursesRequest.validate()

        try {
            coursesRequest = await createCoursesRequest(coursesRequestsCollection(req), coursesRequest)
            res.status(202).location(`/api/coursesRequests/${coursesRequest.id}`).json(coursesRequest)
        } catch (err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `coursesRequest already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting coursesRequest in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid coursesRequest data`, err)
    }
})

coursesRequestRouter.patch('/:coursesRequestId', authn, authz(['UPDATE_COURSESREQUEST']), async (req, res) => {
    const coursesRequestId = req.params.coursesRequestId
    const body = req.body

    if(!isValidId(coursesRequestId)) {
        return sendErrorResponse(req, res, 400, `invalid coursesRequest data`, new Error('invalid coursesRequest id'))
    }

    try {
        let coursesRequest = new CoursesRequest(body.courseIds, body.status, req.userId).removeEmptyFields()
        coursesRequest.validatePatch()
        delete coursesRequest.courseIds
        delete coursesRequest.userId

        try {
            coursesRequest = await updateCoursesRequest(coursesRequestsCollection(req), coursesRequestId, coursesRequest)

            res.json(coursesRequest)
        } catch (err) {
            const message = `error while updating coursesRequest in the database`
            if (err.message && err.message.includes('does not exist')) {
                return sendErrorResponse(req, res, 404, message, err)
            }
            sendErrorResponse(req, res, 500, message, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid coursesRequest data`, err)
    }
})

coursesRequestRouter.delete('/:coursesRequestId', authn, authz(['DELETE_COURSESREQUEST']), async (req, res) => {
    const coursesRequestId = req.params.coursesRequestId

    if(!isValidId(coursesRequestId)) {
        return sendErrorResponse(req, res, 400, `invalid coursesRequest data`, new Error('invalid coursesRequest id'))
    }
    
    try {
        await deleteCoursesRequest(coursesRequestsCollection(req), coursesRequestId)
        res.status(204).end()
    } catch (err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function coursesRequestsCollection(req) {
    return req.app.locals.db.collection('coursesRequests')
}

module.exports = coursesRequestRouter