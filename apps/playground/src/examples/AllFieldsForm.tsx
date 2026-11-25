import { allFieldRoles } from '../variables/catalog'
import { type FieldGroup, FormBuilder, defineConfig } from '@antash00/form-builder-mui'
import type { FormCallbacks } from '../useFormOutput'
import { allFieldsDefaults } from '../variables/defaultValues'

type Role = (typeof allFieldRoles)[number]

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
            items: allFieldRoles,
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
            items: allFieldRoles,
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
            items: allFieldRoles.slice(0, 3),
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
            items: allFieldRoles,
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
            options: allFieldRoles,
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
            options: allFieldRoles,
            getOptionLabel: (role: Role) => role.name,
        },
    },
])

const groups = [
    { fields: ['name', 'email'], columns: { xs: 1, md: 2 }, gap: 2 },
    { fields: ['budget', 'notes'], columns: { xs: 1, md: 2 }, gap: 3 },
] satisfies FieldGroup<(typeof config)[number]['accessor']>[]

export function AllFieldsForm({ onSubmit, onInvalid }: FormCallbacks) {
    return (
        <FormBuilder
            config={config}
            groups={groups}
            defaultValues={allFieldsDefaults}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
        />
    )
}
