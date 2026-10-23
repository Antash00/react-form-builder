import { TextField } from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { NumberFieldConfig } from '../../types'
import { isRequired } from '../../helpers'

type NumberFieldRendererProps<TFieldValues extends FieldValues> = {
    config: NumberFieldConfig
    control: Control<TFieldValues>
}

export const NumberFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: NumberFieldRendererProps<TFieldValues>) => {
    const name = config.accessor as FieldPath<TFieldValues>
    const required = isRequired(config.rules?.required)

    return (
        <Controller
            name={name}
            control={control}
            rules={config.properties?.disabled ? undefined : config.rules}
            render={({ field, fieldState }) => (
                <TextField
                    {...config.properties}
                    type="number"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                        const rawValue = event.target.value
                        field.onChange(rawValue === '' ? null : Number(rawValue))
                    }}
                    id={config.id}
                    className={config.className}
                    inputRef={field.ref}
                    required={required}
                    value={field.value ?? ''}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message ?? config.properties?.helperText}
                />
            )}
        />
    )
}
