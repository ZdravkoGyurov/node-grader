const jwt = require('jsonwebtoken');
const secret = require('../config/secret').secret;

function authn(req, res, next) {
    const tokenHeader = req.headers['authorization']
    if(!tokenHeader) {
      next({ status: 401, message: `no authorization header` })
      return
    }
    
    const segments = tokenHeader.split(' ');
    if (segments.length !== 2 || segments[0].trim() !== 'Bearer' || segments[1].trim().length < 80) {
      next({ status: 401, message: `No valid access token provided.` })
      return
    }

    const token = segments[1].trim();
    console.log(`Bearer token: ${token}`);
  
    jwt.verify(token, secret, function (error, decoded) {
      if (error) next({ status: 401, message: `token is invalid`, error })
      else {
        const revokedTokensCollection = req.app.locals.db.collection('revoked_tokens')
        revokedTokensCollection.findOne({ token: token }, function (error, user) {
            if (error) {
                next({ status: 500, message: `server error`, error })
            }
            else if (!user) {
                // if everything good, save to request for use in other routes
                req.userId = decoded.id
                next()
            }
            else {
                next({ status: 401, message: `token is revoked` })
            }
          })
      }
    });
  }
  
  module.exports = authn;