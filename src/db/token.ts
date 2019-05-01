import db from './client'
import { read, IUser } from './user'
import { UsernameNotExistError, TokenNotExistError } from '../util/error'
const users = db.get<IUser>('user')

export async function create(username: string, token: string) {
    if (!await read(username))
        throw new UsernameNotExistError(`username "${username}" does not exist`)
    return users.update({ username }, { $addToSet: { token } })
}

export async function remove(token: string) {
    return users.update({}, { $pull: { token } })
}

export async function identify(token: string) {
    const user = await users.findOne({ token: { $all: [token] } })
    if (user) return user.username
    else throw new TokenNotExistError()
}
