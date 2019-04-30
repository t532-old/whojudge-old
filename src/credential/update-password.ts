import { compare, hash } from 'bcrypt'
import { read, update } from '../db/user'
import { PasswordIncorrectError } from '../util/error'

export default async function updatePassword(username: string, oldPassword: string, newPassword: string) {
    const user = await read(username)
    if (compare(oldPassword, user.passwordHash)) {
        const passwordHash = await hash(newPassword, 1)
        await Promise.all([
            update(username, { passwordHash }),
            update(username, { token: [] })
        ])
    } else throw new PasswordIncorrectError('password incorrect')
}
