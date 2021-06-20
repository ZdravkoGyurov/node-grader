const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { readUserByUsername } = require("../storage/userStorage")
const { createToken } = require("../storage/tokenStorage")
const jwt = require('jsonwebtoken');
const secret = require('../config/secret').secret;
const authn = require("../middleware/authn")

const authRouter = Router()

authRouter.get('/login', async (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    if(!authorizationHeader) {
        return sendErrorResponse(req, res, 401, `no authorization header`)
    }

    const credentialsBase64 = authorizationHeader.split(' ')[1]
    const [username, password] = Buffer.from(credentialsBase64, 'base64').toString().split(':')

    try {
        const user = await readUserByUsername(usersCollection(req), username)

        try {
            const passwordMatches = await bcrypt.compare(password, user.password)
            if (!passwordMatches) {
                return sendErrorResponse(req, res, 401, `wrong password`)
            }
            const token = jwt.sign({id: user.id}, secret, {
                expiresIn: 86400 //expires in 24 h
            });
            res.status(200).json({'accessToken': token})
        } catch (err) {
            return sendErrorResponse(req, res, 401, `wrong password`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

authRouter.get('/logout', authn, async (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader ||  authorizationHeader.split(' ')[0].trim() !== 'Bearer') {
        return sendErrorResponse(req, res, 401, `no authorization header`)
    }

    const token = authorizationHeader.split(' ')[1]

    try {
        try {
            await createToken(req.app.locals.db.collection('revoked_tokens'), token)
            res.status(204).end()
        } catch(err) {
            sendErrorResponse(req, res, 500, `error while inserting token in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

function usersCollection(req) {
    return req.app.locals.db.collection('users')
}

module.exports = authRouter