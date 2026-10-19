import { useId } from 'react'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { CheckboxFieldConfig } from '../../types'
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    type CheckboxProps,
} from '@mui/material'

type CheckboxFieldRendererProps<TFieldValues extends FieldValues> = {
    config: CheckboxFieldConfig
    control: Control<TFieldValues>
}
export const CheckboxFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: CheckboxFieldRendererProps<TFieldValues>) => {
    const name = config.accessor as FieldPath<TFieldValues>
    const requiredRule = config.rules?.required
    const required = typeof requiredRule === 'object' ? requiredRule.value : Boolean(requiredRule)
    const helperTextId = useId()
    const { label, helperText, ...checkboxProperties } = config.properties ?? {}
    // The config type excludes RHF-owned props; only label and helperText are adapter additions.
    const muiProperties = checkboxProperties as CheckboxProps

    return (
        <Controller
            name={name}
            control={control}
            rules={config.rules}
            render={({ field, fieldState }) => {
                const supportingText = fieldState.error?.message ?? helperText
                const hasSupportingText =
                    supportingText !== undefined &&
                    supportingText !== null &&
                    supportingText !== false &&
                    supportingText !== ''
                const checkbox = (
                    <Checkbox
                        {...muiProperties}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(event) => field.onChange(event.target.checked)}
                        id={config.id}
                        slotProps={{
                            input: (ownerState) => {
                                const inputProps = config.properties?.slotProps?.input
                                const resolvedInputProps =
                                    typeof inputProps === 'function'
                                        ? inputProps(ownerState)
                                        : inputProps
                                const describedBy = [
                                    resolvedInputProps?.['aria-describedby'],
                                    hasSupportingText ? helperTextId : undefined,
                                ]
                                    .filter(Boolean)
                                    .join(' ')

                                return {
                                    ...resolvedInputProps,
                                    ref: field.ref,
                                    'aria-invalid': fieldState.invalid,
                                    'aria-describedby': describedBy || undefined,
                                }
                            },
                        }}
                        required={required}
                        checked={field.value}
                        color={fieldState.error ? 'error' : (config.properties?.color ?? 'primary')}
                    />
                )

                return (
                    <FormControl
                        className={config.className}
                        error={fieldState.invalid}
                        required={required}
                        disabled={config.properties?.disabled}
                    >
                        {label == null ? (
                            checkbox
                        ) : (
                            <FormControlLabel
                                control={checkbox}
                                label={label}
                                required={required}
                            />
                        )}
                        {hasSupportingText && (
                            <FormHelperText id={helperTextId}>{supportingText}</FormHelperText>
                        )}
                    </FormControl>
                )
            }}
        />
    )
}
