import { remove as removeToken } from '../db/token'
export default async function (token: string) {
    await removeToken(token)
}
