import { identify } from '../db/token'
import readContent from '../problem/read-problem'
import judge from '../judge/client'
import { create as createSubmission } from '../db/submission'

export default async function (token: string, problemId: number, { code, o2, lang }: {
    code: string
    o2: boolean
    lang: string
}) {
    const username = await identify(token)
    const { id: submissionId } = await createSubmission({ user: username, problem: problemId, code, o2, lang })
    const { testcase } = await readContent(problemId)
    await judge({ code, o2, lang, testcase, submissionId })
    return submissionId
}
