# Mongo DB Model

### RevokedTokens ✔️
- ID     string
- Token string
  - CreateToken(...)
  - ReadToken(token string)

### User ✔️
- ID             string
- Username       string
- GithubUsername string
- Fullname       string
- Password       string
- Permissions    []string
- CourseID       []string
  - CreateUser(...)
  - ReadUserByID(userID string)
  - ReadUserByUsername(username string)
  - ReadAllUsers(courseID string)
  - UpdateUser(userID string)
  - DeleteUser(userID string)

### Submission ✔️
- ID           string
- Results      string?
- Status       string
- UserID       string <--+-< unique by user and assignment
- AssignmentID string <--+
  - CreateSubmission(...)
  - ReadSubmission(submissionID string)
  - ReadAllSubmissions(userID string, assignmentID string)
  - UpdateSubmission(submissionID string)
  - DeleteSubmission(submissionID string)

### Assignment ✔️
- ID          string
- Name        string
- Description string
- CreatedOn   time.Duration
- DueDate     time.Duration
- CourseID    string
  - CreateAssignment(...)
  - ReadAssignment(assignmentID string)
  - ReadAllAssignments(courseID string)
  - UpdateAssignment(assignmentID string)
  - DeleteAssignment(assignmentID string)

### Course ✔️
- ID             string
- Name           string
- Description    string
- GithubRepoName string
  - CreateCourse(...)
  - ReadCourse(courseID string)
  - ReadAllCourses()
  - UpdateCourse(courseID string, ...)
  - DeleteCourse(courseID string)

### PermissionRequest ✔️
- ID          string
- Permissions []string
- Status      string
- UserID
  - CreateRequest(...)
  - ReadRequest(requestID string)
  - ReadAllRequests(userID string)
  - UpdateRequest(requestID string)
  - DeleteRequest(requestID string)

### CourseRequest ✔️
- ID          string
- CourseID    []string
- Status      string
- UserID
  - CreateRequest(...)
  - ReadRequest(requestID string)
  - ReadAllRequests(userID string)
  - UpdateRequest(requestID string)
  - DeleteRequest(requestID string)

CREATE_ASSIGNMENT - admin, teacher only in courses they are in
READ_ASSIGNMENT - admin, teacher&student only the ones in courses they are in
UPDATE_ASSIGNMENT - admin, teacher only the ones in courses they are in
DELETE_ASSIGNMENT - admin, teacher only the ones in courses they are in

CREATE_COURSE - admin, teacher
READ_COURSE - admin, teacher&student only the ones they are in
UPDATE_COURSE - admin, teacher
DELETE_COURSE - admin, teacher

CREATE_SUBMISSION - everyone, should be upsert
READ_SUBMISSION - admin, teacher, students only their own
UPDATE_SUBMISSION - should be removed
DELETE_SUBMISSION - should be removed

READ_USERS - admin, teachers&students only their own
UPDATE_USERS - everyone, only github_username, fullname
DELETE_USER - should be removed

CREATE_REQUEST - teacher, student
READ_REQUEST - admin, teacher&student only their own
UPDATE_REQUEST - admin, teacher&student only their own
DELETE_REQEUST - admin, teacher&student only their own

ADMIN_PERMISSIONS = [*]
TEACHER_PERMISSIONS = [*]
STUDENT_PERMISSIONS = [
  READ_ASSIGNMENT,
  READ_COURSE,
  CREATE_SUBMISSION,
  READ_SUBMISSION,
  READ_USERS,
  UPDATE_USERS,
  CREATE_REQUEST,
  READ_REQUEST,
  UPDATE_REQUEST,
  DELETE_REQEUST,
]