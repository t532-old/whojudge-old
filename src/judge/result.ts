import { post } from 'httpie'
import { SERVER_PORT } from '../config.json'
import token from './token'

export const JUDGE_STATUS = {
    AC: { id: 'AC', description: 'Accepted' },
    WA: { id: 'WA', description: 'Wrong Answer' },
    TLE: { id: 'TLE', description: 'Time Limit Exceeded' },
    MLE: { id: 'MLE', description: 'Memory Limit Exceeded' },
    RE: { id: 'RE', description: 'Runtime Error' },
    CE: { id: 'CE', description: 'Compile Error' },
    UKE: { id: 'UKE', description: 'Unknown Error' },
    PC: { id: 'PC', description: 'Partially Correct' },
}

export interface JudgeResult {
    status: { id: string, description: string }
    point: number
    message: string
}

export class Accepted implements JudgeResult {
    public constructor(point: number) { this.point = point }
    public get status() { return JUDGE_STATUS.AC }
    public readonly point: number
    public get message() { return `${this.status.description}: ${this.point}/${this.point}` }
}

export class WrongAnswer implements JudgeResult {
    public constructor(message: string) { this._message = message }
    public get status() { return JUDGE_STATUS.WA }
    public get point() { return 0 }
    private readonly _message: string
    public get message() { return `${this.status.description}: ${this._message}` }
}

export class TimeLimitExceeded implements JudgeResult {
    public get status() { return JUDGE_STATUS.TLE }
    public get point() { return 0 }
    public get message() { return this.status.description }
}

export class MemoryLimitExceeded implements JudgeResult {
    public get status() { return JUDGE_STATUS.MLE }
    public get point() { return 0 }
    public get message() { return this.status.description }
}

export class RuntimeError implements JudgeResult {
    public constructor(code: number) { this._code = code }
    public get status() { return JUDGE_STATUS.RE }
    public get point() { return 0 }
    private readonly _code: number
    get message() { return `${this.status.description}: Exit code ${this._code}` }
}

export class CompileError implements JudgeResult {
    public constructor(message: string) { this._message = message }
    public get status() { return JUDGE_STATUS.CE }
    public get point() { return 0 }
    private readonly _message: string
    public get message() { return `${this.status.description}: ${this._message}` }
}

export class UnknownError implements JudgeResult {
    public get status() { return JUDGE_STATUS.UKE }
    public get point() { return 0 }
    public get message() { return this.status.description }
}

export class PartiallyCorrect implements JudgeResult {
    public constructor(point: number) { this.point = point }
    public get status() { return JUDGE_STATUS.PC }
    public readonly point: number
    public get message() { return `${this.status.description}` }
}

export async function result(id: number, testcaseId: number, { status, point, message }: JudgeResult) {
    return post(`http://localhost:${SERVER_PORT}/_internal/judge_result`, { body: { id, testcaseId, status, point, message, token } })
}
