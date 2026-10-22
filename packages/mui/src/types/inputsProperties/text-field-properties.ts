import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { TextFieldOwnerState, TextFieldProps } from '@mui/material'
import type { SlotCommonProps } from '@mui/material/utils'

// Unlike Omit alone, optional never also rejects props passed through variables.
type WithoutProps<T, TKeys extends PropertyKey> = T extends unknown
    ? Omit<T, TKeys> & { [TKey in TKeys]?: never }
    : never

// Restrict both object slots and callback return values, keeping MUI's ownerState.
type RestrictedSlot<T, TKeys extends PropertyKey> = T extends (
    ownerState: infer TOwnerState,
) => infer TProps
    ? (ownerState: TOwnerState) => WithoutProps<TProps, TKeys | 'component'>
    : WithoutProps<NonNullable<T>, TKeys | 'component'>

type ControlledTextFieldProps =
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'inputRef'
    | 'error'
    | 'required'
    | 'select'
    | 'id'
    | 'className'
    | 'slots'
    | 'children'
    | 'dangerouslySetInnerHTML'

type ControlledInputProps =
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'inputRef'
    | 'error'
    | 'required'
    | 'disabled'
    | 'id'
    | 'type'
    | 'aria-describedby'
    | 'inputComponent'
    | 'inputProps'
    | 'slots'
    | 'slotProps'
    | 'children'
    | 'dangerouslySetInnerHTML'
    | 'multiline'
    | 'rows'
    | 'minRows'
    | 'maxRows'

type TextInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url'

// MUI's native slot has an arbitrary string/any index signature. Derive this slot
// from React's native attributes so forbidden props cannot bypass the contract.
type HtmlInputProperties = WithoutProps<
    InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> &
        TextareaHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> &
        SlotCommonProps & {
            [attribute: `data-${string}`]: string | number | boolean | null | undefined
        },
    | 'component'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'ref'
    | 'id'
    | 'required'
    | 'disabled'
    | 'type'
    | 'aria-invalid'
    | 'aria-describedby'
    | 'children'
    | 'dangerouslySetInnerHTML'
>

type TextFieldSlots<TSlots extends NonNullable<TextFieldProps['slotProps']>> = {
    root?: RestrictedSlot<
        TSlots['root'],
        'error' | 'required' | 'disabled' | 'children' | 'dangerouslySetInnerHTML'
    >
    input?: RestrictedSlot<TSlots['input'], ControlledInputProps>
    htmlInput?: HtmlInputProperties | ((ownerState: TextFieldOwnerState) => HtmlInputProperties)
    inputLabel?: RestrictedSlot<
        TSlots['inputLabel'],
        | 'id'
        | 'htmlFor'
        | 'children'
        | 'error'
        | 'required'
        | 'disabled'
        | 'dangerouslySetInnerHTML'
    >
    formHelperText?: RestrictedSlot<
        TSlots['formHelperText'],
        'id' | 'children' | 'error' | 'required' | 'disabled' | 'dangerouslySetInnerHTML'
    >
    select?: never
}

type TextFieldVariantProperties<TProps extends TextFieldProps> = WithoutProps<
    Omit<TProps, 'type' | 'slotProps' | 'variant'>,
    ControlledTextFieldProps
> & {
    type?: TextInputType
    slotProps?: TextFieldSlots<NonNullable<TProps['slotProps']>>
}

// MUI defaults to outlined. Keep the slot props tied to the actual variant.
export type TextFieldProperties =
    | (TextFieldVariantProperties<TextFieldProps<'outlined'>> & { variant?: 'outlined' })
    | (TextFieldVariantProperties<TextFieldProps<'filled'>> & { variant: 'filled' })
    | (TextFieldVariantProperties<TextFieldProps<'standard'>> & { variant: 'standard' })
