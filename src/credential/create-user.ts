import { hash } from 'bcrypt'
import { create as createUser, read as readUser } from '../db/user'
import { UsernameExistsError, UsernameIllegalError } from '../util/error'

const illegalCharacters = /[^a-z0-9_]/
export default async function (username: string, password: string) {
    const displayUsername = username
    username = username.toLowerCase()
    if (username.length < 4 || username.length > 20)
        throw new UsernameIllegalError(`username "${username}" does not have a length between 4 and 20`)
    if (illegalCharacters.test(username))
        throw new UsernameIllegalError(`username "${username}" contains illegal character`)
    if (await readUser(username))
        throw new UsernameExistsError(`username "${username}" already exists`)
    const passwordHash = await hash(password, 1)
    await createUser(displayUsername, passwordHash)
}
