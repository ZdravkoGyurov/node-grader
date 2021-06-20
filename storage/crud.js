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

async function read(collection, filter, entityName) {
    const entity = await collection.findOne(filter)
    if (!entity) {
        throw Error(`failed to read ${entityName}, does not exist`)
    }
    return fixEntityId(entity, entity._id)
}

async function update(collection, filter, entity, entityName) {
    delete entity._id

    const updateResult = await collection.findOneAndUpdate(
        filter,
        { $set: entity },
        { returnDocument: 'after' }
    );
    if (!updateResult.ok || !updateResult.lastErrorObject.updatedExisting) {
        throw Error(`failed to update ${entityName} in the database`)
    }

    return updateResult.value
}

async function deleteBy(collection, filter, entityName) {
    const deleteResult = await collection.deleteOne(filter)
    if (!deleteResult.result.ok) {
        throw Error(`failed to delete ${entityName} from the database`)
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
module.exports.deleteBy = deleteBy