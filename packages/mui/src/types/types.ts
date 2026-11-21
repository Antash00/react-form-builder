import type { RegisterOptions } from 'react-hook-form'
import type { ReactNode } from 'react'
import type {
    AutocompleteProps,
    FormGroupProps,
    GridProps,
    RadioGroupProps,
    SelectProps,
} from '@mui/material'
import type { CheckboxFieldProperties, TextFieldProperties } from './inputsProperties/index.js'

type WithoutProps<TProps, TKeys extends PropertyKey> = TProps extends unknown
    ? Omit<TProps, TKeys> & { [TKey in TKeys]?: never }
    : never

export type NumberFieldProperties = WithoutProps<
    TextFieldProperties,
    'type' | 'multiline' | 'rows' | 'minRows' | 'maxRows'
>

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

type ControlledCheckboxGroupProps =
    'children' | 'onChange' | 'onBlur' | 'id' | 'className' | 'role' | 'aria-labelledby'

export type CheckboxGroupFieldConfig<
    TItem = unknown,
    TAccessor extends string = string,
> = BaseFieldConfig<TAccessor, 'checkboxGroup'> & {
    properties: WithoutProps<FormGroupProps, ControlledCheckboxGroupProps> & {
        items: readonly TItem[]
        label: ReactNode
        helperText?: ReactNode
        disabled?: boolean
        getItemLabel: (item: TItem) => ReactNode
        getItemKey: (item: TItem) => string | number
    }
    rules?: Pick<RegisterOptions, 'required'>
}

type ControlledRadioGroupProps =
    | 'children'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'ref'
    | 'id'
    | 'className'
    | 'aria-labelledby'
    | 'aria-describedby'

export type RadioGroupFieldConfig<
    TItem = unknown,
    TAccessor extends string = string,
> = BaseFieldConfig<TAccessor, 'radioGroup'> & {
    properties: WithoutProps<RadioGroupProps, ControlledRadioGroupProps> & {
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
type SelectProperties = WithoutProps<SelectProps, ControlledSelectProps>

type SelectFieldProperties<TItem> = SelectProperties & {
    items: readonly TItem[]
    label: ReactNode
    helperText?: ReactNode
    emptyLabel?: ReactNode
    getItemLabel: (item: TItem) => ReactNode
    getItemKey: (item: TItem) => string | number
}

export type SelectFieldConfig<TItem = unknown, TAccessor extends string = string> = BaseFieldConfig<
    TAccessor,
    'select'
> & {
    rules?: Pick<RegisterOptions, 'required'>
} & (
        | { properties: SelectFieldProperties<TItem> & { multiple: true } }
        | { properties: SelectFieldProperties<TItem> & { multiple?: false } }
    )

type ControlledAutocompleteProps =
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'renderInput'
    | 'freeSolo'
    | 'disableClearable'
    | 'id'
    | 'className'

type AutocompleteFieldProperties<TItem> = Omit<
    AutocompleteProps<TItem, boolean, false, false>,
    ControlledAutocompleteProps | 'getOptionLabel'
> & {
    [TKey in ControlledAutocompleteProps]?: never
} & {
    label: string
    helperText?: ReactNode
    getOptionLabel: (option: TItem) => string
}

export type AutocompleteFieldConfig<
    TItem = unknown,
    TAccessor extends string = string,
> = BaseFieldConfig<TAccessor, 'autocomplete'> & {
    rules?: Pick<RegisterOptions, 'required'>
} & (
        | { properties: AutocompleteFieldProperties<TItem> & { multiple: true } }
        | { properties: AutocompleteFieldProperties<TItem> & { multiple?: false } }
    )

type AnySelectableField<TField> = TField extends { properties: infer TProperties }
    ? Omit<TField, 'properties'> & {
          properties: Omit<TProperties, 'getItemLabel' | 'getItemKey'> & {
              getItemLabel(item: unknown): ReactNode
              getItemKey(item: unknown): string | number
          }
      }
    : never

type AnyCheckboxGroupField<TAccessor extends string> = AnySelectableField<
    CheckboxGroupFieldConfig<unknown, TAccessor>
>
type AnyRadioGroupField<TAccessor extends string> = AnySelectableField<
    RadioGroupFieldConfig<unknown, TAccessor>
>
type AnySelectField<TAccessor extends string> = AnySelectableField<
    SelectFieldConfig<unknown, TAccessor>
>

type AnyAutocompleteField<TAccessor extends string> = BaseFieldConfig<TAccessor, 'autocomplete'> & {
    properties: {
        options: readonly unknown[]
        label: string
        helperText?: ReactNode
        multiple?: boolean
        disabled?: boolean
        getOptionLabel(option: unknown): string
        getOptionKey?(option: unknown): string | number
        isOptionEqualToValue?(option: unknown, value: unknown): boolean
        groupBy?(option: unknown): string
    }
    rules?: Pick<RegisterOptions, 'required'>
}

export type ItemField<TAccessor extends string = string> =
    | TextFieldConfig<TAccessor>
    | NumberFieldConfig<TAccessor>
    | CheckboxFieldConfig<TAccessor>
    | AnyCheckboxGroupField<TAccessor>
    | AnyRadioGroupField<TAccessor>
    | AnySelectField<TAccessor>
    | AnyAutocompleteField<TAccessor>
