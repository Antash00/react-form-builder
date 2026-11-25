import { useState } from 'react'

export function useFormOutput() {
    const [output, setOutput] = useState<{
        values?: string
        result?: string
        errors?: string
    } | null>(null)
    return {
        output,
        clearOutput: () => setOutput(null),
        onSubmit(values: unknown, result: unknown) {
            setOutput({
                values: JSON.stringify(values, null, 2),
                result: JSON.stringify(result, null, 2),
            })
        },
        onInvalid(errors: unknown) {
            setOutput((previous) => ({
                ...previous,
                errors: JSON.stringify(
                    errors,
                    (key, value: unknown) => (key === 'ref' ? undefined : value),
                    2,
                ),
            }))
        },
    }
}

export type FormCallbacks = Pick<ReturnType<typeof useFormOutput>, 'onSubmit' | 'onInvalid'>
