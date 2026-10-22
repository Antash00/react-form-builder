import type { RegisterOptions } from 'react-hook-form'
import type { ReactNode } from 'react'
import type { FormGroupProps, GridProps, SelectProps } from '@mui/material'
import type { CheckboxFieldProperties, TextFieldProperties } from './inputsProperties'

export type NumberFieldProperties = TextFieldProperties extends infer TProps
    ? TProps extends unknown
        ? Omit<TProps, 'type' | 'multiline' | 'rows' | 'minRows' | 'maxRows'> & {
              type?: never
              multiline?: never
              rows?: never
              minRows?: never
              maxRows?: never
          }
        : never
    : never

export type BaseFieldConfig<TAccessor extends string = string, TType extends string = string> = {
    accessor: TAccessor
    type: TType
    id?: string
    className?: string
}

export type FieldGroup<TAccessor extends string = string> = {
    fields: readonly TAccessor[]
    columns: GridProps['columns']
    gap?: GridProps['spacing']
}
export type TextFieldConfig<TAccessor extends string = string> = BaseFieldConfig<
    TAccessor,
    'text'
> & {
    properties?: TextFieldProperties

    rules?: Pick<RegisterOptions, 'required' | 'minLength' | 'maxLength' | 'pattern'>
}
export type NumberFieldConfig<TAccessor extends string = string> = BaseFieldConfig<
    TAccessor,
    'number'
> & {
    properties?: NumberFieldProperties
    rules?: Pick<RegisterOptions, 'required' | 'min' | 'max'>
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

type ControlledSelectProps =
    | 'children'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'inputRef'
    | 'input'
    | 'inputProps'
    | 'inputComponent'
    | 'native'
    | 'renderValue'
    | 'error'
    | 'required'
    | 'id'
    | 'className'
    | 'labelId'
    | 'ref'
    | 'slots'
    | 'slotProps'
    | 'SelectDisplayProps'
    | 'aria-invalid'
    | 'aria-labelledby'

// Preserve MUI's variant-specific props while preventing overrides of form wiring.
type SelectProperties = SelectProps extends infer TProps
    ? TProps extends unknown
        ? Omit<TProps, ControlledSelectProps> & {
              [TKey in ControlledSelectProps]?: never
          }
        : never
    : never

export type SelectFieldConfig<TItem = unknown, TAccessor extends string = string> = BaseFieldConfig<
    TAccessor,
    'select'
> & {
    properties: SelectProperties & {
        items: readonly TItem[]
        label: ReactNode
        multiple?: boolean
        helperText?: ReactNode
        emptyLabel?: ReactNode
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

type AnySelectField<TAccessor extends string> = Omit<
    SelectFieldConfig<unknown, TAccessor>,
    'properties'
> & {
    properties: Omit<SelectFieldConfig<unknown>['properties'], 'getItemLabel' | 'getItemKey'> & {
        getItemLabel(item: unknown): ReactNode
        getItemKey(item: unknown): string | number
    }
}

export type ItemField<TAccessor extends string = string> =
    | TextFieldConfig<TAccessor>
    | NumberFieldConfig<TAccessor>
    | CheckboxFieldConfig<TAccessor>
    | AnyCheckboxGroupField<TAccessor>
    | AnySelectField<TAccessor>
