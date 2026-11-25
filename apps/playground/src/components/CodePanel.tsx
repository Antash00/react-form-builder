import { useMemo, useState } from 'react'
import { Dialog } from '@mui/material'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import { CopyButton } from './CopyButton'

type SourceFile = { name: string; source: string }

export function CodePanel({ files, compact = false }: { files: SourceFile[]; compact?: boolean }) {
    const [index, setIndex] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const { name, source } = files[index]
    const code = source.trimEnd()
    const highlighted = useMemo(() => {
        const language = name.endsWith('.tsx') ? 'tsx' : 'typescript'
        return Prism.highlight(code, Prism.languages[language], language)
    }, [code, name])
    const panel = (
        <section aria-label="Source code" className="code-panel">
            <div className="code-head">
                <span className="language">TS</span>
                {files.length > 1 ? (
                    <select
                        aria-label="Source file"
                        value={index}
                        onChange={(e) => setIndex(Number(e.target.value))}
                    >
                        {files.map((file, i) => (
                            <option key={file.name} value={i}>
                                {file.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <strong>{name}</strong>
                )}
                <CopyButton key={name} text={source} label="Copy source code" />
                {!compact && (
                    <button className="expand" onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Close' : 'Expand'}
                    </button>
                )}
            </div>
            <pre key={name} aria-label={name} tabIndex={0}>
                <span className="gutter" aria-hidden="true">
                    {code
                        .split('\n')
                        .map((_, i) => i + 1)
                        .join('\n')}
                </span>
                <code dangerouslySetInnerHTML={{ __html: highlighted }} />
            </pre>
            <div className="code-foot">
                <span>{name.endsWith('.tsx') ? 'TypeScript JSX' : 'TypeScript'}</span>
                <span>{code.split('\n').length} lines</span>
            </div>
        </section>
    )
    return (
        <>
            {panel}
            {expanded && (
                <Dialog
                    fullWidth
                    maxWidth="lg"
                    open
                    onClose={() => setExpanded(false)}
                    slotProps={{ paper: { 'aria-label': 'Expanded source code' } }}
                >
                    {panel}
                </Dialog>
            )}
        </>
    )
}
