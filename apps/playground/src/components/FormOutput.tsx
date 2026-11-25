import { useState } from 'react'
import { CopyButton } from './CopyButton'
import type { useFormOutput } from '../useFormOutput'

export function FormOutput({ output }: Pick<ReturnType<typeof useFormOutput>, 'output'>) {
    const [view, setView] = useState<'values' | 'result'>('values')
    const invalid = output?.errors !== undefined
    const text = invalid ? output.errors : output?.[view]
    const label = invalid
        ? 'Validation errors'
        : view === 'values'
          ? 'Submitted values'
          : 'Field result'
    return (
        <section className="output">
            <div className="output-head">
                <h2>Callback output</h2>
                <code>{output ? (invalid ? 'onInvalid' : 'onSubmit') : 'Idle'}</code>
            </div>
            {output && !invalid && (
                <div className="output-switch">
                    {(['values', 'result'] as const).map((key) => (
                        <button key={key} aria-pressed={view === key} onClick={() => setView(key)}>
                            {key}
                        </button>
                    ))}
                </div>
            )}
            {invalid && output.values && (
                <details>
                    <summary>Last successful submission</summary>
                    <CopyButton text={output.values} label="Copy last submitted values" />
                    <pre aria-label="Last submitted values" tabIndex={0}>
                        {output.values}
                    </pre>
                </details>
            )}
            {text ? (
                <>
                    <div className="output-label">
                        <span role="status">{label}</span>
                        <CopyButton key={text} text={text} label="Copy JSON" />
                    </div>
                    <pre tabIndex={0} aria-label={label}>
                        {text}
                    </pre>
                </>
            ) : (
                <p>Submit the form to inspect its values or validation errors.</p>
            )}
        </section>
    )
}
