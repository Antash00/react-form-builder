import { rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDirectory = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distDirectory = resolve(packageDirectory, 'dist')

if (dirname(distDirectory) !== packageDirectory) {
    throw new Error('Refusing to clean outside the package directory')
}

rmSync(distDirectory, { recursive: true, force: true })
