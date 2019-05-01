import { compare, hash } from 'bcrypt'
import { read as readUser, update as updateUser } from '../db/user'
import { PasswordIncorrectError } from '../util/error'

export default async function (username: string, oldPassword: string, newPassword: string) {
    username = username.toLowerCase()
    const user = await readUser(username)
    if (compare(oldPassword, user.passwordHash)) {
        const passwordHash = await hash(newPassword, 1)
        await Promise.all([
            updateUser(username, { passwordHash }),
            updateUser(username, { token: [] })
        ])
    } else throw new PasswordIncorrectError()
}
