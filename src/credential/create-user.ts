import { hash } from 'bcrypt'
import { create, read } from '../db/user'
import { UsernameExistsError, UsernameIllegalError } from '../util/error'

const illegalCharacters = /[^a-zA-Z0-9_]/
export default async function createUser(username: string, password: string) {
    if (username.length < 4 || username.length > 20)
        throw new UsernameIllegalError(`username ${username} does not have a length between 4 and 20`)
    if (illegalCharacters.test(username))
        throw new UsernameIllegalError(`username "${username} contains illegal character`)
    if (await read(username))
        throw new UsernameExistsError(`username "${username}" already exists`)
    const passwordHash = await hash(password, 1)
    await create(username, passwordHash)
}
