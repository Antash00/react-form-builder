import { useId } from 'react'
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
} from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { CheckboxGroupFieldConfig } from '../../types'
import { hasSupportingText, isRequired } from '../../helpers'

type CheckboxGroupFieldRendererProps<TFieldValues extends FieldValues> = {
    config: CheckboxGroupFieldConfig
    control: Control<TFieldValues>
}

export const CheckboxGroupFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: CheckboxGroupFieldRendererProps<TFieldValues>) => {
    // FormBuilder infers this path from the validated flat config.
    const name = config.accessor as FieldPath<TFieldValues>
    const generatedLabelId = useId()
    const labelId = config.id ?? generatedLabelId
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
                        <FormGroup {...groupProps} role="group" aria-labelledby={labelId}>
                            {items.map((item, index) => {
                                const itemKey = getItemKey(item)
                                const checked = field.value.some(
                                    (selected: unknown) => getItemKey(selected) === itemKey,
                                )
                                const toggleItem = (nextChecked: boolean) => {
                                    if (nextChecked) {
                                        field.onChange([...field.value, item])
                                        return
                                    }
                                    field.onChange(
                                        field.value.filter(
                                            (selected: unknown) => getItemKey(selected) !== itemKey,
                                        ),
                                    )
                                }

                                return (
                                    <FormControlLabel
                                        key={itemKey}
                                        label={getItemLabel(item)}
                                        control={
                                            <Checkbox
                                                name={field.name}
                                                checked={checked}
                                                onBlur={field.onBlur}
                                                onChange={(_, nextChecked) =>
                                                    toggleItem(nextChecked)
                                                }
                                                slotProps={{
                                                    input: {
                                                        ref: index === 0 ? field.ref : undefined,
                                                        'aria-invalid': fieldState.invalid,
                                                        'aria-describedby': showSupportingText
                                                            ? helperTextId
                                                            : undefined,
                                                    },
                                                }}
                                                {...(fieldState.error
                                                    ? { color: 'error' as const }
                                                    : {})}
                                            />
                                        }
                                    />
                                )
                            })}
                        </FormGroup>
                        {showSupportingText && (
                            <FormHelperText id={helperTextId}>{supportingText}</FormHelperText>
                        )}
                    </FormControl>
                )
            }}
        />
    )
}
