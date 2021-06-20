const express = require('express');
const { sendErrorResponse } = require('./errors');
const userRouter = require('./routers/userRouter');
const courseRouter = require('./routers/courseRouter');
const assignmentRouter = require('./routers/assignmentRouter');
const { connect } = require('./storage/db');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/courses', courseRouter)
app.use('/api/assignments', assignmentRouter)

app.use(function (err, req, res, next) {
    console.error(err.stack);
    err.status = err.status || 500;
    sendErrorResponse(req, res, err.status, `Error: ${err.message}`, err);
})

connect(app).then(() => {
    app.listen(port, () => {
        console.log(`listening on ${port}`)
    })
})