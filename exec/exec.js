const childProcess = require("child_process")

async function runTests(imageName, containerName, assignment, solutionGitUser, solutionGitRepo, testsGitUser, testsGitRepo, dockerfile) {
    try {
        await buildDockerImage(imageName, assignment, solutionGitUser, solutionGitRepo, testsGitUser, testsGitRepo, dockerfile)
    } catch (err) {
        console.error("failed to build docker image", err)
        throw err
    }

    let runDockerImageOut
    try {
        runDockerImageOut = await runDockerImage(containerName, imageName)
    } catch (err) {
        console.error("failed to run docker image", err)
        try {
            await removeDockerImage(imageName)
        } catch (err) {
            console.error("failed to remove docker image", err)
            throw err
        }
        throw err
    }

    try {
        await removeDockerContainer(containerName)
    } catch (err) {
        console.error("failed to remove docker container", err)
        try {
            await removeDockerImage(imageName)
        } catch (err) {
            console.error("failed to remove docker image", err)
            throw err
        }
        throw err
    }

    try {
        await removeDockerImage(imageName)
    } catch (err) {
        console.error("failed to remove docker image", err)
        throw err
    }

    return runDockerImageOut
}

function buildDockerImage(imageName, assignment, solutionGitUser, solutionGitRepo, testsGitUser, testsGitRepo, dockerfile) {
    const buildDockerImageCommand = `docker build --no-cache -t ${imageName} --build-arg assignment=${assignment} --build-arg solutionGitUser=${solutionGitUser} --build-arg solutionGitRepo=${solutionGitRepo} --build-arg testsGitUser=${testsGitUser} --build-arg testsGitRepo=${testsGitRepo} ${dockerfile}`
    return exec(buildDockerImageCommand)
}

function runDockerImage(containerName, imageName) {
    return new Promise((resolve, reject) => {
        childProcess.exec(`docker run --name ${containerName} ${imageName}`, {}, (err, stdout, stderr) => {
            if (err) {
                console.log("stdout >>>", stdout)
                console.log("stderr >>>", stderr)
            }
            return resolve(stdout)
        })
    })
}

function removeDockerContainer(containerName) {
    return exec(`docker rm ${containerName}`)
}

function removeDockerImage(imageName) {
    return exec(`docker image rm ${imageName}`)
}

function exec(command) {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, {}, (err, stdout, stderr) => {
            if (err) {
                console.log("stdout >>>", stdout)
                console.log("stderr >>>", stderr)
                return reject(err)
            }
            return resolve(stdout)
        })
    })
}

module.exports.runTests = runTests
module.exports.exec = exec