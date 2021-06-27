const { Router } = require("express")
const { sendErrorResponse } = require("../errors")
const { Course } = require("../models/course")
const { isValidId } = require("../storage/db")
const { createCourse, readAllCourses, readCourses, readCourseById, deleteCourse, updateCourse } = require("../storage/courseStorage")
const authn = require("../middleware/authn")
const authz = require("../middleware/authz")

const courseRouter = Router()

courseRouter.get('/all', authn, authz(['READ_ALL_COURSES']), async (req, res) => {
    try {
        const courses = await readAllCourses(coursesCollection(req))
        res.status(200).json(courses)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

courseRouter.get('/', authn, authz(['READ_COURSES']), async (req, res) => {
    try {
        const courses = await readCourses(coursesCollection(req), req.userCourses)
        res.status(200).json(courses)
    } catch (err) {
        sendErrorResponse(req, res, 500, `Server error: ${err.message}`, err)
    }
})

courseRouter.post('/', authn, authz(['CREATE_COURSE']), async (req, res) => {
    const courseBody = req.body
    
    try {
        let course = new Course(courseBody.name, courseBody.description, courseBody.githubRepoName)
        course.validate()

        try {
            course = await createCourse(coursesCollection(req), course)
            res.status(201).location(`/api/courses/${course.id}`).json(course)
        } catch (err) {
            if (err.message && err.message.includes('E11000')) {
                return sendErrorResponse(req, res, 409, `course already exists`, err)
            }
            sendErrorResponse(req, res, 500, `error while inserting course in the database`, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid course data`, err)
    }
})

courseRouter.get('/:courseId', authn, authz(['READ_COURSE']), async (req, res) => {
    const courseId = req.params.courseId

    if(!isValidId(courseId)) {
        return sendErrorResponse(req, res, 400, `invalid course data`, new Error('invalid course id'))
    }

    try {
        const course = await readCourseById(coursesCollection(req), courseId)
        res.json(course)
    } catch (err) {
        const message = `read from db failed`
        if (err.message && err.message.includes('does not exist')) {
            return sendErrorResponse(req, res, 404, message, err)
        }
        sendErrorResponse(req, res, 500, message, err)
    }
})

courseRouter.patch('/:courseId', authn, authz(['UPDATE_COURSE']), async (req, res) => {
    const courseId = req.params.courseId
    const courseBody = req.body

    if(!isValidId(courseId)) {
        return sendErrorResponse(req, res, 400, `invalid course data`, new Error('invalid course id'))
    }

    try {
        let course = new Course(courseBody.name, courseBody.description, courseBody.githubRepoName).removeEmptyFields()
        course.validatePatch()

        try {
            course = await updateCourse(coursesCollection(req), courseId, course)

            res.json(course)
        } catch (err) {
            const message = `error while updating course in the database`
            if (err.message && err.message.includes('does not exist')) {
                return sendErrorResponse(req, res, 404, message, err)
            }
            sendErrorResponse(req, res, 500, message, err)
        }
    } catch (err) {
        sendErrorResponse(req, res, 400, `invalid course data`, err)
    }
})

courseRouter.delete('/:courseId', authn, authz(['DELETE_COURSE']), async (req, res) => {
    const courseId = req.params.courseId

    if(!isValidId(courseId)) {
        return sendErrorResponse(req, res, 400, `invalid course data`, new Error('invalid course id'))
    }
    
    try {
        await deleteCourse(coursesCollection(req), courseId)
        res.status(204).end()
    } catch (err) {
        sendErrorResponse(req, res, 500, `read from db failed`, err)
    }
})

function coursesCollection(req) {
    return req.app.locals.db.collection('courses')
}

module.exports = courseRouter