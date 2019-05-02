import { read as readProblem } from '../db/problem'

export default async function (id: number) {
    return readProblem(id)
}
