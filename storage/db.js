const MongoClient = require('mongodb').MongoClient
const { ObjectID } = require("bson")
const dbUrl = "mongodb://localhost:27017"
const dbName = "grader"

const client = new MongoClient(dbUrl, { useUnifiedTopology: true })

exports.connect = async (app) => {
    const connection = await client.connect()
    app.locals.db = connection.db(dbName)
}

function isValidId(id) {
    return ObjectID.isValid(id)
}

module.exports.isValidId = isValidId