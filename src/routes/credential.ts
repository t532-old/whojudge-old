/// <reference types="koa-body" />
import Router from 'koa-router'
import { proceed } from '../util/http'
const router = new Router({ prefix: '/credential' })

import createUser from '../credential/create-user'
router.post('/create_user', proceed(
    async function (ctx) {
        const { username, password }: {
            username: string
            password: string
        } = ctx.request.body
        await createUser(username, password)
    }
))

import createToken from '../credential/create-token'
router.post('/create_token', proceed(
    async function (ctx) {
        const { username, password, longTerm }: {
            username: string
            password: string
            longTerm: boolean
        } = ctx.request.body
        const token = await createToken(username, password, longTerm) 
        return { token }
    }
))

import removeToken from '../credential/remove-token'
router.post('/remove_token', proceed(
    async function (ctx) {
        const { token }: { token: string } = ctx.request.body
        await removeToken(token)
    }
))

import updatePassword from '../credential/update-password'
router.post('/update_password', proceed(
    async function (ctx) {
        const { username, oldPassword, newPassword }: {
            username: string
            oldPassword: string
            newPassword: string
        } = ctx.request.body
        await updatePassword(username, oldPassword, newPassword)
    }
))

export default router
