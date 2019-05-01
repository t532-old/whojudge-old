import Router from 'koa-router'
import credentialRouter from './credential'
import problemRouter from './problem'

const routes = [
    credentialRouter, 
    problemRouter,
]

export default routes
