import { remove } from '../db/token'
export default async function removeToken(token: string) {
    await remove(token)
}
