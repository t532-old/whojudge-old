/// <reference types="koa-body" />
import Router from 'koa-router'
import { proceed } from '../util/http'
const router = new Router({ prefix: '/submission' })

import createSubmission from '../submission/create-submission'
router.post('/create_submission', proceed(
    async function (ctx) {
        const { token, problemId, code, o2, lang }: {
            token: string
            problemId: number
            code: string
            o2: boolean
            lang: string
        } = ctx.request.body
        return createSubmission(token, problemId, { code, o2, lang })
    }
))

import readSubmission from '../submission/read-submission'
router.post('/read_submission', proceed(
    async function (ctx) {
        const { token, submissionId }: {
            token: string
            submissionId: number
        } = ctx.request.body
        return readSubmission(token, submissionId)
    }
))

import updateSubmission from '../submission/update-submission'
router.post('/_update_submission', proceed(
    async function (ctx) {
        const result = ctx.request.body
        return updateSubmission(result.token, result.submissionId, result)
    }
))

export default router
