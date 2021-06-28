const DEFAULT_PERMISSIONS = [
    'READ_ASSIGNMENTS',
    'READ_ASSIGNMENT',
    'READ_ALL_COURSES',
    'READ_COURSES',
    'READ_COURSE',
    'READ_COURSESREQUESTS',
    'CREATE_COURSESREQUEST',
    'DELETE_COURSESREQUEST',
    'READ_PERMISSIONSREQUESTS',
    'CREATE_PERMISSIONSREQUEST',
    'DELETE_PERMISSIONSREQUEST',
    'READ_SUBMISSIONS',
    'CREATE_SUBMISSION',
    'READ_SUBMISSION',
    'DELETE_SUBMISSION',
    // 'CREATE_ASSIGNMENT', // teacher + admin
    // 'UPDATE_ASSIGNMENT', // teacher + admin
    // 'DELETE_ASSIGNMENT', // teacher + admin
    // 'CREATE_COURSE', // teacher + admin 
    // 'UPDATE_COURSE', // teacher + admin
    // 'DELETE_COURSE', // teacher + admin
    // 'READ_ALL_COURSESREQUESTS', // admin
    // 'UPDATE_COURSESREQUEST', // admin
    // 'READ_ALL_PERMISSIONSREQUESTS', // admin
    // 'UPDATE_PERMISSIONSREQUEST', // admin
    // 'READ_ALL_SUBMISSIONS', // admin
    // 'READ_USERS', // admin
    // 'READ_USER', // admin
    // 'UPDATE_USER', // admin
    // 'DELETE_USER' // admin
]

const ALL_PERMISSIONS = [
    'READ_ASSIGNMENTS',
    'CREATE_ASSIGNMENT',
    'READ_ASSIGNMENT',
    'UPDATE_ASSIGNMENT',
    'DELETE_ASSIGNMENT',
    'READ_ALL_COURSES',
    'READ_COURSES',
    'CREATE_COURSE',
    'READ_COURSE',
    'UPDATE_COURSE',
    'DELETE_COURSE',
    'READ_ALL_COURSESREQUESTS',
    'READ_COURSESREQUESTS',
    'CREATE_COURSESREQUEST',
    'UPDATE_COURSESREQUEST',
    'DELETE_COURSESREQUEST',
    'READ_ALL_PERMISSIONSREQUESTS',
    'READ_PERMISSIONSREQUESTS',
    'CREATE_PERMISSIONSREQUEST',
    'UPDATE_PERMISSIONSREQUEST',
    'DELETE_PERMISSIONSREQUEST',
    'READ_ALL_SUBMISSIONS',
    'READ_SUBMISSIONS',
    'CREATE_SUBMISSION',
    'READ_SUBMISSION',
    'DELETE_SUBMISSION',
    'READ_USERS',
    'READ_USER',
    'UPDATE_USER',
    'DELETE_USER'
]

module.exports.DEFAULT_PERMISSIONS = DEFAULT_PERMISSIONS
module.exports.ALL_PERMISSIONS = ALL_PERMISSIONS