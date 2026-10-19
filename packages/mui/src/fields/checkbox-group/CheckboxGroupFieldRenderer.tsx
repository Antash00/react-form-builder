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
    const helperTextId = useId()
    const { items, label, helperText, disabled, getItemLabel, getItemKey, ...groupProps } =
        config.properties
    const requiredRule = config.rules?.required
    const required = typeof requiredRule === 'object' ? requiredRule.value : Boolean(requiredRule)

    return (
        <Controller
            name={name}
            control={control}
            rules={disabled ? undefined : config.rules}
            render={({ field, fieldState }) => {
                const supportingText = fieldState.error?.message ?? helperText
                const hasSupportingText =
                    supportingText !== undefined &&
                    supportingText !== null &&
                    supportingText !== false &&
                    supportingText !== ''

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
                                                        'aria-describedby': hasSupportingText
                                                            ? helperTextId
                                                            : undefined,
                                                    },
                                                }}
                                                color={fieldState.error ? 'error' : 'primary'}
                                            />
                                        }
                                    />
                                )
                            })}
                        </FormGroup>
                        {hasSupportingText && (
                            <FormHelperText id={helperTextId}>{supportingText}</FormHelperText>
                        )}
                    </FormControl>
                )
            }}
        />
    )
}
