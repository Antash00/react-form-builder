import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const bundle = readFileSync(new URL('../dist/index.cjs', import.meta.url), 'utf8')
const muiSubpathRequires = [
    ...bundle.matchAll(/\brequire\(['"](@mui\/material\/[^'"]+)['"]\)/g),
].map(([, specifier]) => specifier)

if (muiSubpathRequires.length > 0) {
    throw new Error(`CommonJS bundle requires MUI subpaths: ${muiSubpathRequires.join(', ')}`)
}

const require = createRequire(import.meta.url)
const { FormBuilder } = require('../dist/index.cjs')
const React = require('react')
const { renderToString } = require('react-dom/server')

if (typeof FormBuilder !== 'function') {
    throw new Error('CommonJS bundle does not export FormBuilder')
}

const item = { id: 1, name: 'Editor' }
const itemProperties = {
    items: [item],
    getItemLabel: (option) => option.name,
    getItemKey: (option) => option.id,
}
const markup = renderToString(
    React.createElement(FormBuilder, {
        config: [
            { accessor: 'name', type: 'text', properties: { label: 'Name' } },
            { accessor: 'count', type: 'number', properties: { label: 'Count' } },
            { accessor: 'active', type: 'checkbox', properties: { label: 'Active' } },
            {
                accessor: 'roles',
                type: 'checkboxGroup',
                properties: { ...itemProperties, label: 'Checkbox roles' },
            },
            {
                accessor: 'primaryRole',
                type: 'radioGroup',
                properties: { ...itemProperties, label: 'Radio role' },
            },
            {
                accessor: 'selectedRole',
                type: 'select',
                properties: { ...itemProperties, label: 'Select role' },
            },
            {
                accessor: 'searchedRole',
                type: 'autocomplete',
                properties: {
                    label: 'Search role',
                    options: [item],
                    getOptionLabel: (option) => option.name,
                },
            },
        ],
        onSubmit: () => {},
    }),
)

for (const label of [
    'Name',
    'Count',
    'Active',
    'Checkbox roles',
    'Radio role',
    'Select role',
    'Search role',
]) {
    if (!markup.includes(label)) {
        throw new Error(`CommonJS render omitted ${label}`)
    }
}
