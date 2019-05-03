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

export async function read(submissionId: number) {
    const submission = submissions.findOne({ id: submissionId })
    if (submission) return submission
    else throw new SubmissionNotExistError(submissionId)
}

export async function create({ problem: problemId, user, code, o2, lang }: Pick<ISubmission, 'user' | 'problem' | 'code' | 'lang' | 'o2'>) {
    const { testcase, point } = await readProblem(problemId)
    return submissions.insert({
        user, code, o2, lang,
        problem: problemId,
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

export async function remove(submissionId: number) {
    const { deletedCount } = await submissions.remove({ id: submissionId })
    if (!deletedCount) throw new SubmissionNotExistError(submissionId)
}

export async function update(submissionId: number, data: { [field: string]: any }) {
    const { n } = await submissions.update({ id: submissionId }, { $set: data })
    if (!n) throw new SubmissionNotExistError(submissionId)
}

export async function addResult(submissionId: number, result: JudgeResult & PerformanceResult) {
    const oldSubmission = await read(submissionId)
    let accepted = false, finished = false
    if (oldSubmission.result.length === oldSubmission._cache.testcaseCount - 1)
        finished = true
    if (oldSubmission.point === oldSubmission._cache.fullPoint - result.point)
        accepted = true
    const { n } = await submissions.update({ id: submissionId }, {
        $push: { result },
        $inc: { point: result.point },
        $set: { finished, accepted },
    })
    if (!n) throw new SubmissionNotExistError(submissionId)
}
