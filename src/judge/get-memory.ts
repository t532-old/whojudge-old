import { spawn } from 'child_process'
const proc = spawn('python', ['../../util/get-memory.py'], { cwd: __dirname })

export default function (pid: number) {
    proc.stdin.write(`${pid}\n`)
    return new Promise<number>(resolve =>
        proc.stdout.once('data', mem => resolve(Number(mem))))
}
