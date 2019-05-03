import judgeToken from './token'
import { proceed } from '../util/http'
import { InternalCallOnlyError } from '../util/error'
import judge from './judger'

export default proceed(
    async function (ctx) {
        const data: {
            token: string
            submissionId: number
            code: string
            testcase: number[]
            o2: boolean
            lang: string
        } = ctx.request.body
        if (data.token !== judgeToken) throw new InternalCallOnlyError()
        judge(data)
    }
)