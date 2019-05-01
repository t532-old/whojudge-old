import db from './client'
import { next as nextId } from './id'
import { ProblemNotExistError } from '../util/error'
const problems = db.get<IProblem>('problem')

export interface IProblem {
    content: IProblemContent
    testcase: number[]
    id: number
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

export async function read(id: number) {
    const problem = problems.findOne({ id })
    if (problem) return problem
    else throw new ProblemNotExistError(id)
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
        id: await nextId('problem'),
    })
}

export async function remove(id: number) {
    const { deletedCount } = await problems.remove({ id })
    if (!deletedCount) throw new ProblemNotExistError(id)
}

export async function updateContent(id: number, content: IProblemContent) {
    const { n } = await problems.update({ id }, { $set: { content } })
    if (!n) throw new ProblemNotExistError(id)
}

export async function addTestcaseRef(id: number, testcase: number) {
    const { nModified } = await problems.update({ id }, { $push: { testcase } })
    if (!nModified) throw new ProblemNotExistError(id)
}

export async function removeTestcaseRef(id: number, testcase: number) {
    const { nModified } = await problems.update({ id }, { $pull: { testcase } })
    if (!nModified) throw new ProblemNotExistError(id)
}
