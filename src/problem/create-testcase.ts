import { ITestcase, create as createTestcase, remove as removeTestcase } from '../db/testcase'
import { addTestcaseRef } from '../db/problem'
import { identify } from '../db/token'
import { read as readUser } from '../db/user'
import { PermissionDeniedError } from '../util/error';

export default async function (token: string, problemId: number, testcase: Partial<ITestcase>) {
    const username = await identify(token)
    const { createdProblem, privileged } = await readUser(username)
    if (privileged || createdProblem.includes(problemId)) {
        const { id: testcaseId } = await createTestcase(testcase)
        try { await addTestcaseRef(problemId, testcaseId, testcase.point) }
        catch (err) {
            await removeTestcase(testcaseId)
            throw err
        }
    } else throw new PermissionDeniedError(`no permission to edit problem ${problemId}`)
}
