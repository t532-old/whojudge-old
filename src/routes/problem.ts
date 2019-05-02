/// <reference types="koa-body" />
import Router from 'koa-router'
import { proceed } from '../util/http'
const router = new Router()

import { IProblemContent } from '../db/problem'
import createProblem from '../problem/create-problem'
router.post('/problem/create_problem', proceed(
    async function (ctx) {
        const { token, content }: {
            token: string
            content: IProblemContent
        } = ctx.request.body
        await createProblem(token, content)
    }
))

import updateContent from '../problem/update-content'
router.post('/problem/update_content', proceed(
    async function (ctx) {
        const { token, problemId, content }: {
            token: string
            problemId: number
            content: IProblemContent
        } = ctx.request.body
        await updateContent(token, problemId, content)
    }
))

import readContent from '../problem/read-problem'
router.post('/problem/read_problem', proceed(
    async function (ctx) {
        const { problemId }: { problemId: number } = ctx.request.body
        return readContent(problemId)
    }
))

import { ITestcase } from '../db/testcase'
import createTestcase from '../problem/create-testcase'
router.post('/problem/create_testcase', proceed(
    async function (ctx) {
        const { token, problemId, testcase }: {
            token: string
            problemId: number
            testcase: ITestcase
        } = ctx.request.body
        await createTestcase(token, problemId, testcase)
    }
))

import removeTestcase from '../problem/remove-testcase'
router.post('/problem/remove_testcase', proceed(
    async function (ctx) {
        const { token, problemId, testcaseId }: {
            token: string
            problemId: number
            testcaseId: number
        } = ctx.request.body
        await removeTestcase(token, problemId, testcaseId)
    }
))

import updateTestcase from '../problem/update-testcase'
router.post('/problem/update_testcase', proceed(
    async function (ctx) {
        const { token, problemId, testcaseId, testcase }: {
            token: string
            problemId: number
            testcaseId: number
            testcase: ITestcase
        } = ctx.request.body
        await updateTestcase(token, problemId, testcaseId, testcase)
    }
))

import readTestcase from '../problem/read-testcase'
router.post('/problem/read_testcase', proceed(
    async function (ctx) {
        const { token, problemId, testcaseId }: {
            token: string
            problemId: number
            testcaseId: number
        } = ctx.request.body
        return readTestcase(token, problemId, testcaseId)
    }
))

export default router
