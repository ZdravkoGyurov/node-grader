const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { PermissionsRequest } = require("../models/permissionsRequest")
const { isValidId } = require("../storage/db")
const { createPermissionsRequest, readPermissionsRequests, deletePermissionsRequest, updatePermissionsRequest } = require("../storage/permissionsRequestStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")
const { RequestStatus } = require("../models/requestStatus")

const permissionsRequestRouter = Router()

permissionsRequestRouter.get('/all', authn, authz(['READ_ALL_PERMISSIONSREQUESTS']), async (req, res) => {
    try {
        const permissionsRequests = await readPermissionsRequests(permissionsRequestsCollection(req))
        res.status(200).json(permissionsRequests)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

permissionsRequestRouter.get('/', authn, authz(['READ_PERMISSIONSREQUESTS']), async (req, res) => {
    try {
        const permissionsRequests = await readPermissionsRequests(permissionsRequestsCollection(req), req.userId)
        res.status(200).json(permissionsRequests)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

permissionsRequestRouter.post('/', authn, authz(['CREATE_PERMISSIONSREQUEST']), async (req, res) => {
    const body = req.body
    
    try {
        let permissionsRequest = new PermissionsRequest(body.permissions, RequestStatus.PENDING, req.userId)
        permissionsRequest.validate()

        try {
            permissionsRequest = await createPermissionsRequest(permissionsRequestsCollection(req), permissionsRequest)
            res.status(202).location(`/api/permissionsRequests/${permissionsRequest.id}`).json(permissionsRequest)
        } catch(err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `permissionsRequest already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting permissionsRequest in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid permissionsRequest data`, err)
    }
})

permissionsRequestRouter.patch('/:permissionsRequestId', authn, authz(['UPDATE_PERMISSIONSREQUEST']), async (req, res) => {
    const permissionsRequestId = req.params.permissionsRequestId
    const body = req.body

    if(!isValidId(permissionsRequestId)) {
        return sendErrorResponse(req, res, 400, `invalid permissionsRequest data`, new Error('invalid permissionsRequest id'))
    }

    try {
        let permissionsRequest = new PermissionsRequest(body.permissions, body.status, req.userId).removeEmptyFields()
        permissionsRequest.validatePatch()
        delete permissionsRequest.permissions
        delete permissionsRequest.userId

        try {
            permissionsRequest = await updatePermissionsRequest(permissionsRequestsCollection(req), permissionsRequestId, permissionsRequest)

            res.json(permissionsRequest)
        } catch(err) {
            const message = `error while updating permissionsRequest in the database`
            if (err.message && err.message.includes('does not exist')) {
                return sendErrorResponse(req, res, 404, message, err)
            }
            sendErrorResponse(req, res, 500, message, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid permissionsRequest data`, err)
    }
})

permissionsRequestRouter.delete('/:permissionsRequestId', authn, authz(['DELETE_PERMISSIONSREQUEST']), async (req, res) => {
    const permissionsRequestId = req.params.permissionsRequestId

    if(!isValidId(permissionsRequestId)) {
        return sendErrorResponse(req, res, 400, `invalid permissionsRequest data`, new Error('invalid permissionsRequest id'))
    }
    
    try {
        await deletePermissionsRequest(permissionsRequestsCollection(req), permissionsRequestId)
        res.status(204).end()
    } catch(err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function permissionsRequestsCollection(req) {
    return req.app.locals.db.collection('permissionsRequests')
}

module.exports = permissionsRequestRouter