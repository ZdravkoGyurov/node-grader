const { Router } = require("express")
const bcrypt = require('bcrypt')
const saltRounds = 10
const { sendErrorResponse } = require("../errors")
const { User } = require("../models/user")
const { isValidId, isExistingId } = require("../storage/db")
const { createUser, readUsers, readUserById, deleteUser, updateUser } = require("../storage/userStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")
const { ALL_PERMISSIONS } = require("../models/permissions")
const { ObjectID } = require("bson")

const userRouter = Router()

userRouter.get('/', authn, authz(['READ_USERS']), async (req, res) => {
    try {
        const users = await readUsers(usersCollection(req))
        users.map(u => {
            delete u.password
            return u
        })
        res.status(200).json(users)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

userRouter.post('/', async (req, res) => {
    const userBody = req.body
    
    try {
        let user = new User(userBody.username, userBody.githubUsername, userBody.fullname, userBody.password)
        user.validate()
        user.permissions = ALL_PERMISSIONS
        user.courseIds = []

        try {
            const hash = await bcrypt.hash(user.password, saltRounds)
            user.password = hash
        } catch (err) {
            return sendErrorResponse(req, res, 500, `error while generating hash`, err)
        }

        try {
            user = await createUser(usersCollection(req), user)
            delete user.password // dont return password
            res.status(201).location(`/api/users/${user.id}`).json(user)
        } catch (err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `user already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting user in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid user data`, err)
    }
})

userRouter.get('/:userId', authn, authz(['READ_USER']), async (req, res) => {
    const userId = req.params.userId

    if(!isValidId(userId)) {
        return sendErrorResponse(req, res, 400, `invalid user data`, new Error('invalid user id'))
    }

    try {
        const user = await readUserById(usersCollection(req), userId)
        delete user.password
        res.json(user)
    } catch (err) {
        const message = `read from db failed`
        if (err.message && err.message.includes('does not exist')) {
            return sendErrorResponse(req, res, 404, message, err)
        }
        sendErrorResponse(req, res, 500, message, err)
    }
})

userRouter.patch('/:userId', authn, authz(['UPDATE_USER']), async (req, res) => {
    const userId = req.params.userId
    const userBody = req.body

    if(!isValidId(userId)) {
        return sendErrorResponse(req, res, 400, `invalid user data`, new Error('invalid user id'))
    }

    try {
        await validateCourseIds(userBody.courseIds, coursesCollection(req))
    } catch (err) {
        return sendErrorResponse(req, res, 400, `invalid user data`, err)
    }

    try {
        const courseIds = userBody.courseIds.map(c => new ObjectID(c))
        let user = new User(userBody.username, userBody.githubUsername, userBody.fullname,
            userBody.password, userBody.permissions, courseIds).removeEmptyFields()
        delete user.password
        user.validatePatch()

        try {
            user = await updateUser(usersCollection(req), userId, user)
            res.json(user)
        } catch (err) {
            const message = `error while updating user in the database`
            if (err.message && err.message.includes('does not exist')) {
                return sendErrorResponse(req, res, 404, message, err)
            }
            sendErrorResponse(req, res, 500, message, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid user data`, err)
    }
})

userRouter.delete('/:userId', authn, authz(['DELETE_USER']), async (req, res) => {
    const userId = req.params.userId

    if(!isValidId(userId)) {
        return sendErrorResponse(req, res, 400, `invalid user data`, new Error('invalid user id'))
    }
    
    try {
        await deleteUser(usersCollection(req), userId)
        res.status(204).end()
    } catch (err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function usersCollection(req) {
    return req.app.locals.db.collection('users')
}

function coursesCollection(req) {
    return req.app.locals.db.collection('courses')
}

async function validateCourseIds(courseIds, coursesCollection) {
    if (!courseIds || courseIds.length === 0) return

    const exist = []
    courseIds.forEach(c => {
        exist.push(isExistingId(c, coursesCollection, 'course'))
    })
    try {
        await Promise.all(exist)
    } catch (err) {
        throw err
    }
}

module.exports = userRouter