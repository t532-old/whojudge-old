import { identify } from '../db/token'
import readContent from '../problem/read-problem'
import judge from '../judge/client'
import { create as createSubmission } from '../db/submission'

export default async function (token: string, id: number, { code, o2, lang }: {
    code: string
    o2: boolean
    lang: string
}) {
    const username = await identify(token)
    const { id: submissionId } = await createSubmission({ user: username, problem: id, code, o2, lang })
    const { testcase } = await readContent(id)
    await judge({
        code, o2, lang, testcase,
        id: submissionId,
    })
}
