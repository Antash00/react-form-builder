import { useId } from 'react'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import type { SelectFieldConfig } from '../../types'

type SelectFieldRendererProps<TFieldValues extends FieldValues> = {
    config: SelectFieldConfig
    control: Control<TFieldValues>
}

export const SelectFieldRenderer = <TFieldValues extends FieldValues>({
    config,
    control,
}: SelectFieldRendererProps<TFieldValues>) => {
    const name = config.accessor as FieldPath<TFieldValues>
    const generatedId = useId()
    const id = config.id ?? generatedId
    const labelId = `${id}-label`
    const helperTextId = `${id}-helper-text`
    const {
        items,
        getItemLabel,
        getItemKey,
        helperText,
        emptyLabel,
        label,
        multiple,
        'aria-describedby': externalDescription,
        ...selectProps
    } = config.properties
    const requiredRule = config.rules?.required
    const required = typeof requiredRule === 'object' ? requiredRule.value : Boolean(requiredRule)

    return (
        <Controller
            name={name}
            control={control}
            rules={config.properties.disabled ? undefined : config.rules}
            render={({ field, fieldState }) => {
                const selectedItems =
                    multiple && Array.isArray(field.value)
                        ? field.value
                        : !multiple && field.value != null
                          ? [field.value]
                          : []
                const selectedKeys = new Set(selectedItems.map(getItemKey))
                const selectedIndices = items.flatMap((item, index) =>
                    selectedKeys.has(getItemKey(item)) ? [String(index)] : [],
                )
                const value = multiple ? selectedIndices : (selectedIndices[0] ?? '')
                const supportingText = fieldState.error?.message ?? helperText
                const hasSupportingText =
                    supportingText != null && supportingText !== false && supportingText !== ''
                const describedBy =
                    [externalDescription, hasSupportingText && helperTextId]
                        .filter(Boolean)
                        .join(' ') || undefined

                return (
                    <FormControl
                        className={config.className}
                        error={fieldState.invalid}
                        required={required}
                        disabled={config.properties.disabled}
                        fullWidth={config.properties.fullWidth}
                        variant={config.properties.variant}
                        size={config.properties.size}
                        color={config.properties.color}
                        margin={config.properties.margin}
                    >
                        <InputLabel id={labelId} variant={config.properties.variant}>
                            {label}
                        </InputLabel>
                        <Select
                            {...selectProps}
                            id={id}
                            labelId={labelId}
                            label={label}
                            name={field.name}
                            inputRef={field.ref}
                            multiple={multiple === true}
                            value={value}
                            onBlur={field.onBlur}
                            onChange={(event) => {
                                if (multiple) {
                                    const value = event.target.value
                                    const indices = Array.isArray(value) ? value : [value]
                                    field.onChange(
                                        indices.flatMap((index) => {
                                            const selected = items[Number(index)]
                                            return selected === undefined ? [] : [selected]
                                        }),
                                    )
                                    return
                                }
                                const selected = items[Number(event.target.value)]
                                field.onChange(
                                    event.target.value === '' ? null : (selected ?? null),
                                )
                            }}
                            required={required}
                            aria-invalid={fieldState.invalid}
                            aria-describedby={describedBy}
                        >
                            {!multiple && emptyLabel !== undefined && (
                                <MenuItem value="">{emptyLabel}</MenuItem>
                            )}
                            {items.map((item, index) => (
                                <MenuItem key={getItemKey(item)} value={String(index)}>
                                    {getItemLabel(item)}
                                </MenuItem>
                            ))}
                        </Select>
                        {hasSupportingText && (
                            <FormHelperText id={helperTextId}>{supportingText}</FormHelperText>
                        )}
                    </FormControl>
                )
            }}
        />
    )
}
