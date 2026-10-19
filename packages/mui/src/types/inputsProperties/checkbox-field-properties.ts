import type { InputHTMLAttributes, ReactNode } from 'react'
import type { CheckboxOwnerState, CheckboxProps } from '@mui/material'

// FormBuilder and RHF supply these props to the Checkbox itself.
type ControlledCheckboxProps =
    | 'checked'
    | 'defaultChecked'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'type'
    | 'required'
    | 'id'
    | 'className'
    | 'ref'
    | 'slots'
    | 'slotProps'
    | 'children'
    | 'dangerouslySetInnerHTML'

// The input slot may customize HTML attributes but cannot replace RHF wiring.
type ControlledInputProps =
    | 'checked'
    | 'defaultChecked'
    | 'onChange'
    | 'onBlur'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'type'
    | 'required'
    | 'disabled'
    | 'id'
    | 'ref'
    | 'aria-checked'
    | 'aria-invalid'
    | 'data-indeterminate'
    | 'children'
    | 'dangerouslySetInnerHTML'

type CheckboxInputProperties = Omit<
    InputHTMLAttributes<HTMLInputElement> & {
        [attribute: `data-${string}`]: string | number | boolean | null | undefined
    },
    ControlledInputProps
> & { [TKey in ControlledInputProps]?: never }

export type CheckboxFieldProperties = Omit<CheckboxProps, ControlledCheckboxProps> & {
    [TKey in Exclude<ControlledCheckboxProps, 'slotProps'>]?: never
} & {
    label?: ReactNode
    helperText?: ReactNode
    slotProps?: {
        input?:
            CheckboxInputProperties | ((ownerState: CheckboxOwnerState) => CheckboxInputProperties)
        root?: never
    }
}
