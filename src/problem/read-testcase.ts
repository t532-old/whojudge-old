import { read as readTestcase } from '../db/testcase'
import { identify } from '../db/token'
import { read as readUser } from '../db/user'
import { PermissionDeniedError } from '../util/error'
import { read as readProblem } from '../db/problem'

export default async function (token: string, problemId: number, testcaseId: number) {
    const username = await identify(token)
    const { createdProblem, privileged } = await readUser(username)
    if (privileged || createdProblem.includes(problemId)) {
        const { testcase: testcaseRef } = await readProblem(problemId)
        if (testcaseRef.includes(testcaseId))
            return await readTestcase(testcaseId)
        else throw new PermissionDeniedError(`no permission to view problem ${problemId}'s testcase`)
    } else throw new PermissionDeniedError(`no permission to view problem ${problemId}'s testcase`)
}
