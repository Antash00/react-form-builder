import { type DefaultValues, type SubmitHandler, useForm } from 'react-hook-form'
import type { InferFormResult, InferFormValues, ItemField } from '../types'
import { TextFieldRenderer } from '../fields/text'
import { assertValidAccessors, buildFormResult } from '../helpers'
import { CheckboxFieldRenderer } from '../fields/checkbox'

type FormBuilderProps<TConfig extends readonly ItemField[]> = {
    config: TConfig
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
    const initialValues: Record<string, string | boolean> = {}
    for (const field of config) {
        const value = providedValues.get(field.accessor)
        switch (field.type) {
            case 'text':
                initialValues[field.accessor] = typeof value === 'string' ? value : ''
                break
            case 'checkbox':
                initialValues[field.accessor] = typeof value === 'boolean' ? value : false
                break
        }
    }

    // Every configured field has an initialized value matching its field type.
    return initialValues as DefaultValues<InferFormValues<TConfig>>
}

export const FormBuilder = <const TConfig extends readonly ItemField[]>({
    config,
    defaultValues,
    onSubmit,
}: FormBuilderProps<TConfig>) => {
    type FormValues = InferFormValues<TConfig>

    assertValidAccessors(config)
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: buildInitialValues(config, defaultValues),
    })

    const handleFormSubmit: SubmitHandler<FormValues> = (values) => {
        const result = buildFormResult(config, values)
        return onSubmit(values, result)
    }

    return (
        <form noValidate onSubmit={handleSubmit(handleFormSubmit)}>
            {config.map((field) => {
                switch (field.type) {
                    case 'text':
                        return (
                            <TextFieldRenderer<FormValues>
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
                }
            })}

            <button type="submit">Submit</button>
        </form>
    )
}
