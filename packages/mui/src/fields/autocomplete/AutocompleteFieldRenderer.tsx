import { Autocomplete, TextField } from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { AutocompleteFieldConfig } from '../../types'
import { isRequired } from '../../helpers'

type AutocompleteFieldRendererProps<TFieldValues extends FieldValues> = {
    config: AutocompleteFieldConfig
    control: Control<TFieldValues>
}

export const AutocompleteFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: AutocompleteFieldRendererProps<TFieldValues>) => {
    const name = config.accessor as FieldPath<TFieldValues>
    const { label, helperText, multiple, ...autocompleteProps } = config.properties
    const required = isRequired(config.rules?.required)

    return (
        <Controller
            name={name}
            control={control}
            rules={config.properties.disabled ? undefined : config.rules}
            render={({ field, fieldState }) => (
                <Autocomplete
                    {...autocompleteProps}
                    id={config.id}
                    className={config.className}
                    multiple={multiple === true}
                    value={
                        multiple
                            ? Array.isArray(field.value)
                                ? field.value
                                : []
                            : (field.value ?? null)
                    }
                    onChange={(_, value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name={field.name}
                            inputRef={field.ref}
                            label={label}
                            required={required}
                            error={fieldState.invalid}
                            helperText={fieldState.error?.message ?? helperText}
                        />
                    )}
                />
            )}
        />
    )
}
