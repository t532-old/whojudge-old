import Server from 'koa'
import body from 'koa-body'
import routes from './routes'
import { SERVER_PORT, INTERNAL_JUDGE_SERVER_PORT } from './config.json'
import { init } from './db/id'
import { fork, isMaster } from 'cluster'
import { cpus } from 'os'
import judgeServer from './judge/server'

const app = new Server()
app.use(body())

if (isMaster) {
    for (const _ of cpus()) fork()
    init()
    routes.forEach(router =>
        app.use(router.routes())
        .use(router.allowedMethods())
    )
    app.listen(SERVER_PORT)
} else {
    app.use(judgeServer)
    app.listen(INTERNAL_JUDGE_SERVER_PORT)
}
