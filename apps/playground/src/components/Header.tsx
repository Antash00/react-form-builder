import { useState } from 'react'
import { ListSubheader, Menu, MenuItem } from '@mui/material'
import { Link, NavLink, useLocation } from 'react-router'
import { categories } from '../variables/examples'
import { docs, github, npm } from '../variables/site'
import { Glyph } from './Glyph'

export function Header({ dark, toggle }: { dark: boolean; toggle: () => void }) {
    const { pathname } = useLocation()
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    return (
        <header>
            <nav aria-label="Main navigation" className="wrap bar">
                <Link to="/" className="brand">
                    <i className="logo" aria-hidden="true">
                        <b />
                        <b />
                        <b />
                    </i>
                    FormBuilder <span className="brand-context">Playground</span>
                </Link>
                <div className="nav-links">
                    <button
                        aria-haspopup="menu"
                        aria-expanded={!!anchor}
                        onClick={(e) => setAnchor(e.currentTarget)}
                    >
                        Examples <Glyph name="down" />
                    </button>
                    <a className="wide" href={docs}>
                        Docs
                    </a>
                </div>
                <div className="resources">
                    <a href={github}>
                        GitHub<span aria-hidden="true"> ↗</span>
                    </a>
                    <a href={npm}>
                        npm<span aria-hidden="true"> ↗</span>
                    </a>
                </div>
                <button
                    className="theme-button"
                    onClick={toggle}
                    aria-label={dark ? 'Use light theme' : 'Use dark theme'}
                >
                    <Glyph name={dark ? 'sun' : 'moon'} />
                </button>
                <Menu
                    anchorEl={anchor}
                    open={!!anchor}
                    onClose={() => setAnchor(null)}
                    slotProps={{ list: { 'aria-label': 'Examples' } }}
                >
                    {categories.flatMap((category) => [
                        <ListSubheader key={category.title}>{category.title}</ListSubheader>,
                        ...category.examples.map((item) => (
                            <MenuItem
                                component={NavLink}
                                selected={pathname === item.path}
                                to={item.path}
                                key={item.path}
                                onClick={() => setAnchor(null)}
                            >
                                {item.title}
                            </MenuItem>
                        )),
                    ])}
                    <MenuItem component="a" href={docs}>
                        Documentation ↗
                    </MenuItem>
                </Menu>
            </nav>
        </header>
    )
}
