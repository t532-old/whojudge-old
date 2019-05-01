export class UsernameNotExistError extends Error {
    status = 404
    constructor(username: string) {
        super(`user "${username}" does not exist`)
    }
}
export class UsernameExistsError extends Error {
    status = 403
    constructor(username: string) {
        super(`user "${username}" does not exist`)
    }
}
export class UsernameIllegalError extends Error {
    status = 403
}
export class PasswordIncorrectError extends Error {
    status = 403
    constructor() {
        super(`wrong password`)
    }
}
export class TokenNotExistError extends Error {
    status = 404
    constructor() {
        super(`token does not exist`)
    }
}
export class ProblemNotExistError extends Error {
    status = 404
    constructor(id: number) {
        super(`problem ${id} does not exist`)
    }
}
export class TestcaseNotExistError extends Error {
    status = 404
    constructor(id: number) {
        super(`testcase ${id} does not exist`)
    }
}
export class PermissionDeniedError extends Error {
    status = 403
}
