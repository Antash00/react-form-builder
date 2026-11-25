import { basicRoles } from '../variables/catalog'
import { FormBuilder, defineConfig } from '@antash00/form-builder-mui'
import type { FormCallbacks } from '../useFormOutput'

type Role = (typeof basicRoles)[number]

const roleOptions = {
    items: basicRoles,
    getItemLabel: (item: Role) => item.name,
    getItemKey: (item: Role) => item.id,
}

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
            ...roleOptions,
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
            ...roleOptions,
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
            ...roleOptions,
        },
    },
])
export function BasicForm({ onSubmit, onInvalid }: FormCallbacks) {
    return (
        <FormBuilder
            config={config}
            submitButtonProps={{ children: 'Save form', color: 'success' }}
            resetButtonProps={false}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
        />
    )
}
