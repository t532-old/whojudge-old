import { remove as removeTestcase } from '../db/testcase'
import { removeTestcaseRef } from '../db/problem'
import { identify } from '../db/token'
import { read as readUser } from '../db/user'
import { PermissionDeniedError } from '../util/error'

export default async function (token: string, id: number, testcaseId: number) {
    const username = await identify(token)
    const { createdProblem, privileged } = await readUser(username)
    if (privileged || createdProblem.includes(id)) {
        await removeTestcaseRef(id, testcaseId)
        await removeTestcase(testcaseId)
    } else throw new PermissionDeniedError(`no permission to edit problem ${id}`)
}
