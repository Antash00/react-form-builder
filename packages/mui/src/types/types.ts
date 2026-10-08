import type { RegisterOptions } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";

export type BaseFieldConfig<TAccessor extends string = string, TType extends string = string> = {
    accessor: TAccessor
    type: TType
    id?: string
    className?: string
}
export type TextFieldConfig<TAccessor extends string = string> = BaseFieldConfig<TAccessor, 'text'> & {
    properties?: Omit<
        TextFieldProps,
        | 'name'
        | 'value'
        | 'defaultValue'
        | 'onChange'
        | 'onBlur'
        | 'error'
        | 'id'
        | 'className'
    >

    rules?: Pick<
        RegisterOptions,
        'required' | 'minLength' | 'maxLength' | 'pattern'
    >
}

export type ItemField<TAccessor extends string = string> =
    TextFieldConfig<TAccessor>