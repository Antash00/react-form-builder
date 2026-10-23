import { type DefaultValues, type SubmitHandler, useForm } from 'react-hook-form'
import type { FieldGroup, InferFormResult, InferFormValues, ItemField } from '../types'
import { TextFieldRenderer } from '../fields/text'
import { assertValidAccessors, buildFormResult } from '../helpers'
import { CheckboxFieldRenderer } from '../fields/checkbox'
import { CheckboxGroupFieldRenderer } from '../fields/checkbox-group'
import { SelectFieldRenderer } from '../fields/select'
import { NumberFieldRenderer } from '../fields/number'
import { AutocompleteFieldRenderer } from '../fields/autocomplete'
import { RadioGroupFieldRenderer } from '../fields/radio-group'
import Grid from '@mui/material/Grid'
import { Button, Stack } from '@mui/material'

type FormBuilderProps<TConfig extends readonly ItemField[]> = {
    config: TConfig
    groups?: readonly FieldGroup<NoInfer<TConfig[number]['accessor']>>[]
    defaultValues?: DefaultValues<InferFormValues<TConfig>>
    onSubmit: (
        values: InferFormValues<TConfig>,
        result: InferFormResult<TConfig>,
    ) => void | Promise<void>
}

function buildInitialValues<TConfig extends readonly ItemField[]>(
    config: TConfig,
    defaultValues?: DefaultValues<InferFormValues<TConfig>>,
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
                initialValues[field.accessor] = Array.isArray(value) ? value : []
                break
            case 'radioGroup':
                initialValues[field.accessor] = value ?? null
                break
            case 'select':
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
    onSubmit,
}: FormBuilderProps<TConfig>) => {
    type FormValues = InferFormValues<TConfig>

    assertValidAccessors(config)
    const { control, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: buildInitialValues(config, defaultValues),
    })

    const handleFormSubmit: SubmitHandler<FormValues> = (values) => {
        const result = buildFormResult(config, values)
        return onSubmit(values, result)
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

    return (
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
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
            <Stack direction="row" spacing={2}>
                <Button variant="contained" type="submit">
                    Submit
                </Button>
                <Button variant="outlined" type="reset" onClick={() => reset()}>
                    Reset
                </Button>
            </Stack>
        </form>
    )
}
