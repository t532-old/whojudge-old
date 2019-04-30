import db from './client'
import { read } from './user'
import { UsernameNotExistError } from '../util/error'
const users = db.get('user')

export async function create(username: string, token: string) {
    if (!await read(username))
        throw new UsernameNotExistError(`username "${username}" does not exist`)
    return users.update({ username }, { $addToSet: { token } })
}

export async function remove(token: string) {
    return users.update({}, { $pull: { token } })
}
