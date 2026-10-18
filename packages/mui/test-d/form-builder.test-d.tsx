import type { JSX } from 'react'
import type { DefaultValues } from 'react-hook-form'
import { expectNotAssignable, expectType } from 'tsd'
import { defineConfig, FormBuilder, type InferFormValues, type TextFieldConfig } from '../'

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
