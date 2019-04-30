import Server from 'koa'
import routes from './routes'
import { SERVER_PORT } from './config.json'

const app = new Server()
routes.forEach(router =>
    app.use(router.routes())
       .use(router.allowedMethods())
)
app.listen(SERVER_PORT)
