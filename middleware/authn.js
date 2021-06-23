const jwt = require('jsonwebtoken')
const secret = require('../config/secret').secret

function authn(req, res, next) {
    const tokenHeader = req.headers['authorization']
    if (!tokenHeader) {
      next({ status: 401, message: `no authorization header` })
      return
    }
    
    const segments = tokenHeader.split(' ')
    if (segments.length !== 2 || segments[0].trim() !== 'Bearer' || segments[1].trim().length < 80) {
      next({ status: 401, message: `access token is invalid` })
      return
    }

    const token = segments[1].trim()
  
    jwt.verify(token, secret, function (error, decoded) {
      if (error) {
        next({ status: 401, message: `token is invalid`, error })
        return
      }

      const revokedTokensCollection = req.app.locals.db.collection('revokedTokens')
      revokedTokensCollection.findOne({ token: token }, function (error, token) {
          if (error) {
            next({ status: 500, message: `server error`, error })
            return
          }

          if (token) {
            next({ status: 401, message: `token is revoked` })
            return
          }

          req.userId = decoded.id
          next()
        })
    })
  }
  
  module.exports = authn