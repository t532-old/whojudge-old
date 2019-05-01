import compile from './compile'
import { CompileError, result, JudgeResult } from './result'
import { read as readTestcase } from '../db/testcase'
import { runNormal } from './run'

export default async function ({ id, code, testcase, o2 }: {
    id: number
    code: string
    testcase: number[]
    o2: boolean
}) {
    try { await compile(id, code, o2 ? '-o2' : '') }
    catch (err) {
        for (const idx in testcase)
            await result(id, Number(idx), new CompileError(err.message))
    }
    for (const idx in testcase) {
        const tc = await readTestcase(testcase[idx])
        let judgement: JudgeResult
        if (tc.spj) {}//judgement = await runSpj(id, tc)
        else judgement = await runNormal(id, tc)
        await result(id, Number(idx), judgement)
    }
}
