FROM golang:alpine3.13

ARG assignment=assignment1
ARG solutionGitUser=ZdravkoGyurov
ARG solutionGitRepo=grader-docker-solutions
ARG testsGitUser=ZdravkoGyurov
ARG testsGitRepo=grader-docker-tests

ENV ASSIGNMENT ${assignment}

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache git

RUN git clone https://github.com/${solutionGitUser}/${solutionGitRepo}.git
RUN git clone https://github.com/${testsGitUser}/${testsGitRepo}.git
RUN cp -r ./${solutionGitRepo}/$ASSIGNMENT/* . && rm -rf ./${solutionGitRepo}
RUN cp -r ./${testsGitRepo}/$ASSIGNMENT/* . && rm -rf ./${testsGitRepo}

ENTRYPOINT go test -v ./...
