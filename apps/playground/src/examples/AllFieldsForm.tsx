import { useState } from 'react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

type Role = { id: number; name: string }

const roles: Role[] = [
    { id: 0, name: 'Editor' },
    { id: 1, name: 'Reviewer' },
    { id: 2, name: 'Publisher' },
    { id: 3, name: 'Translator' },
    { id: 4, name: 'Analyst' },
    { id: 5, name: 'Designer' },
    { id: 6, name: 'Support' },
    { id: 7, name: 'Auditor' },
    { id: 8, name: 'Administrator' },
    { id: 9, name: 'Approver' },
    { id: 10, name: 'Owner' },
    { id: 11, name: 'Guest' },
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
        type: 'number',
        properties: {
            label: 'Budget',
            fullWidth: true,
            helperText: 'Numbers submit as numbers; an empty field submits null',
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
        accessor: 'approvalRole',
        type: 'radioGroup',
        properties: {
            label: 'Approval role (radio group)',
            row: true,
            items: roles.slice(0, 3),
            getItemLabel: (role: Role) => role.name,
            getItemKey: (role: Role) => role.id,
        },
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
    {
        accessor: 'searchRole',
        type: 'autocomplete',
        properties: {
            label: 'Role (autocomplete)',
            fullWidth: true,
            options: roles,
            getOptionLabel: (role: Role) => role.name,
            isOptionEqualToValue: (option: Role, value: Role) => option.id === value.id,
        },
    },
    {
        accessor: 'searchRoles',
        type: 'autocomplete',
        properties: {
            label: 'Roles (multiple autocomplete)',
            multiple: true,
            fullWidth: true,
            options: roles,
            getOptionLabel: (role: Role) => role.name,
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
                groups={[
                    { fields: ['name', 'email'], columns: { xs: 1, md: 2 }, gap: 2 },
                    { fields: ['budget', 'notes'], columns: { xs: 1, md: 2 }, gap: 3 },
                ]}
                defaultValues={{ budget: 0, notes: 'Existing note', additionalRoles: [roles[1]] }}
                onSubmit={(values, result) => {
                    console.log('All fields submit', { values, result })
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
                                approvalRole: values.approvalRole?.name ?? null,
                                additionalRoles: values.additionalRoles.map((role) => role.name),
                                searchRole: values.searchRole?.name ?? null,
                                searchRoles: values.searchRoles.map((role) => role.name),
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
