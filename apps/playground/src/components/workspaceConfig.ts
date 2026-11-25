import { defineConfig } from '@antash00/form-builder-mui'

export const config = defineConfig([
    {
        accessor: 'name',
        type: 'text',
        properties: { label: 'Workspace name' },
        rules: { required: 'Enter a workspace name' },
    },
    {
        accessor: 'private',
        type: 'checkbox',
        properties: { label: 'Private workspace' },
    },
])
