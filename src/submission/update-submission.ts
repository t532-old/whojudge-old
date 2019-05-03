import { addResult } from '../db/submission'
import judgeToken from '../judge/token'
import { InternalCallOnlyError } from '../util/error'
import { JudgeResult, PerformanceResult } from '../judge/result'

export default async function (internalToken: string, submissionId: number, result: JudgeResult & PerformanceResult & { order: number }) {
    if (internalToken === judgeToken) {
        addResult(submissionId, result)
    } else throw new InternalCallOnlyError()
}
