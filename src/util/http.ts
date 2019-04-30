import { ParameterizedContext } from 'koa'
import Router from 'koa-router'

export function failure(error: Error) {
    return {
        succeeded: false,
        data: {
            error: error.constructor.name,
            message: error.message,
        }
    }
}

export function success(data: any = null) {
    return {
        succeeded: true,
        data,
    }
}

type Context = ParameterizedContext<any, Router.IRouterParamContext>
export function proceed(fn: (ctx: Context) => any) {
    return async function (ctx: Context) {
        try {
            const result = await fn(ctx)
            ctx.status = 200
            ctx.body = success(result)
        } catch (err) {
            ctx.status = 403
            ctx.body = failure(err)
        }
    }
}
