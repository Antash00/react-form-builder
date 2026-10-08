import { TextField } from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues, } from 'react-hook-form'
import type { TextFieldConfig } from "../../types";

type TextFieldRendererProps<
    TFieldValues extends FieldValues,
> = {
    config: TextFieldConfig
    control: Control<TFieldValues>
}


export function TextFieldRenderer<TFieldValues extends FieldValues>({
                                                                        config,
                                                                        control,
                                                                    }: TextFieldRendererProps<TFieldValues>) {
    const name = config.accessor as FieldPath<TFieldValues>

    return (
        <Controller
            name={ name }
            control={ control }
            rules={ config.rules }
            render={ ({ field, fieldState }) => (
                <TextField
                    { ...config.properties }
                    { ...field }
                    value={ field.value ?? '' }
                    error={ Boolean(fieldState.error) }
                    helperText={
                        fieldState.error?.message ??
                        config.properties?.helperText
                    }
                />
            ) }
        />
    )
}