import type { JSX } from 'react'
import type { DefaultValues } from 'react-hook-form'
import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
import {
    defineConfig,
    FormBuilder,
    type CheckboxFieldConfig,
    type CheckboxGroupFieldConfig,
    type RadioGroupFieldConfig,
    type InferFormValues,
    type NumberFieldConfig,
    type SelectFieldConfig,
    type AutocompleteFieldConfig,
    type TextFieldConfig,
    type FieldGroup,
} from '../'

const config = defineConfig([
    {
        accessor: 'name',
        type: 'text',
        properties: {
            label: 'Name',
            variant: 'filled',
            slotProps: { input: { disableUnderline: true }, htmlInput: { maxLength: 60 } },
        },
    },
    { accessor: 'amount', type: 'text', properties: { label: 'Amount as text' } },
])

declare const values: InferFormValues<typeof config>
expectType<{ name: string; amount: string }>(values)
expectType<string>(values.name)
expectNotAssignable<keyof typeof values>('missing')

expectType<JSX.Element>(
    <FormBuilder
        config={config}
        defaultValues={{ name: 'Ada' }}
        onSubmit={(submitted, result) => {
            expectType<string>(submitted.name)
            expectType<string>(submitted.amount)
            expectType<'text'>(result.name.type)
            expectType<string>(result.name.value)
            expectNotAssignable<keyof typeof submitted>('missing')
        }}
    />,
)

expectNotAssignable<DefaultValues<InferFormValues<typeof config>>>({ name: 42 })

expectType<JSX.Element>(
    <FormBuilder
        config={config}
        groups={[{ fields: ['name', 'amount'], columns: { xs: 1, md: 2 }, gap: 2 }]}
        onSubmit={(submitted) => expectType<string>(submitted.name)}
    />,
)
expectNotAssignable<FieldGroup<'name' | 'amount'>>({ fields: ['missing'], columns: 2 })
expectNotAssignable<FieldGroup<'name' | 'amount'>>({ fields: ['name'], columns: 'two' })
expectType<JSX.Element>(
    <FormBuilder
        config={config}
        // @ts-expect-error group fields must exist in config
        groups={[{ fields: ['missing'], columns: 2 }]}
        onSubmit={() => {}}
    />,
)

const numberConfig = defineConfig([
    {
        accessor: 'budget',
        type: 'number',
        properties: {
            label: 'Budget',
            variant: 'filled',
            slotProps: { htmlInput: { step: '0.01' } },
        },
        rules: { required: 'Enter a budget', min: 0, max: 100 },
    },
])
declare const numberValues: InferFormValues<typeof numberConfig>
expectType<number | null>(numberValues.budget)
expectNotAssignable<DefaultValues<InferFormValues<typeof numberConfig>>>({ budget: '42' })
expectType<JSX.Element>(
    <FormBuilder
        config={numberConfig}
        defaultValues={{ budget: 0 }}
        onSubmit={(submitted, result) => {
            expectType<number | null>(submitted.budget)
            expectType<'number'>(result.budget.type)
            expectType<number | null>(result.budget.value)
        }}
    />,
)
type NumberProperties = NonNullable<NumberFieldConfig['properties']>
expectNotAssignable<NumberProperties>({ type: 'text' })
expectNotAssignable<NumberProperties>({ multiline: true })
expectNotAssignable<NumberProperties>({ value: 5 })
expectNotAssignable<NumberProperties>({ onChange: () => {} })
expectNotAssignable<NumberFieldConfig>({
    accessor: 'budget',
    type: 'number',
    rules: { pattern: /[0-9]/ },
})

const checkboxConfig = defineConfig([
    { accessor: 'name', type: 'text' },
    { accessor: 'active', type: 'checkbox' },
])
declare const checkboxValues: InferFormValues<typeof checkboxConfig>
expectType<string>(checkboxValues.name)
expectType<boolean>(checkboxValues.active)
expectNotAssignable<DefaultValues<InferFormValues<typeof checkboxConfig>>>({ active: 'yes' })
expectType<JSX.Element>(
    <FormBuilder
        config={checkboxConfig}
        defaultValues={{ active: true }}
        onSubmit={(submitted) => {
            expectType<string>(submitted.name)
            expectType<boolean>(submitted.active)
        }}
    />,
)

type CheckboxProperties = NonNullable<CheckboxFieldConfig['properties']>
const supportedCheckboxProperties = {
    color: 'secondary' as const,
    disabled: true,
    label: 'Active',
    helperText: 'Turn on when available',
    slotProps: { input: { 'aria-label': 'Active', 'data-test-field': 'active' } },
}
expectAssignable<CheckboxProperties>(supportedCheckboxProperties)
expectAssignable<CheckboxProperties>({
    slotProps: { input: (state) => ({ 'aria-label': state.disabled ? 'Disabled' : 'Active' }) },
})
expectNotAssignable<CheckboxProperties>({ checked: true })
expectNotAssignable<CheckboxProperties>({ defaultChecked: true })
expectNotAssignable<CheckboxProperties>({ value: 'yes' })
expectNotAssignable<CheckboxProperties>({ defaultValue: 'yes' })
expectNotAssignable<CheckboxProperties>({ onChange: () => {} })
expectNotAssignable<CheckboxProperties>({ required: true })
expectNotAssignable<CheckboxProperties>({ id: 'owned-by-config' })
expectNotAssignable<CheckboxProperties>({ className: 'owned-by-config' })
expectNotAssignable<CheckboxProperties>({ slotProps: { input: { checked: true } } })
expectNotAssignable<CheckboxProperties>({ slotProps: { input: { defaultValue: 'yes' } } })
expectNotAssignable<CheckboxProperties>({ slotProps: { input: { onChange: () => {} } } })
expectNotAssignable<CheckboxProperties>({ slotProps: { input: { 'aria-invalid': true } } })
expectNotAssignable<CheckboxProperties>({ slotProps: { input: { ref: () => {} } } })
expectNotAssignable<CheckboxProperties>({ slotProps: { root: {} } })
expectNotAssignable<CheckboxFieldConfig>({
    accessor: 'active',
    type: 'checkbox',
    rules: { pattern: { value: /yes/, message: 'Invalid' } },
})

type Role = { id: number; name: string }
type Permission = { code: string }
const roles: Role[] = [
    { id: 1, name: 'Editor' },
    { id: 2, name: 'Reviewer' },
]
const permissions: Permission[] = [{ code: 'read' }]
const groupConfig = defineConfig([
    { accessor: 'name', type: 'text' },
    {
        accessor: 'roles',
        type: 'checkboxGroup',
        properties: {
            label: 'Roles',
            items: roles,
            row: true,
            getItemLabel: (item: Role) => {
                expectType<Role>(item)
                return item.name
            },
            getItemKey: (item: Role) => item.id,
        },
        rules: { required: 'Choose a role' },
    },
    {
        accessor: 'permissions',
        type: 'checkboxGroup',
        properties: {
            label: 'Permissions',
            items: permissions,
            getItemLabel: (item: Permission) => item.code,
            getItemKey: (item: Permission) => item.code,
        },
    },
])
declare const groupValues: InferFormValues<typeof groupConfig>
expectType<Role[]>(groupValues.roles)
expectType<Permission[]>(groupValues.permissions)
expectNotAssignable<keyof typeof groupValues>('missing')
expectNotAssignable<DefaultValues<InferFormValues<typeof groupConfig>>>({ roles: [false] })
expectType<JSX.Element>(
    <FormBuilder
        config={groupConfig}
        defaultValues={{ roles: [{ id: 1, name: 'Editor' }] }}
        onSubmit={(submitted, result) => {
            expectType<Role[]>(submitted.roles)
            expectType<Permission[]>(submitted.permissions)
            expectType<string>(submitted.name)
            expectType<Role[]>(result.roles.value)
        }}
    />,
)
expectNotAssignable<CheckboxGroupFieldConfig<Role>>({
    accessor: 'roles',
    type: 'checkboxGroup',
    properties: {
        label: 'Roles',
        items: roles,
        getItemLabel: (item: Role) => item.name,
        getItemKey: (item: Role) => item.id,
    },
    rules: { pattern: /yes/ },
})
expectNotAssignable<CheckboxGroupFieldConfig<Role>>({
    accessor: 'roles',
    type: 'checkboxGroup',
    properties: {
        label: 'Roles',
        items: roles,
        getItemLabel: (item: Role & { extra: string }) => item.extra,
        getItemKey: (item: Role) => item.id,
    },
})
defineConfig([
    {
        accessor: 'roles',
        type: 'checkboxGroup',
        properties: {
            label: 'Roles',
            items: roles,
            // @ts-expect-error callback item cannot require properties absent from items
            getItemLabel: (item: Role & { extra: string }) => item.extra,
            getItemKey: (item: Role) => item.id,
        },
    },
])

type Properties = NonNullable<TextFieldConfig['properties']>

const radioConfig = defineConfig([
    {
        accessor: 'primaryRole',
        type: 'radioGroup',
        properties: {
            label: 'Primary role',
            row: true,
            items: roles,
            getItemLabel: (item: Role) => item.name,
            getItemKey: (item: Role) => item.id,
        },
        rules: { required: 'Choose a role' },
    },
])
declare const radioValues: InferFormValues<typeof radioConfig>
expectType<Role | null>(radioValues.primaryRole)
expectNotAssignable<DefaultValues<InferFormValues<typeof radioConfig>>>({
    primaryRole: { code: 'read' },
})
expectType<JSX.Element>(
    <FormBuilder
        config={radioConfig}
        defaultValues={{ primaryRole: roles[0] }}
        onSubmit={(submitted, result) => {
            expectType<Role | null>(submitted.primaryRole)
            expectType<'radioGroup'>(result.primaryRole.type)
            expectType<Role | null>(result.primaryRole.value)
        }}
    />,
)
expectNotAssignable<RadioGroupFieldConfig<Role>>({
    accessor: 'primaryRole',
    type: 'radioGroup',
    properties: {
        label: 'Primary role',
        items: roles,
        getItemLabel: (item: Role & { extra: string }) => item.extra,
        getItemKey: (item: Role) => item.id,
    },
})
expectNotAssignable<RadioGroupFieldConfig<Role>['properties']>({
    label: 'Primary role',
    items: roles,
    getItemLabel: (item: Role) => item.name,
    getItemKey: (item: Role) => item.id,
    value: '1',
})
defineConfig([
    {
        accessor: 'primaryRole',
        type: 'radioGroup',
        properties: {
            label: 'Primary role',
            items: roles,
            // @ts-expect-error callback item cannot require properties absent from items
            getItemLabel: (item: Role & { extra: string }) => item.extra,
            getItemKey: (item: Role) => item.id,
        },
    },
])

expectNotAssignable<Properties>({ value: 'outside RHF' })
expectNotAssignable<Properties>({ required: true })
expectNotAssignable<Properties>({ inputRef: () => {} })
expectNotAssignable<Properties>({ id: 'owned-by-config' })
expectNotAssignable<Properties>({ className: 'owned-by-config' })
expectNotAssignable<Properties>({ select: true })
expectNotAssignable<TextFieldConfig>({
    accessor: 'role',
    type: 'text',
    properties: { select: true },
})
expectNotAssignable<Properties>({ type: 'file' })
expectNotAssignable<Properties>({ type: 'checkbox' })
expectNotAssignable<Properties>({ type: 'number' })
expectNotAssignable<TextFieldConfig>({
    accessor: 'amount',
    type: 'text',
    properties: { type: 'number' },
})
defineConfig([
    {
        accessor: 'amount',
        type: 'text',
        // @ts-expect-error numeric input belongs to the number field
        properties: { type: 'number' },
    },
])
const invalidOutlined = {
    variant: 'outlined' as const,
    slotProps: { input: { disableUnderline: true } },
}
expectNotAssignable<Properties>(invalidOutlined)
expectNotAssignable<Properties>({ slotProps: { htmlInput: { onChange: () => {} } } })
expectNotAssignable<Properties>({ slotProps: { htmlInput: { value: 'outside RHF' } } })
expectNotAssignable<Properties>({ slotProps: { htmlInput: { maxLength: 'ten' } } })
expectNotAssignable<Properties>({ slotProps: { htmlInput: { inventedProperty: true } } })
expectNotAssignable<Properties>({ slotProps: { input: { value: 'outside RHF' } } })
expectNotAssignable<Properties>({ slotProps: { input: { inputProps: { value: 'outside RHF' } } } })
expectNotAssignable<Properties>({ slotProps: { inputLabel: { htmlFor: 'another-input' } } })
expectNotAssignable<Properties>({ slotProps: { root: { required: false } } })
expectNotAssignable<Properties>({ slotProps: { select: {} } })

const invalidSelect = { select: true }
expectNotAssignable<Properties>(invalidSelect)

const selectConfig = defineConfig([
    {
        accessor: 'primaryRole',
        type: 'select',
        properties: {
            label: 'Primary role',
            items: roles,
            getItemLabel: (item: Role) => item.name,
            getItemKey: (item: Role) => item.id,
        },
    },
])
declare const selectValues: InferFormValues<typeof selectConfig>
expectType<Role | null>(selectValues.primaryRole)
expectNotAssignable<DefaultValues<InferFormValues<typeof selectConfig>>>({
    primaryRole: { code: 'read' },
})
expectType<JSX.Element>(
    <FormBuilder
        config={selectConfig}
        defaultValues={{ primaryRole: roles[0] }}
        onSubmit={(submitted, result) => {
            expectType<Role | null>(submitted.primaryRole)
            expectType<'select'>(result.primaryRole.type)
            expectType<Role | null>(result.primaryRole.value)
        }}
    />,
)
expectNotAssignable<SelectFieldConfig<Role>>({
    accessor: 'primaryRole',
    type: 'select',
    properties: {
        label: 'Primary role',
        items: roles,
        getItemLabel: (item: Role & { extra: string }) => item.extra,
        getItemKey: (item: Role) => item.id,
    },
})
type SelectProperties = SelectFieldConfig<Role>['properties']
expectAssignable<SelectProperties>({
    variant: 'filled',
    disableUnderline: true,
    label: 'Primary role',
    items: roles,
    getItemLabel: (item: Role) => item.name,
    getItemKey: (item: Role) => item.id,
})
expectNotAssignable<SelectProperties>({
    variant: 'outlined',
    disableUnderline: true,
    label: 'Primary role',
    items: roles,
    getItemLabel: (item: Role) => item.name,
    getItemKey: (item: Role) => item.id,
})
expectNotAssignable<SelectProperties>({
    label: 'Primary role',
    items: roles,
    getItemLabel: (item: Role) => item.name,
    getItemKey: (item: Role) => item.id,
    value: 'outside RHF',
})
expectNotAssignable<SelectProperties>({
    label: 'Primary role',
    items: roles,
    getItemLabel: (item: Role) => item.name,
    getItemKey: (item: Role) => item.id,
    native: true,
})
expectNotAssignable<SelectProperties>({
    label: 'Primary role',
    items: roles,
    getItemLabel: (item: Role) => item.name,
    getItemKey: (item: Role) => item.id,
    slotProps: { input: { value: 'outside RHF' } },
})
defineConfig([
    {
        accessor: 'primaryRole',
        type: 'select',
        properties: {
            label: 'Primary role',
            items: roles,
            // @ts-expect-error callback item must match the items
            getItemLabel: (item: Role & { extra: string }) => item.extra,
            getItemKey: (item: Role) => item.id,
        },
    },
])

const multiSelectConfig = defineConfig([
    {
        accessor: 'additionalRoles',
        type: 'select',
        properties: {
            label: 'Additional roles',
            multiple: true,
            items: roles,
            getItemLabel: (item: Role) => item.name,
            getItemKey: (item: Role) => item.id,
        },
    },
])

const autocompleteConfig = defineConfig([
    {
        accessor: 'roleSearch',
        type: 'autocomplete',
        properties: {
            label: 'Role search',
            options: roles,
            getOptionLabel: (role: Role) => role.name,
            getOptionKey: (role: Role) => role.id,
        },
    },
    {
        accessor: 'roleSearches',
        type: 'autocomplete',
        properties: {
            label: 'Role searches',
            multiple: true,
            options: roles,
            getOptionLabel: (role: Role) => role.name,
        },
    },
])
declare const autocompleteValues: InferFormValues<typeof autocompleteConfig>
expectType<Role | null>(autocompleteValues.roleSearch)
expectType<Role[]>(autocompleteValues.roleSearches)
expectNotAssignable<DefaultValues<InferFormValues<typeof autocompleteConfig>>>({
    roleSearches: roles[0],
})
expectType<JSX.Element>(
    <FormBuilder
        config={autocompleteConfig}
        defaultValues={{ roleSearch: roles[0], roleSearches: [roles[1]] }}
        onSubmit={(submitted, result) => {
            expectType<Role | null>(submitted.roleSearch)
            expectType<Role[]>(submitted.roleSearches)
            expectType<'autocomplete'>(result.roleSearch.type)
        }}
    />,
)
expectNotAssignable<AutocompleteFieldConfig<Role>>({
    accessor: 'roleSearch',
    type: 'autocomplete',
    properties: {
        label: 'Role search',
        options: roles,
        getOptionLabel: (role: Role) => role.name,
        value: roles[0],
    },
})
defineConfig([
    {
        accessor: 'roleSearch',
        type: 'autocomplete',
        properties: {
            label: 'Role search',
            options: roles,
            // @ts-expect-error callback must accept the option item type
            getOptionLabel: (role: Role & { extra: string }) => role.extra,
        },
    },
])
declare const multiSelectValues: InferFormValues<typeof multiSelectConfig>
expectType<Role[]>(multiSelectValues.additionalRoles)
expectNotAssignable<DefaultValues<InferFormValues<typeof multiSelectConfig>>>({
    additionalRoles: roles[0],
})
expectType<JSX.Element>(
    <FormBuilder
        config={multiSelectConfig}
        defaultValues={{ additionalRoles: [roles[0]] }}
        onSubmit={(submitted, result) => {
            expectType<Role[]>(submitted.additionalRoles)
            expectType<Role[]>(result.additionalRoles.value)
        }}
    />,
)
