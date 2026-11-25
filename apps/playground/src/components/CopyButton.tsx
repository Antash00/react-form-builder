import { useState } from 'react'
import { Glyph } from './Glyph'

export function CopyButton({ text, label }: { text: string; label: string }) {
    const [message, setMessage] = useState('')
    return (
        <button
            type="button"
            className="copy"
            aria-label={message || label}
            title={message || label}
            onBlur={() => setMessage('')}
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text)
                    setMessage('Copied')
                } catch {
                    setMessage('Copy failed')
                }
            }}
        >
            <Glyph name="copy" />
            <span aria-live="polite">{message}</span>
        </button>
    )
}
