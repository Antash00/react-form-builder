import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'
import { type SubmitEventHandler, useRef, useState } from 'react'
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
import { buildInitialValues } from './initial-values.js'
import { resolveFieldGroups } from './resolve-field-groups.js'

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
    onInvalid?: SubmitErrorHandler<InferFormValues<TConfig>>
}

export const FormBuilder = <const TConfig extends readonly ItemField[]>({
    config,
    groups,
    defaultValues,
    submitButtonProps,
    resetButtonProps,
    onSubmit,
    onInvalid,
}: FormBuilderProps<TConfig>) => {
    type FormValues = InferFormValues<TConfig>

    assertValidAccessors(config)
    const [initialValues] = useState(() => buildInitialValues(config, defaultValues))
    const submittingRef = useRef(false)
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormValues>({
        defaultValues: initialValues,
    })

    const handleFormSubmit: SubmitHandler<FormValues> = async (values) => {
        const result = buildFormResult(config, values)
        await onSubmit(values, result)
    }

    const submit = handleSubmit(handleFormSubmit, onInvalid)
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
                return <TextFieldRenderer<FormValues> config={field} control={control} />
            case 'number':
                return <NumberFieldRenderer<FormValues> config={field} control={control} />
            case 'checkbox':
                return <CheckboxFieldRenderer<FormValues> config={field} control={control} />
            case 'checkboxGroup':
                return <CheckboxGroupFieldRenderer<FormValues> config={field} control={control} />
            case 'radioGroup':
                return <RadioGroupFieldRenderer<FormValues> config={field} control={control} />
            case 'select':
                return <SelectFieldRenderer<FormValues> config={field} control={control} />
            case 'autocomplete':
                return <AutocompleteFieldRenderer<FormValues> config={field} control={control} />
            default:
                throw new Error(`Unsupported field: ${JSON.stringify(field satisfies never)}`)
        }
    }

    const { groupedFields, ungroupedFields } = resolveFieldGroups(config, groups)
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
