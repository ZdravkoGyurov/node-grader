const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { CoursesRequest } = require("../models/coursesRequest")
const { isValidId, isExistingId } = require("../storage/db")
const { createCoursesRequest, readCoursesRequests, deleteCoursesRequest, updateCoursesRequest } = require("../storage/coursesRequestStorage")
const { addUserCourse } = require("../storage/userStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")
const { RequestStatus } = require("../models/requestStatus")
const { ObjectID } = require("bson")

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
        await validateCourseId(body.courseId, coursesCollection(req))
    } catch (err) {
        return sendErrorResponse(req, res, 400, `invalid coursesRequest data`, err)
    }
    try {
        await validateUserId(req.userId, usersCollection(req))
    } catch (err) {
        return sendErrorResponse(req, res, 400, `invalid coursesRequest data`, err)
    }

    try {
        let coursesRequest = new CoursesRequest(new ObjectID(body.courseId), RequestStatus.PENDING, new ObjectID(req.userId))
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

    if (body.courseId != null) {
        return sendErrorResponse(req, res, 400, `courseId cannot be changed`)
    }

    try {
        let coursesRequest = new CoursesRequest(new ObjectID(body.courseId), body.status, new ObjectID(req.userId)).removeEmptyFields()
        coursesRequest.validatePatch()
        delete coursesRequest.courseId
        delete coursesRequest.userId

        try {
            coursesRequest = await updateCoursesRequest(coursesRequestsCollection(req), coursesRequestId, coursesRequest)
            if (coursesRequest.status === RequestStatus.APPROVED) {
                try {
                    await addUserCourse(usersCollection(req), coursesRequest.userId, coursesRequest.courseId)
                } catch (err) {
                    return sendErrorResponse(req, res, 500, `failed to add course to user`, err)
                }
            }
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

function coursesCollection(req) {
    return req.app.locals.db.collection('courses')
}

function usersCollection(req) {
    return req.app.locals.db.collection('users')
}

async function validateCourseId(courseId, coursesCollection) {
    await isExistingId(courseId, coursesCollection, 'course')
}

async function validateUserId(userId, usersCollection) {
    await isExistingId(userId, usersCollection, 'user')
}

module.exports = coursesRequestRouter