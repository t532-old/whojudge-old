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

export async function read(id: number) {
    const testcase = cases.findOne({ id })
    if (testcase) return testcase
    else throw new TestcaseNotExistError(id)
}

export async function create({ input = '', output = '', time = 1000, memory = 128, spj = false, point = 10 }: Partial<ITestcase>) {
    return cases.insert({ input, output, time, memory, spj, point, id: await nextId('testcase') })
}

export async function remove(id: number) {
    const { deletedCount } = await cases.remove({ id })
    if (!deletedCount) throw new TestcaseNotExistError(id)
}

export async function update(id: number, data: { [field: string]: any }) {
    const { n } = await cases.update({ id }, { $set: data })
    if (!n) throw new TestcaseNotExistError(id)
}
