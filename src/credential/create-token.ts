import nanoid from 'nanoid'
import { compare } from 'bcrypt'
import { read } from '../db/user'
import { create } from '../db/token'
import removeToken from './remove-token'
import { PasswordIncorrectError } from '../util/error'
import { TOKEN_TIMEOUT } from '../config.json'

export default async function createToken(username: string, password: string, longTerm: boolean = false) {
    const { passwordHash } = await read(username)
    if (compare(password, passwordHash)) {
        const token = nanoid()
        await create(username, token)
        if (!longTerm)
            setTimeout(() => removeToken(token), TOKEN_TIMEOUT)
        return token
    } else throw new PasswordIncorrectError('incorrect password')
}
