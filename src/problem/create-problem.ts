import { IProblemContent, create as createProblem, updateContent } from '../db/problem'
import { identify } from '../db/token'
import { update as updateUser } from '../db/user'

export default async function (token: string, content: IProblemContent) {
    const username = await identify(token)
    const { id } = await createProblem()
    await Promise.all([
        updateContent(id, content),
        updateUser(username, { createdProblem: { $push: id } }),
    ])
    return id
}
