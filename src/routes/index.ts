import Router from 'koa-router'
import credentialRouter from './credential'
import problemRouter from './problem'
import submissionRouter from './submission'

const routes = [
    credentialRouter, 
    problemRouter,
    submissionRouter,
]

export default routes
