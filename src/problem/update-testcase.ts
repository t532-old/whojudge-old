import { update as updateTestcase, ITestcase } from '../db/testcase'
import { identify } from '../db/token'
import { read as readUser } from '../db/user'
import { PermissionDeniedError } from '../util/error'
import { read as readProblem } from '../db/problem'

export default async function (token: string, id: number, testcaseId: number, testcase: Partial<ITestcase>) {
    const username = await identify(token)
    const { createdProblem, privileged } = await readUser(username)
    if (privileged || createdProblem.includes(id)) {
        const { testcase: testcaseRef } = await readProblem(id)
        if (testcaseRef.includes(testcaseId))
            await updateTestcase(testcaseId, testcase)
        else throw new PermissionDeniedError(`no permission to edit problem ${id}`)
    } else throw new PermissionDeniedError(`no permission to edit problem ${id}`)
}
