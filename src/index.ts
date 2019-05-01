import Server from 'koa'
import body from 'koa-body'
import routes from './routes'
import { SERVER_PORT } from './config.json'
import { init } from './db/id'

const app = new Server()

init()
app.use(body())
routes.forEach(router =>
    app.use(router.routes())
       .use(router.allowedMethods())
)
app.listen(SERVER_PORT)
