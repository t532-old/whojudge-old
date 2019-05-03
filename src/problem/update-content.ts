import { IProblemContent, updateContent } from '../db/problem'
import { identify } from '../db/token'
import { read as readUser } from '../db/user'
import { PermissionDeniedError } from '../util/error'

export default async function (token: string, problemId: number, content: IProblemContent) {
    const username = await identify(token)
    const { createdProblem, privileged } = await readUser(username)
    if (privileged || createdProblem.includes(problemId))
        await updateContent(problemId, content)
    else throw new PermissionDeniedError(`no permission to edit problem ${problemId}`)
}
