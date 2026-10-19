import type { RegisterOptions } from 'react-hook-form'
import type { ReactNode } from 'react'
import type { FormGroupProps } from '@mui/material'
import type { CheckboxFieldProperties, TextFieldProperties } from './inputsProperties'

export type BaseFieldConfig<TAccessor extends string = string, TType extends string = string> = {
    accessor: TAccessor
    type: TType
    id?: string
    className?: string
}
export type TextFieldConfig<TAccessor extends string = string> = BaseFieldConfig<
    TAccessor,
    'text'
> & {
    properties?: TextFieldProperties

    rules?: Pick<RegisterOptions, 'required' | 'minLength' | 'maxLength' | 'pattern'>
}
export type CheckboxFieldConfig<TAccessor extends string = string> = BaseFieldConfig<
    TAccessor,
    'checkbox'
> & {
    properties?: CheckboxFieldProperties
    rules?: Pick<RegisterOptions, 'required'>
}

export type CheckboxGroupFieldConfig<
    TItem = unknown,
    TAccessor extends string = string,
> = BaseFieldConfig<TAccessor, 'checkboxGroup'> & {
    properties: Omit<
        FormGroupProps,
        'children' | 'onChange' | 'onBlur' | 'id' | 'className' | 'role' | 'aria-labelledby'
    > & {
        items: readonly TItem[]
        label: ReactNode
        helperText?: ReactNode
        disabled?: boolean
        getItemLabel: (item: TItem) => ReactNode
        getItemKey: (item: TItem) => string | number
    }
    rules?: Pick<RegisterOptions, 'required'>
}

// The broad union accepts each group's own item type; defineConfig checks its callbacks against items.
type AnyCheckboxGroupField<TAccessor extends string> = Omit<
    CheckboxGroupFieldConfig<unknown, TAccessor>,
    'properties'
> & {
    properties: Omit<
        CheckboxGroupFieldConfig<unknown>['properties'],
        'getItemLabel' | 'getItemKey'
    > & {
        getItemLabel(item: unknown): ReactNode
        getItemKey(item: unknown): string | number
    }
}

export type ItemField<TAccessor extends string = string> =
    TextFieldConfig<TAccessor> | CheckboxFieldConfig<TAccessor> | AnyCheckboxGroupField<TAccessor>
