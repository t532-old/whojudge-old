import { ITestcase } from '../db/testcase'
import { spawn } from 'child_process'
import { writeFile as writeFileCallback, createReadStream } from 'fs'
import { promisify } from 'util'
import { CACHE_PATH, SHELL } from '../config.json'
import { TimeLimitExceeded, RuntimeError, MemoryLimitExceeded, Accepted, WrongAnswer, JudgeResult } from './result'
import getMemory from './get-memory'
import { resolve as resolvePath } from 'path'
const writeFile = promisify(writeFileCallback)

export function runNormal(id: number, testcase: ITestcase) {
    return new Promise<JudgeResult>(async resolve => {
        const path = resolvePath(`${CACHE_PATH}/judge/${id}`)
        await writeFile(`${path}.in`, testcase.input)
        const infile = createReadStream(`${path}.in`)
        infile.on('open', async fd => {
            const proc = spawn(`${path}`, { stdio: [fd, 'pipe', 'pipe'] })
            let output = ''
            proc.stdout.on('data', data => output += data)
            let ended = false
            const timeout = setTimeout(() => {
                proc.kill('SIGKILL')
                ended = true
                resolve(new TimeLimitExceeded())
            }, testcase.time)
            proc.on('exit', code => {
                ended = true
                clearTimeout(timeout)
                if (code)
                    resolve(new RuntimeError(code))
                else {
                    const actual = output
                        .trimEnd()
                        .replace(/\r\n/g, `\n`)
                        .split(`\n`)
                        .map(i => i.trimEnd())
                        .join(`\n`)
                    const expected = testcase.output
                        .trimEnd()
                        .replace(/\r\n/g, `\n`)
                        .split(`\n`)
                        .map(i => i.trimEnd())
                        .join(`\n`)
                    if (actual === expected) resolve(new Accepted(testcase.point))
                    else {
                        let i = 0
                        while (actual[i] === expected[i]) i++
                        resolve(new WrongAnswer(`Different character on position ${i}; expected ${expected[i]} but received ${actual[i]}`))
                    }
                }
            })
            while (!ended) {
                const mem = await getMemory(proc.pid)
                if (mem > testcase.memory) {
                    proc.kill('SIGKILL')
                    ended = true
                    clearTimeout(timeout)
                    resolve(new MemoryLimitExceeded())
                }
            }
        })
    })
}
