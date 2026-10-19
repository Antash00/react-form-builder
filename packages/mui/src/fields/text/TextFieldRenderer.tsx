import { TextField } from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { TextFieldConfig } from '../../types'

type TextFieldRendererProps<TFieldValues extends FieldValues> = {
    config: TextFieldConfig
    control: Control<TFieldValues>
}

export const TextFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: TextFieldRendererProps<TFieldValues>) => {
    const name = config.accessor as FieldPath<TFieldValues>
    const requiredRule = config.rules?.required
    const required = typeof requiredRule === 'object' ? requiredRule.value : Boolean(requiredRule)

    return (
        <Controller
            name={name}
            control={control}
            rules={config.rules}
            render={({ field: { ref, ...field }, fieldState }) => (
                <TextField
                    {...config.properties}
                    {...field}
                    id={config.id}
                    className={config.className}
                    inputRef={ref}
                    required={required}
                    value={field.value ?? ''}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message ?? config.properties?.helperText}
                />
            )}
        />
    )
}
