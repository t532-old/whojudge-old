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

export class PerformanceResult {
    constructor(time: number = NaN, memory: number = NaN) {
        this.time = time
        this.memory = memory
    }
    public readonly time: number
    public readonly memory: number
}

export class Accepted extends PerformanceResult implements JudgeResult {
    public constructor(time: number, memory: number, point: number) {
        super(time, memory)
        this.point = point
    }
    public get status() { return JUDGE_STATUS.AC }
    public readonly point: number
    public get message() { return `${this.status.description}: ${this.point}/${this.point}` }
}

export class WrongAnswer extends PerformanceResult implements JudgeResult {
    public constructor(time: number, memory: number, message: string) {
        super(time, memory)
        this._message = message
    }
    public get status() { return JUDGE_STATUS.WA }
    public get point() { return 0 }
    private readonly _message: string
    public get message() { return `${this.status.description}: ${this._message}` }
}

export class TimeLimitExceeded extends PerformanceResult implements JudgeResult {
    public get status() { return JUDGE_STATUS.TLE }
    public get point() { return 0 }
    public get message() { return this.status.description }
}

export class MemoryLimitExceeded extends PerformanceResult implements JudgeResult {
    public get status() { return JUDGE_STATUS.MLE }
    public get point() { return 0 }
    public get message() { return this.status.description }
}

export class RuntimeError extends PerformanceResult implements JudgeResult {
    public constructor(code: number) {
        super(NaN, NaN)
        this._code = code
    }
    public get status() { return JUDGE_STATUS.RE }
    public get point() { return 0 }
    private readonly _code: number
    get message() { return `${this.status.description}: Exit code ${this._code}` }
}

export class CompileError extends PerformanceResult implements JudgeResult {
    public constructor(message: string) {
        super(NaN, NaN)
        this._message = message
    }
    public get status() { return JUDGE_STATUS.CE }
    public get point() { return 0 }
    private readonly _message: string
    public get message() { return `${this.status.description}: ${this._message}` }
}

export class UnknownError extends PerformanceResult implements JudgeResult {
    public get status() { return JUDGE_STATUS.UKE }
    public get point() { return 0 }
    public get message() { return this.status.description }
}

export class PartiallyCorrect extends PerformanceResult implements JudgeResult {
    public constructor(time: number, memory: number, point: number) {
        super(time, memory)
        this.point = point
    }
    public get status() { return JUDGE_STATUS.PC }
    public readonly point: number
    public get message() { return this.status.description }
}

export async function result(submissionId: number, order: number, { time, memory, status, point, message }: JudgeResult & PerformanceResult) {
    return post(`http://localhost:${SERVER_PORT}/submission/_update_submission`, { body: { submissionId, order, status, point, message, token, time, memory } })
}
