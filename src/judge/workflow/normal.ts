import { ITestcase } from '../../db/testcase'
import { spawn } from 'child_process'
import { writeFile as writeFileCallback, createReadStream } from 'fs'
import { promisify } from 'util'
import { CACHE_PATH } from '../../config.json'
import { TimeLimitExceeded, RuntimeError, MemoryLimitExceeded, Accepted, WrongAnswer, JudgeResult, PerformanceResult } from '../result'
import getMemory from '../get-memory'
import { resolve as resolvePath } from 'path'
const writeFile = promisify(writeFileCallback)

export default function (submissionId: number, testcase: ITestcase) {
    return new Promise<JudgeResult & PerformanceResult>(async resolve => {
        const path = resolvePath(`${CACHE_PATH}/judge/${submissionId}`)
        await writeFile(`${path}.in`, testcase.input)
        const infile = createReadStream(`${path}.in`)
        infile.on('open', async fd => {
            const proc = spawn(`${path}`, { stdio: [fd, 'pipe', 'pipe'] })
            const startTime = Date.now()
            let peakMem = 0
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
                    if (actual === expected) resolve(new Accepted(Date.now() - startTime, peakMem, testcase.point))
                    else {
                        let i = 0
                        while (actual[i] === expected[i]) i++
                        resolve(new WrongAnswer(Date.now() - startTime, peakMem, `Different character on position ${i}; expected ${expected[i]} but received ${actual[i]}`))
                    }
                }
            })
            while (!ended) {
                peakMem = Math.max(peakMem, await getMemory(proc.pid))
                if (peakMem > testcase.memory) {
                    proc.kill('SIGKILL')
                    ended = true
                    clearTimeout(timeout)
                    resolve(new MemoryLimitExceeded())
                }
            }
        })
    })
}
