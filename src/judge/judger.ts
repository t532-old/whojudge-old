import compilers from './compile'
import { CompileError, result, JudgeResult, PerformanceResult } from './result'
import { read as readTestcase } from '../db/testcase'
import runNormal from './workflow/normal'

export default async function ({ submissionId, code, testcase, o2, lang }: {
    submissionId: number
    code: string
    testcase: number[]
    o2: boolean
    lang: string
}) {
    try { await compilers[lang](submissionId, code, o2 ? '-o2' : '') }
    catch (err) {
        for (const idx in testcase)
            await result(submissionId, Number(idx), new CompileError(err.message))
    }
    for (const idx in testcase) {
        const tc = await readTestcase(testcase[idx])
        let judgement: JudgeResult & PerformanceResult
        if (tc.spj) {}//judgement = await runSpj(id, tc)
        else judgement = await runNormal(submissionId, tc)
        await result(submissionId, Number(idx), judgement)
    }
}
