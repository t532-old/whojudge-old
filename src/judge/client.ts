import { INTERNAL_JUDGE_SERVER_PORT } from '../config.json'
import { post } from 'httpie'
import token from './token'

export default async function ({ submissionId, code, testcase, o2, lang }: {
    submissionId: number
    code: string
    testcase: number[]
    o2: boolean
    lang: string
}) {
    return post(`http://localhost:${INTERNAL_JUDGE_SERVER_PORT}`, { body: { token, submissionId, code, testcase, o2, lang } })
}
