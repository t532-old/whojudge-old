import db from './client'
import { IResultPair } from './problem'
import { next as nextId } from './id'
import { TestcaseNotExistError } from '../util/error'
const cases = db.get<ITestcase>('testcase')

export interface ITestcase extends IResultPair {
    time: number
    memory: number
    spj: boolean
    point: number
    id: number
}

export async function read(testcaseId: number) {
    const testcase = cases.findOne({ id: testcaseId })
    if (testcase) return testcase
    else throw new TestcaseNotExistError(testcaseId)
}

export async function create({ input = '', output = '', time = 1000, memory = 128, spj = false, point = 10 }: Partial<ITestcase>) {
    return cases.insert({ input, output, time, memory, spj, point, id: await nextId('testcase') })
}

export async function remove(testcaseId: number) {
    const { deletedCount } = await cases.remove({ id: testcaseId })
    if (!deletedCount) throw new TestcaseNotExistError(testcaseId)
}

export async function update(testcaseId: number, data: { [field: string]: any }) {
    const { n } = await cases.update({ id: testcaseId }, { $set: data })
    if (!n) throw new TestcaseNotExistError(testcaseId)
}
