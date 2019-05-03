import { remove as removeTestcase, read as readTestcase } from '../db/testcase'
import { removeTestcaseRef } from '../db/problem'
import { identify } from '../db/token'
import { read as readUser } from '../db/user'
import { PermissionDeniedError } from '../util/error'

export default async function (token: string, problemId: number, testcaseId: number) {
    const username = await identify(token)
    const { createdProblem, privileged } = await readUser(username)
    if (privileged || createdProblem.includes(problemId)) {
        await removeTestcaseRef(problemId, testcaseId, (await readTestcase(testcaseId)).point)
        await removeTestcase(testcaseId)
    } else throw new PermissionDeniedError(`no permission to edit problem ${problemId}`)
}
