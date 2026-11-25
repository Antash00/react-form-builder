import { useEffect, useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import { Link, Route, Routes, useLocation } from 'react-router'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { ExamplePage } from './pages/ExamplePage'
import { examples } from './variables/examples'
import { docs, github, npm, themeStorageKey } from './variables/site'
import { playgroundTheme } from './theme'

export default function App() {
    const [mode, setMode] = useState(() => localStorage.getItem(themeStorageKey))
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
    const dark = mode ? mode === 'dark' : prefersDark
    const theme = useMemo(() => playgroundTheme(dark), [dark])
    const { pathname } = useLocation()
    useEffect(() => {
        const current = examples.find((example) => example.path === pathname)
        document.title = (current?.title ?? 'Developer playground') + ' · FormBuilder'
        window.scrollTo(0, 0)
    }, [pathname])
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="site" data-theme={dark ? 'dark' : 'light'}>
                <a href="#main" className="skip">
                    Skip to content
                </a>
                <Header
                    dark={dark}
                    toggle={() => {
                        const next = dark ? 'light' : 'dark'
                        localStorage.setItem(themeStorageKey, next)
                        setMode(next)
                    }}
                />
                <main id="main" tabIndex={-1}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {examples.map((example) => (
                            <Route
                                key={example.path}
                                path={example.path}
                                element={
                                    <ExamplePage
                                        key={example.path}
                                        example={example}
                                        category={example.category}
                                    />
                                }
                            />
                        ))}
                    </Routes>
                </main>
                <footer className="wrap">
                    <Link to="/" className="footer-brand">
                        FormBuilder
                    </Link>
                    <a href={docs}>Documentation ↗</a>
                    <a href={github}>GitHub ↗</a>
                    <a href={npm}>npm ↗</a>
                </footer>
            </div>
        </ThemeProvider>
    )
}
