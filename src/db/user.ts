import db from './client'
const users = db.get('user')

export interface IUser {
    username: string
    passwordHash: string
    token: string[]
}

export async function read(username: string): Promise<IUser> {
    return users.findOne({ username })
}

export async function create(username: string, passwordHash: string) {
    return users.insert({
        username,
        passwordHash,
        token: [],
    })
}

export async function update(username: string, data: { [field: string]: any }) {
    return users.update({ username }, { $set: data })
}
