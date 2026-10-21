import { useState } from 'react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

type Role = { id: number; name: string }

const roles: Role[] = [
    { id: 0, name: 'Editor' },
    { id: 1, name: 'Reviewer' },
    { id: 2, name: 'Publisher' },
]

const config = defineConfig([
    {
        accessor: 'name',
        type: 'text',
        properties: { label: 'Name', fullWidth: true, helperText: 'Required text field' },
        rules: {
            required: 'Enter a name',
            minLength: { value: 2, message: 'Use at least 2 characters' },
        },
    },
    {
        accessor: 'email',
        type: 'text',
        properties: { label: 'Email', type: 'email', fullWidth: true },
        rules: {
            required: 'Enter an email',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
        },
    },
    {
        accessor: 'budget',
        type: 'text',
        properties: {
            label: 'Budget',
            type: 'number',
            fullWidth: true,
            helperText: 'Text field values stay strings, including 0',
        },
    },
    {
        accessor: 'notes',
        type: 'text',
        properties: { label: 'Notes', multiline: true, minRows: 3, fullWidth: true },
    },
    {
        accessor: 'confirmed',
        type: 'checkbox',
        properties: { label: 'I confirm the details' },
        rules: { required: 'Confirm the details' },
    },
    {
        accessor: 'roles',
        type: 'checkboxGroup',
        properties: {
            label: 'Roles (checkbox group)',
            items: roles,
            row: true,
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
        rules: { required: 'Choose a role' },
    },
    {
        accessor: 'primaryRole',
        type: 'select',
        properties: {
            label: 'Primary role (single select)',
            emptyLabel: 'No primary role',
            fullWidth: true,
            items: roles,
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
        rules: { required: 'Choose a primary role' },
    },
    {
        accessor: 'additionalRoles',
        type: 'select',
        properties: {
            label: 'Additional roles (multiple select)',
            multiple: true,
            fullWidth: true,
            items: roles,
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
    },
])

export const AllFieldsForm = () => {
    const [submitted, setSubmitted] = useState<string | null>(null)

    return (
        <>
            <p>Every supported field type in one form. Submit to inspect the inferred values.</p>
            <FormBuilder
                config={config}
                defaultValues={{ budget: '0', notes: 'Existing note', additionalRoles: [roles[1]] }}
                onSubmit={(values) => {
                    setSubmitted(
                        JSON.stringify(
                            {
                                name: values.name,
                                email: values.email,
                                budget: values.budget,
                                notes: values.notes,
                                confirmed: values.confirmed,
                                roles: values.roles.map((role) => role.name),
                                primaryRole: values.primaryRole?.name ?? null,
                                additionalRoles: values.additionalRoles.map((role) => role.name),
                            },
                            null,
                            2,
                        ),
                    )
                }}
            />
            {submitted !== null && (
                <pre aria-label="Submitted values" className="submission-output">
                    {submitted}
                </pre>
            )}
        </>
    )
}
