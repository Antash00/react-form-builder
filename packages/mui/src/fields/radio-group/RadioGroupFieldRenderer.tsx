import { useId } from 'react'
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { RadioGroupFieldConfig } from '../../types'
import { hasSupportingText, isRequired } from '../../helpers'

type RadioGroupFieldRendererProps<TFieldValues extends FieldValues> = {
    config: RadioGroupFieldConfig
    control: Control<TFieldValues>
}

export const RadioGroupFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: RadioGroupFieldRendererProps<TFieldValues>) => {
    // FormBuilder infers this path from the validated flat config.
    const name = config.accessor as FieldPath<TFieldValues>
    const generatedId = useId()
    const labelId = config.id ?? generatedId
    const helperTextId = `${labelId}-helper-text`
    const { items, label, helperText, disabled, getItemLabel, getItemKey, ...groupProps } =
        config.properties
    const required = isRequired(config.rules?.required)

    return (
        <Controller
            name={name}
            control={control}
            rules={disabled ? undefined : config.rules}
            render={({ field, fieldState }) => {
                const selectedKey = field.value == null ? null : getItemKey(field.value)
                const selectedIndex = items.findIndex((item) => getItemKey(item) === selectedKey)
                const supportingText = fieldState.error?.message ?? helperText
                const showSupportingText = hasSupportingText(supportingText)

                return (
                    <FormControl
                        className={config.className}
                        error={fieldState.invalid}
                        required={required}
                        disabled={disabled}
                    >
                        <FormLabel id={labelId}>{label}</FormLabel>
                        <RadioGroup
                            {...groupProps}
                            name={field.name}
                            value={selectedIndex < 0 ? '' : String(selectedIndex)}
                            onBlur={field.onBlur}
                            onChange={(_, value) => field.onChange(items[Number(value)] ?? null)}
                            aria-labelledby={labelId}
                            aria-describedby={showSupportingText ? helperTextId : undefined}
                        >
                            {items.map((item, index) => (
                                <FormControlLabel
                                    key={getItemKey(item)}
                                    value={String(index)}
                                    label={getItemLabel(item)}
                                    control={
                                        <Radio
                                            slotProps={{
                                                input: {
                                                    ref: index === 0 ? field.ref : undefined,
                                                    'aria-invalid': fieldState.invalid,
                                                },
                                            }}
                                        />
                                    }
                                />
                            ))}
                        </RadioGroup>
                        {showSupportingText && (
                            <FormHelperText id={helperTextId}>{supportingText}</FormHelperText>
                        )}
                    </FormControl>
                )
            }}
        />
    )
}
