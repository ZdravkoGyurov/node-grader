const { ObjectID } = require("bson")

async function create(collection, entity, entityName) {
    const insertResult = await collection.insertOne(entity)
    if (insertResult.result.ok && insertResult.insertedCount === 1) {
        return fixEntityId(entity, insertResult.insertedId)
    } else {
        throw Error(`failed to insert ${entityName} in the database`)
    }
}

async function readAll(collection) {
    const entities = await collection.find().toArray()
    return entities.map(e => fixEntityId(e, e._id))
}

async function read(collection, id, entityName) {
    const entity = await collection.findOne({ _id: new ObjectID(id) })
    if (!entity) {
        throw Error(`failed to read ${entityName} with id '${id}', does not exist`)
    }
    return fixEntityId(entity, entity._id)
}

async function update(collection, id, entity, entityName) {
    delete entity._id

    const updateResult = await collection.findOneAndUpdate(
        { _id: new ObjectID(id) },
        { $set: entity },
        { returnDocument: 'after' }
    );
    if (!updateResult.ok || !updateResult.lastErrorObject.updatedExisting) {
        throw Error(`failed to update ${entityName} with id '${id}' in the database`)
    }

    entity.id = id

    return updateResult.value
}

async function deleteEntity(collection, id, entityName) {
    const deleteResult = await collection.deleteOne({ _id: new ObjectID(id) })
    if (!deleteResult.result.ok) {
        throw Error(`failed to delete ${entityName} with id '${id}' from the database`)
    }
}

function fixEntityId(e, newId) {
    e = {'id': newId, ...e}
    delete e._id
    return e
}

module.exports.create = create
module.exports.readAll = readAll
module.exports.read = read
module.exports.update = update
module.exports.deleteEntity = deleteEntity