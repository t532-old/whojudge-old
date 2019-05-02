export class UsernameNotExistError extends Error {
    get status() { return 404 }
    constructor(username: string) {
        super(`user "${username}" does not exist`)
    }
}
export class UsernameExistsError extends Error {
    get status() { return 403 }
    constructor(username: string) {
        super(`user "${username}" does not exist`)
    }
}
export class UsernameIllegalError extends Error {
    get status() { return 403 }
}
export class PasswordIncorrectError extends Error {
    get status() { return 403 }
    constructor() {
        super(`wrong password`)
    }
}
export class TokenNotExistError extends Error {
    get status() { return 403 }
    constructor() {
        super(`token does not exist`)
    }
}
export class ProblemNotExistError extends Error {
    get status() { return 404 }
    constructor(id: number) {
        super(`problem ${id} does not exist`)
    }
}
export class TestcaseNotExistError extends Error {
    get status() { return 404 }
    constructor(id: number) {
        super(`testcase ${id} does not exist`)
    }
}
export class PermissionDeniedError extends Error {
    get status() { return 403 }
}

export class SubmissionNotExistError extends Error {
    get status() { return 404 }
    constructor(id: number) {
        super(`submission ${id} does not exist`)
    }
}

export class InternalCallOnlyError extends Error {
    get status() { return 403 }
    constructor() {
        super(`this api is intended to call internally only`)
    }
}
