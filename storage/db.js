const MongoClient = require('mongodb').MongoClient
const { ObjectID } = require("bson")
const dbUrl = "mongodb://localhost:27017"
const dbName = "grader"
const { read } = require("./crud")


const client = new MongoClient(dbUrl, { useUnifiedTopology: true })

exports.connect = async (app) => {
    const connection = await client.connect()
    app.locals.db = connection.db(dbName)
}

async function isExistingId(id, collection, entityName) {
    if (!isValidId(id)) {
        throw Error(`${entityName} id '${id}' is invalid`)
    }
    try {
        const entity = await read(collection, filterById(id), entityName)
        return entity
    } catch (err) {
        throw Error(`${entityName} with id '${id}' does not exist`)
    }
}

function isValidId(id) {
    return ObjectID.isValid(id)
}

function filterById(id) {
    return { _id: new ObjectID(id) }
}

module.exports.isExistingId = isExistingId
module.exports.isValidId = isValidId