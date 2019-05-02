import db from './client'
import { next as nextId } from './id'
import { JudgeResult, PerformanceResult } from '../judge/result'
import { SubmissionNotExistError } from '../util/error'
import { read as readProblem } from './problem'
const submissions = db.get<ISubmission>('testcase')

export interface ISubmission {
    problem: number
    accepted: boolean
    point: number
    finished: boolean
    lang: string
    o2: boolean
    code: string
    user: string
    result: (JudgeResult & PerformanceResult & { order: number })[]
    id: number
    _cache: {
        testcaseCount: number
        fullPoint: number
    }
}

export async function read(id: number) {
    const submission = submissions.findOne({ id })
    if (submission) return submission
    else throw new SubmissionNotExistError(id)
}

export async function create({ user, problem, code, o2, lang }: Pick<ISubmission, 'user' | 'problem' | 'code' | 'lang' | 'o2'>) {
    const { testcase, point } = await readProblem(problem)
    return submissions.insert({
        user, problem, code, o2, lang,
        accepted: false,
        point: 0,
        finished: false,
        result: [],
        _cache: {
            testcaseCount: testcase.length,
            fullPoint: point,
        },
        id: await nextId('submission'),
    })
}

export async function remove(id: number) {
    const { deletedCount } = await submissions.remove({ id })
    if (!deletedCount) throw new SubmissionNotExistError(id)
}

export async function update(id: number, data: { [field: string]: any }) {
    const { n } = await submissions.update({ id }, { $set: data })
    if (!n) throw new SubmissionNotExistError(id)
}

export async function addResult(id: number, result: JudgeResult & PerformanceResult) {
    const oldSubmission = await read(id)
    let accepted = false, finished = false
    if (oldSubmission.result.length === oldSubmission._cache.testcaseCount - 1)
        finished = true
    if (oldSubmission.point === oldSubmission._cache.fullPoint - result.point)
        accepted = true
    const { n } = await submissions.update({ id }, {
        $push: { result },
        $inc: { point: result.point },
        $set: { finished, accepted },
    })
    if (!n) throw new SubmissionNotExistError(id)
}
