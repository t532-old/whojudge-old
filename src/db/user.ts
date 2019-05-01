import db from './client'
import { next as nextId } from './id'
import { UsernameExistsError, UsernameNotExistError } from '../util/error'
const users = db.get<IUser>('user')

export interface IUser {
    username: string
    displayUsername: string
    passwordHash: string
    token: string[]
    acceptedProblem: number[]
    attemptedProblem: number[]
    createdProblem: number[]
    attendedContest: number[]
    createdContest: number[]
    privileged: boolean
    id: number
}

export async function read(username: string) {
    const user = users.findOne({ username })
    if (user) return user
    else throw new UsernameNotExistError(username)
}

export async function create(displayUsername: string, passwordHash: string) {
    const username = displayUsername.toLowerCase()
    if (!read(username)) {
        return users.insert({
            username,
            displayUsername,
            passwordHash,
            token: [],
            acceptedProblem: [],
            attemptedProblem: [],
            createdProblem: [],
            attendedContest: [],
            createdContest: [],
            privileged: false,
            id: await nextId('user'),
        })
    } else throw new UsernameExistsError(username)
}

export async function remove(username: string) {
    const { deletedCount } = await users.remove({ username })
    if (!deletedCount) throw new UsernameNotExistError(username)
}

export async function update(username: string, data: { [field: string]: any }) {
    const { n } = await users.update({ username }, { $set: data })
    if (!n) throw new UsernameNotExistError(username)
}
