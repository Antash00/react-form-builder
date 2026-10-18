import { type DefaultValues, type SubmitHandler, useForm } from 'react-hook-form'
import type { InferFormResult, InferFormValues, ItemField } from '../types'
import { TextFieldRenderer } from '../fields/text'
import { assertValidAccessors, buildFormResult } from '../helpers'

type FormBuilderProps<TConfig extends readonly ItemField[]> = {
    config: TConfig
    defaultValues?: DefaultValues<InferFormValues<TConfig>>
    onSubmit: (
        values: InferFormValues<TConfig>,
        result: InferFormResult<TConfig>,
    ) => void | Promise<void>
}

export const FormBuilder = <const TConfig extends readonly ItemField[]>({
    config,
    defaultValues,
    onSubmit,
}: FormBuilderProps<TConfig>) => {
    type FormValues = InferFormValues<TConfig>

    assertValidAccessors(config)
    const initialValues: Record<string, string> = Object.fromEntries(
        config.map(({ accessor }) => [accessor, '']),
    )
    for (const [accessor, value] of Object.entries(defaultValues ?? {})) {
        if (Object.hasOwn(initialValues, accessor) && typeof value === 'string') {
            initialValues[accessor] = value
        }
    }
    // Every configured field currently has a string value and an initialized key.
    const formDefaultValues = initialValues as DefaultValues<FormValues>
    const { control, handleSubmit } = useForm<FormValues>({ defaultValues: formDefaultValues })

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
                }
            })}

            <button type="submit">Submit</button>
        </form>
    )
}
