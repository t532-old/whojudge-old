import cpp from './cpp'

export interface TCompiler { (id: number, code: string, extraArgs: string): Promise<void> }

const compilers: { [lang: string]: TCompiler } = {
    cpp,
}

export default compilers
