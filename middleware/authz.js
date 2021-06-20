const mongodb = require('mongodb');

module.exports = function authz(permissions) {
  return function (req, res, next) {
    const userId = req.userId;
    const usersCollection = req.app.locals.db.collection('users')

    if (!userId) next({ status: 403, message: `userId is missing` })
    
    else {
        usersCollection.findOne({ _id: new mongodb.ObjectID(userId) }, function (error, user) {
        if (error) next({ status: 500, message: `server error`, error })
        else if (!user) next({ status: 404, message: `user not found` })
        else {
            const hasPermission = permissions.some(p => user.permissions.includes(p))
            if (!hasPermission) {
                next({ status: 403, message: `no permissions` })
            }
            next()
        }
      });
    }
  }
}