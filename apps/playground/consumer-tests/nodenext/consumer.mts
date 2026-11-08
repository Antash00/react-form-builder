import {
    defineConfig,
    type InferFormValues,
    type SelectFieldConfig,
} from '@antash00/form-builder-mui'

type Role = { id: number; label: string }
const roles: Role[] = [{ id: 1, label: 'Admin' }]

const roleField: SelectFieldConfig<Role, 'roles'> = {
    accessor: 'roles',
    type: 'select',
    properties: {
        multiple: true,
        label: 'Roles',
        items: roles,
        getItemKey: (role) => role.id,
        getItemLabel: (role) => role.label,
    },
}

const config = defineConfig([{ accessor: 'name', type: 'text' }, roleField])
type Values = InferFormValues<typeof config>

const validValues: Values = { name: 'Ada', roles }
validValues.roles.map((role) => role.id)

// @ts-expect-error defineConfig must not degrade to any when checking declarations.
const invalidConfig: number = defineConfig([{ accessor: 'name', type: 'text' }])

// @ts-expect-error a text field must have a string value.
const invalidName: Values = { name: 42, roles }

// @ts-expect-error a multiple select must have an array value.
const invalidRoles: Values = { name: 'Ada', roles: roles[0] }

void [invalidConfig, invalidName, invalidRoles]
