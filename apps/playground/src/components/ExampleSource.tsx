import { CodePanel } from './CodePanel'
import callbacks from '../useFormOutput.ts?raw'
import catalog from '../variables/catalog.ts?raw'

import defaults from '../variables/defaultValues.ts?raw'

const sources = import.meta.glob<string>('../examples/*Form.tsx', {
    eager: true,
    query: '?raw',
    import: 'default',
})

export function ExampleSource({ file }: { file: string }) {
    const source = sources[`../examples/${file}.tsx`]
    const files = [
        { name: file + '.tsx', source },
        { name: 'catalog.ts', source: catalog },
    ]
    if (source.includes("from '../variables/defaultValues'"))
        files.push({ name: 'defaultValues.ts', source: defaults })
    files.push({ name: 'useFormOutput.ts', source: callbacks })
    return <CodePanel files={files} />
}
