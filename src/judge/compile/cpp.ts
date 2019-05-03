import { writeFile as writeFileCallback } from 'fs'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'
import { CACHE_PATH, COMPILER } from '../../config.json'
import { resolve } from 'path'
const writeFile = promisify(writeFileCallback),
      exec = promisify(execCallback)

export default async function (submissionId: number, code: string, extraArgs: string = '') {
    const path = resolve(`${CACHE_PATH}/judge/${submissionId}`)
    await writeFile(`${path}.cpp`, code)
    await exec(`${COMPILER.cpp} ${extraArgs} ${path}.cpp -o ${path}`)
}
