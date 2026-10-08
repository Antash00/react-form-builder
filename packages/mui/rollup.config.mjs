import typescript from '@rollup/plugin-typescript'

const external = (id) =>
    id === 'react'
    || id.startsWith('react/')
    || id === 'react-dom'
    || id === 'react-hook-form'
    || id.startsWith('@mui/')
    || id.startsWith('@emotion/')

export default {
    input: 'src/index.ts',
    external,
    output: [
        {
            file: 'dist/index.js',
            format: 'esm',
            sourcemap: true,
        },
        {
            file: 'dist/index.cjs',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.build.json',
        }),
    ],
}