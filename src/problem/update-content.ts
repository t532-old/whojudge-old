import { IProblemContent, updateContent } from '../db/problem'
import { identify } from '../db/token'
import { read as readUser } from '../db/user'
import { PermissionDeniedError } from '../util/error'

export default async function (token: string, id: number, content: IProblemContent) {
    const username = await identify(token)
    const { createdProblem, privileged } = await readUser(username)
    if (privileged || createdProblem.includes(id))
        await updateContent(id, content)
    else throw new PermissionDeniedError(`no permission to edit problem ${id}`)
}
