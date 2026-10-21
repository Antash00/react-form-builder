import type { JSX } from 'react'
import type { DefaultValues } from 'react-hook-form'
import { expectAssignable, expectNotAssignable, expectType } from 'tsd'
import {
    defineConfig,
    FormBuilder,
    type CheckboxFieldConfig,
    type CheckboxGroupFieldConfig,
    type InferFormValues,
    type SelectFieldConfig,
    type TextFieldConfig,
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
    { accessor: 'amount', type: 'text', properties: { type: 'number' } },
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
