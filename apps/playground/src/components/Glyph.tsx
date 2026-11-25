import { glyphPaths } from '../variables/site'

export function Glyph({ name }: { name: keyof typeof glyphPaths }) {
    return (
        <svg
            className="glyph"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={glyphPaths[name]} />
        </svg>
    )
}
