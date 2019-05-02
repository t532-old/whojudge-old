import { addResult } from '../db/submission'
import judgeToken from '../judge/token'
import { InternalCallOnlyError } from '../util/error'
import { JudgeResult, PerformanceResult } from '../judge/result'

export default async function (internalToken: string, id: number, result: JudgeResult & PerformanceResult & { order: number }) {
    if (internalToken === judgeToken) {
        addResult(id, result)
    } else throw new InternalCallOnlyError()
}
