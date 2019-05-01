import nanoid from 'nanoid'
import { compare } from 'bcrypt'
import { read as readUser } from '../db/user'
import { create as createToken } from '../db/token'
import removeToken from './remove-token'
import { PasswordIncorrectError } from '../util/error'
import { TOKEN_TIMEOUT } from '../config.json'

export default async function (username: string, password: string, longTerm: boolean = false) {
    username = username.toLowerCase()
    const { passwordHash } = await readUser(username)
    if (compare(password, passwordHash)) {
        const token = nanoid()
        await createToken(username, token)
        if (!longTerm)
            setTimeout(() => removeToken(token), TOKEN_TIMEOUT)
        return token
    } else throw new PasswordIncorrectError()
}
