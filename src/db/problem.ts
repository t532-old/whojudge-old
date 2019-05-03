import db from './client'
import { next as nextId } from './id'
import { ProblemNotExistError } from '../util/error'
const problems = db.get<IProblem>('problem')

export interface IProblem {
    content: IProblemContent
    testcase: number[]
    id: number
    point: number
}

export interface IProblemContent {
    background: string
    description: string
    input: string
    output: string
    tips: string
    example: IResultPair[]
}

export interface IResultPair {
    input: string
    output: string
}

export async function read(problemId: number) {
    const problem = problems.findOne({ id: problemId })
    if (problem) return problem
    else throw new ProblemNotExistError(problemId)
}

export async function create() {
    return problems.insert({
        content: {
            background: '',
            description: '',
            input: '',
            output: '',
            tips: '',
            example: [],
        },
        testcase: [],
        point: 0,
        id: await nextId('problem'),
    })
}

export async function remove(problemId: number) {
    const { deletedCount } = await problems.remove({ id: problemId })
    if (!deletedCount) throw new ProblemNotExistError(problemId)
}

export async function updateContent(problemId: number, content: IProblemContent) {
    const { n } = await problems.update({ id: problemId }, { $set: { content } })
    if (!n) throw new ProblemNotExistError(problemId)
}

export async function addTestcaseRef(problemId: number, testcaseId: number, point: number) {
    const { n } = await problems.update({ id: problemId }, {
        $push: { testcase: testcaseId },
        $inc: { point },
    })
    if (!n) throw new ProblemNotExistError(problemId)
}

export async function removeTestcaseRef(problemId: number, testcaseId: number, point: number) {
    const { n } = await problems.update({ id: problemId }, {
        $pull: { testcase: testcaseId },
        $inc: { point: -point },
    })
    if (!n) throw new ProblemNotExistError(problemId)
}
