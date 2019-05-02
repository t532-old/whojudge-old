import db from './client'
const ids = db.get<ICounter>('id')
const fields = ['testcase', 'problem', 'user', 'submission']

export interface ICounter {
    name: string
    count: number
}

export async function init() {
    const promises = []
    fields.forEach(async name => {
        if (!(await ids.findOne({ name })))
            promises.push(ids.insert({ name, count: 0 }))
    })
    return Promise.all(promises)
}

export async function next(name: string) {
    const { count } = await ids.findOneAndUpdate({ name }, { $inc: { count: 1 } })
    return count
}
