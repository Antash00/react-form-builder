import { TextField } from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { TextFieldConfig } from '../../types'
import { isRequired } from '../../helpers'

type TextFieldRendererProps<TFieldValues extends FieldValues> = {
    config: TextFieldConfig
    control: Control<TFieldValues>
}

export const TextFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: TextFieldRendererProps<TFieldValues>) => {
    const name = config.accessor as FieldPath<TFieldValues>
    const required = isRequired(config.rules?.required)

    return (
        <Controller
            name={name}
            control={control}
            rules={config.properties?.disabled ? undefined : config.rules}
            render={({ field: { ref, ...field }, fieldState }) => (
                <TextField
                    {...config.properties}
                    {...field}
                    id={config.id}
                    className={config.className}
                    inputRef={ref}
                    required={required}
                    value={field.value ?? ''}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message ?? config.properties?.helperText}
                />
            )}
        />
    )
}
