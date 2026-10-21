import { useState } from 'react'
import { defineConfig, FormBuilder } from '@antash00/form-builder-mui'

type Role = { id: number; name: string }
const roles: Role[] = [
    { id: 1, name: 'Editor' },
    { id: 2, name: 'Reviewer' },
]

const config = defineConfig([
    {
        accessor: 'name',
        type: 'text',
        id: 'person-name',
        properties: {
            label: 'Name',
            placeholder: 'Enter name',
            fullWidth: true,
            variant: 'filled',
            helperText: 'Your full name',
            slotProps: {
                htmlInput: { autoComplete: 'name', maxLength: 60 },
                inputLabel: (state) => ({ shrink: state.required }),
            },
        },
        rules: {
            required: 'Name is required',
        },
    },
    {
        accessor: 'confirmed',
        type: 'checkbox',
        properties: {
            label: 'I confirm the details',
            helperText: 'Review the name before submitting',
        },
        rules: { required: 'Confirmation is required' },
    },
    {
        accessor: 'roles',
        type: 'checkboxGroup',
        properties: {
            label: 'Roles',
            items: roles,
            getItemLabel: (item: Role) => item.name,
            getItemKey: (item: Role) => item.id,
        },
        rules: { required: 'Choose at least one role' },
    },
    {
        accessor: 'primaryRole',
        type: 'select',
        properties: {
            label: 'Primary role',
            helperText: 'Choose your main role',
            fullWidth: true,
            variant: 'filled',
            items: roles,
            getItemLabel: (item: Role) => item.name,
            getItemKey: (item: Role) => item.id,
        },
        rules: { required: 'Choose a primary role' },
    },
    {
        accessor: 'additionalRoles',
        type: 'select',
        properties: {
            label: 'Additional roles',
            helperText: 'Select any additional roles',
            multiple: true,
            fullWidth: true,
            variant: 'filled',
            items: roles,
            getItemLabel: (item: Role) => item.name,
            getItemKey: (item: Role) => item.id,
        },
    },
])

export const BasicForm = () => {
    const [submittedName, setSubmittedName] = useState<string | null>(null)
    const [submittedRoles, setSubmittedRoles] = useState<string[]>([])
    const [submittedPrimaryRole, setSubmittedPrimaryRole] = useState<string | null>(null)
    const [submittedAdditionalRoles, setSubmittedAdditionalRoles] = useState<string[]>([])

    return (
        <>
            <FormBuilder
                config={config}
                onSubmit={(values) => {
                    setSubmittedName(values.name)
                    setSubmittedRoles(values.roles.map((role) => role.name))
                    setSubmittedPrimaryRole(values.primaryRole?.name ?? null)
                    setSubmittedAdditionalRoles(values.additionalRoles.map((role) => role.name))
                    console.log(values)
                }}
            />
            {submittedName !== null && <output aria-label="Submitted name">{submittedName}</output>}
            {submittedName !== null && (
                <output aria-label="Submitted roles">{submittedRoles.join(', ')}</output>
            )}
            {submittedPrimaryRole !== null && (
                <output aria-label="Submitted primary role">{submittedPrimaryRole}</output>
            )}
            {submittedName !== null && (
                <output aria-label="Submitted additional roles">
                    {submittedAdditionalRoles.join(', ')}
                </output>
            )}
        </>
    )
}
