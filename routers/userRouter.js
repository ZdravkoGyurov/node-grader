const { Router } = require("express")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { sendErrorResponse } = require("../errors")
const { User } = require("../models/user")
const { isValidId } = require("../storage/db")
const { createUser, readUsers, readUserById, deleteUser, updateUser } = require("../storage/userStorage")

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await readUsers(usersCollection(req))
        res.status(200).json(users)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

userRouter.post('/', async (req, res) => {
    const userBody = req.body
    
    try {
        let user = new User(userBody.id, userBody.username, userBody.githubUsername, userBody.fullname,
            userBody.password)
        user.validate()

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
        } catch(err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `user already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting user in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid user data`, err)
    }
})

userRouter.get('/:userId', async (req, res) => {
    const userId = req.params.userId

    if(!isValidId(userId)) {
        return sendErrorResponse(req, res, 400, `invalid user data`, new Error('invalid user id'))
    }

    try {
        const user = await readUserById(usersCollection(req), userId)
        res.json(user)
    } catch(err) {
        const message = `read from db failed`
        if (err.message && err.message.includes('does not exist')) {
            return sendErrorResponse(req, res, 404, message, err)
        }
        sendErrorResponse(req, res, 500, message, err)
    }
})

userRouter.patch('/:userId', async (req, res) => {
    const userId = req.params.userId
    const userBody = req.body

    if(!isValidId(userId)) {
        return sendErrorResponse(req, res, 400, `invalid user data`, new Error('invalid user id'))
    }

    try {
        let user = new User(userBody.id, userBody.username, userBody.githubUsername, userBody.fullname,
            userBody.password, userBody.permissions, userBody.courseIds).removeEmptyFields()
        delete user.password
        user.validate()

        try {
            user = await updateUser(usersCollection(req), userId, user)
            res.json(user)
        } catch(err) {
            sendErrorResponse(req, res, 500, `error while inserting user in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid user data`, err)
    }
})

userRouter.delete('/:userId', async (req, res) => {
    const userId = req.params.userId

    if(!isValidId(userId)) {
        return sendErrorResponse(req, res, 400, `invalid user data`, new Error('invalid user id'))
    }
    
    try {
        await deleteUser(usersCollection(req), userId)
        res.status(204).end()
    } catch(err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function usersCollection(req) {
    return req.app.locals.db.collection('users')
}

module.exports = userRouter