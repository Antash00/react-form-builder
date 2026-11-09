import { type DefaultValues, type SubmitHandler, useForm } from 'react-hook-form'
import { type SubmitEventHandler, useRef } from 'react'
import type { FieldGroup, InferFormResult, InferFormValues, ItemField } from '../types/index.js'
import { TextFieldRenderer } from '../fields/text/index.js'
import { assertValidAccessors, buildFormResult } from '../helpers/index.js'
import { CheckboxFieldRenderer } from '../fields/checkbox/index.js'
import { CheckboxGroupFieldRenderer } from '../fields/checkbox-group/index.js'
import { SelectFieldRenderer } from '../fields/select/index.js'
import { NumberFieldRenderer } from '../fields/number/index.js'
import { AutocompleteFieldRenderer } from '../fields/autocomplete/index.js'
import { RadioGroupFieldRenderer } from '../fields/radio-group/index.js'
import { Button, Grid, Stack, type ButtonProps } from '@mui/material'

type ControlledButtonProps = 'type' | 'href' | 'component' | 'form'
type ActionButtonProps = Omit<ButtonProps, ControlledButtonProps> & {
    [TKey in ControlledButtonProps]?: never
}

type FormBuilderProps<TConfig extends readonly ItemField[]> = {
    /** Remount FormBuilder to use a different field configuration. */
    config: TConfig
    groups?: readonly FieldGroup<NoInfer<TConfig[number]['accessor']>>[]
    defaultValues?: NoInfer<Partial<InferFormValues<TConfig>>>
    submitButtonProps?: ActionButtonProps
    resetButtonProps?: ActionButtonProps | false
    onSubmit: (
        values: InferFormValues<TConfig>,
        result: InferFormResult<TConfig>,
    ) => void | Promise<void>
}

function buildInitialValues<TConfig extends readonly ItemField[]>(
    config: TConfig,
    defaultValues?: Partial<InferFormValues<TConfig>>,
): DefaultValues<InferFormValues<TConfig>> {
    const providedValues = new Map(Object.entries(defaultValues ?? {}))
    const initialValues: Record<string, unknown> = {}
    for (const field of config) {
        const value = providedValues.get(field.accessor)
        switch (field.type) {
            case 'text':
                initialValues[field.accessor] = typeof value === 'string' ? value : ''
                break
            case 'number':
                initialValues[field.accessor] = typeof value === 'number' ? value : null
                break
            case 'checkbox':
                initialValues[field.accessor] = typeof value === 'boolean' ? value : false
                break
            case 'checkboxGroup':
                initialValues[field.accessor] = Array.isArray(value)
                    ? field.properties.items.filter((item) =>
                          value.some(
                              (selected) =>
                                  field.properties.getItemKey(selected) ===
                                  field.properties.getItemKey(item),
                          ),
                      )
                    : []
                break
            case 'radioGroup':
                initialValues[field.accessor] =
                    field.properties.items.find(
                        (item) =>
                            value != null &&
                            field.properties.getItemKey(item) ===
                                field.properties.getItemKey(value),
                    ) ?? null
                break
            case 'select':
                initialValues[field.accessor] = field.properties.multiple
                    ? Array.isArray(value)
                        ? field.properties.items.filter((item) =>
                              value.some(
                                  (selected) =>
                                      field.properties.getItemKey(selected) ===
                                      field.properties.getItemKey(item),
                              ),
                          )
                        : []
                    : (field.properties.items.find(
                          (item) =>
                              value != null &&
                              field.properties.getItemKey(item) ===
                                  field.properties.getItemKey(value),
                      ) ?? null)
                break
            case 'autocomplete':
                initialValues[field.accessor] = field.properties.multiple
                    ? Array.isArray(value)
                        ? value
                        : []
                    : (value ?? null)
                break
        }
    }

    // Every configured field has an initialized value matching its field type.
    return initialValues as DefaultValues<InferFormValues<TConfig>>
}

export const FormBuilder = <const TConfig extends readonly ItemField[]>({
    config,
    groups,
    defaultValues,
    submitButtonProps,
    resetButtonProps,
    onSubmit,
}: FormBuilderProps<TConfig>) => {
    type FormValues = InferFormValues<TConfig>

    assertValidAccessors(config)
    const submittingRef = useRef(false)
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        defaultValues: buildInitialValues(config, defaultValues),
    })

    const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
        const result = buildFormResult(config, values)
        await onSubmit(values, result)
    }

    const submit = handleSubmit(handleFormSubmit)
    const handleFormEvent: SubmitEventHandler<HTMLFormElement> = async (event) => {
        if (submittingRef.current) {
            event.preventDefault()
            return
        }
        submittingRef.current = true
        try {
            await submit(event)
        } finally {
            submittingRef.current = false
        }
    }

    const renderField = (field: TConfig[number]) => {
        switch (field.type) {
            case 'text':
                return (
                    <TextFieldRenderer<FormValues>
                        key={field.accessor}
                        config={field}
                        control={control}
                    />
                )
            case 'number':
                return (
                    <NumberFieldRenderer<FormValues>
                        key={field.accessor}
                        config={field}
                        control={control}
                    />
                )
            case 'checkbox':
                return (
                    <CheckboxFieldRenderer<FormValues>
                        key={field.accessor}
                        config={field}
                        control={control}
                    />
                )
            case 'checkboxGroup':
                return (
                    <CheckboxGroupFieldRenderer<FormValues>
                        key={field.accessor}
                        config={field}
                        control={control}
                    />
                )
            case 'radioGroup':
                return (
                    <RadioGroupFieldRenderer<FormValues>
                        key={field.accessor}
                        config={field}
                        control={control}
                    />
                )
            case 'select':
                return (
                    <SelectFieldRenderer<FormValues>
                        key={field.accessor}
                        config={field}
                        control={control}
                    />
                )
            case 'autocomplete':
                return (
                    <AutocompleteFieldRenderer<FormValues>
                        key={field.accessor}
                        config={field}
                        control={control}
                    />
                )
        }
    }

    const fieldsByAccessor = new Map(config.map((field) => [field.accessor, field]))
    const groupedAccessors = new Set<string>()
    const groupedFields = groups?.map((group) => {
        const fields = group.fields.map((accessor) => {
            const field = fieldsByAccessor.get(accessor)
            if (!field) {
                throw new Error(`Unknown group field "${accessor}": no matching field in config`)
            }
            if (groupedAccessors.has(accessor)) {
                throw new Error(`Duplicate group field "${accessor}": each field can appear once`)
            }
            groupedAccessors.add(accessor)
            return field
        })
        return { group, fields }
    })
    const ungroupedFields = config.filter((field) => !groupedAccessors.has(field.accessor))
    const resetProps = resetButtonProps === false ? null : resetButtonProps

    return (
        <form noValidate onSubmit={handleFormEvent}>
            <Stack spacing={2}>
                {groupedFields?.map(({ group, fields }, index) => (
                    <Grid container columns={group.columns} spacing={group.gap} key={index}>
                        {fields.map((field) => (
                            <Grid size={1} key={field.accessor}>
                                {renderField(field)}
                            </Grid>
                        ))}
                    </Grid>
                ))}
                {ungroupedFields.length > 0 && (
                    <Grid container columns={1} spacing={2}>
                        {ungroupedFields.map((field) => (
                            <Grid size={1} key={field.accessor}>
                                {renderField(field)}
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    {...submitButtonProps}
                    type="submit"
                    disabled={isSubmitting || submitButtonProps?.disabled}
                >
                    {submitButtonProps?.children ?? 'Submit'}
                </Button>
                {resetProps !== null && (
                    <Button
                        variant="outlined"
                        {...resetProps}
                        type="reset"
                        onClick={(event) => {
                            resetProps?.onClick?.(event)
                            if (!event.defaultPrevented) reset()
                        }}
                    >
                        {resetProps?.children ?? 'Reset'}
                    </Button>
                )}
            </Stack>
        </form>
    )
}
