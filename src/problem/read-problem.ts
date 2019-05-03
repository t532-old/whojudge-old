import { read as readProblem } from '../db/problem'

export default async function (problemId: number) {
    return readProblem(problemId)
}
